import tkinter as tk
from PIL import Image, ImageTk

AFBEELDING = "d.png"   # pad naar je plaatje
INTERVAL_MS = 10_000         # 10 seconden
MAX_BREEDTE = 300            # maximale breedte van de pop-up
MAX_HOOGTE = 200             # maximale hoogte van de pop-up

root = tk.Tk()
root.withdraw()              # geen klein venster

img = Image.open(AFBEELDING)
img.thumbnail((MAX_BREEDTE, MAX_HOOGTE), Image.LANCZOS)  # verkleinen, verhouding blijft gelijk

foto = ImageTk.PhotoImage(img)
breedte, hoogte = img.size

def toon_popup():
    popup = tk.Toplevel(root)
    popup.title("Melding")
    popup.resizable(False, False)
    popup.attributes("-topmost", True)

    # midden op het scherm
    x = (popup.winfo_screenwidth() - breedte) // 2
    y = (popup.winfo_screenheight() - hoogte) // 2
    popup.geometry(f"{breedte}x{hoogte}+{x}+{y}")

    def sluit(event=None):
        popup.destroy()
        root.after(INTERVAL_MS, toon_popup)   # countdown start na sluiten

    label = tk.Label(popup, image=foto, borderwidth=0)
    label.pack()
    label.bind("<Button-1>", sluit)           # klik op plaatje sluit
    popup.protocol("WM_DELETE_WINDOW", sluit) # kruisje sluit en start countdown

root.after(INTERVAL_MS, toon_popup)
root.mainloop()