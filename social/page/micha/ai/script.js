// ---- config ----
// This is the only place the endpoint URL lives. Users can't change it from the page.
const API_URL = "https://kabonkel.pythonanywhere.com/api/ask";

// ---- elements ----
const statusEl = document.getElementById("status");
const statusDot = document.getElementById("statusDot");
const statusLabel = document.getElementById("statusLabel");
const log = document.getElementById("log");
const logEmpty = document.getElementById("logEmpty");
const composer = document.getElementById("composer");
const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");

let conversation = []; // { role: "user" | "model", content: string }

// ---- status ----
function setStatus(state, label) {
  statusEl.className = "status" + (state ? ` status--${state}` : "");
  statusLabel.textContent = label;
}

async function checkConnection() {
  setStatus("", "checking connection…");
  try {
    // A lightweight check — most Flask apps will respond to a HEAD/GET
    // even if it 404s, which still tells us the server is reachable.
    await fetch(API_URL, { method: "OPTIONS" });
    setStatus("live", "endpoint reachable");
  } catch (err) {
    setStatus("error", "can't reach endpoint");
  }
}

// ---- textarea auto-grow ----
messageInput.addEventListener("input", () => {
  messageInput.style.height = "auto";
  messageInput.style.height = Math.min(messageInput.scrollHeight, 140) + "px";
});

messageInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    composer.requestSubmit();
  }
});

// ---- rendering ----
function renderMessage(role, text, isError = false) {
  logEmpty.style.display = "none";

  const bubble = document.createElement("div");
  bubble.className = `msg msg--${isError ? "error" : role}`;

  const body = document.createElement("span");
  body.textContent = text;
  bubble.appendChild(body);

  const meta = document.createElement("span");
  meta.className = "msg__meta";
  meta.textContent = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  bubble.appendChild(meta);

  log.appendChild(bubble);
  log.scrollTop = log.scrollHeight;
  return bubble;
}

function renderTyping() {
  const bubble = document.createElement("div");
  bubble.className = "msg msg--model msg--typing";
  bubble.innerHTML = "<span></span><span></span><span></span>";
  log.appendChild(bubble);
  log.scrollTop = log.scrollHeight;
  return bubble;
}

// ---- send flow ----
composer.addEventListener("submit", async (e) => {
  e.preventDefault();
  const text = messageInput.value.trim();
  if (!text) return;

  renderMessage("user", text);
  conversation.push({ role: "user", content: text });

  messageInput.value = "";
  messageInput.style.height = "auto";
  sendBtn.disabled = true;

  const typingBubble = renderTyping();

  try {
    const reply = await callModel(text);
    typingBubble.remove();
    renderMessage("model", reply);
    conversation.push({ role: "model", content: reply });
    setStatus("live", "endpoint reachable");
  } catch (err) {
    typingBubble.remove();
    renderMessage("model", `Request failed: ${err.message}`, true);
    setStatus("error", "can't reach endpoint");
  } finally {
    sendBtn.disabled = false;
    messageInput.focus();
  }
});

// ---- API call ----
// Matches your flask_app.py: POST { message } -> { response: "..." }
async function callModel(message) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });

  if (!response.ok) {
    throw new Error(`server responded with ${response.status}`);
  }

  const data = await response.json();

  if (typeof data.response !== "string") {
    throw new Error("response missing 'response' field");
  }

  return data.response;
}

// ---- init ----
checkConnection();
