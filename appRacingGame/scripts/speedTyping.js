const Store = require("electron-store");

const store = new Store();

nikname = store.get("nickname");
document.getElementById("nickname").innerHTML = nikname;
