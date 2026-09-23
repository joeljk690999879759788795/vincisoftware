from PyQt5.QtWidgets import QApplication, QMainWindow
from PyQt5.QtWebEngineWidgets import QWebEngineView
from PyQt5.QtCore import QUrl  # <--- ADD THIS LINE
import sys
import os

app = QApplication(sys.argv)
window = QMainWindow()
browser = QWebEngineView()

# Use absolute path to ensure the file is found regardless of where you run the command
script_dir = os.path.dirname(os.path.abspath(__file__))
html_path = os.path.join(script_dir, "index.html")

browser.load(QUrl.fromLocalFile(html_path))

window.setCentralWidget(browser)
window.resize(1366, 768)
window.show()

sys.exit(app.exec_())   