const { app, BrowserWindow } = require("electron");

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1920,
    height: 1080,
  });

  win.loadFile("./html/index.html");
};

app.whenReady().then(() => {
  createWindow();
});
