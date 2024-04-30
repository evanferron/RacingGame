const { app, BrowserWindow } = require("electron");
const Store = require("electron-store");

const store = new Store();

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1920,
    height: 1080,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.loadFile("./html/register.html");
};

app.whenReady().then(() => {
  createWindow();
});
