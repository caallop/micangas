const { ipcRenderer, contextBridge } = require("electron");



contextBridge.exposeInMainWorld("api", {
    dbConnect: ()=>ipcRenderer.send("db-connect"),
    dbStatus: (message) => ipcRenderer.on("db-status", message),
    clientLogin:() => ipcRenderer.send("open-login"),
    cadastroBanco: (cadastroCliente) => ipcRenderer.send("cadastrar-cliente", cadastroCliente),
    resetForm: (args) => ipcRenderer.on("reset-form", args),

    listOrders: () => ipcRenderer.send("list-orders"),
    renderOrders: (order) => ipcRenderer.on("render-orders", order),
});
