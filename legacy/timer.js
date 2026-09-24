const end = new Date("2026-08-29T11:30:00").getTime();

setInterval(() => {
    const time = Math.max(0, end - Date.now());

    const d = Math.floor(time / 86400000);
    const h = Math.floor(time / 3600000) % 24;
    const m = Math.floor(time / 60000) % 60;
    const s = Math.floor(time / 1000) % 60;

    document.getElementById("timer").textContent =
        `${d}d ${h}h ${m}m ${s}s`;
}, 1000);