const { ipcRenderer, contextBridge } = require("electron");



contextBridge.exposeInMainWorld("api", {
    dbConnect: ()=>ipcRenderer.send("db-connect"),
    dbStatus: (message) => ipcRenderer.on("db-status", message),
    clientLogin:() => ipcRenderer.send("open-login"),
    listOrders: () => ipcRenderer.send("list-orders"),
});
