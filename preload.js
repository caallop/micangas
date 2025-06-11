const { ipcRenderer, contextBridge } = require("electron");



contextBridge.exposeInMainWorld("api", {
    dbConnect: ()=>ipcRenderer.send("db-connect"),
    dbStatus: (message) => ipcRenderer.on("db-status", message),
    clientLogin:() => ipcRenderer.send("open-login"),
    cadastroBanco: (cadastroCliente) => ipcRenderer.send("cadastrar-cliente", cadastroCliente),
    resetForm: (args) => ipcRenderer.on("reset-form", args),

    validarBusca: () => ipcRenderer.send('validar-busca'),
    searchCpf:(searchField) => ipcRenderer.send('search-cpf', searchField),
    renderCpf:(clientData) => ipcRenderer.on("render-clientCPF", clientData),
    setCpf:(args) => ipcRenderer.on('set-cpf', args),

    searchName: (searchField) => ipcRenderer.send('search-name', searchField),
    renderClient: (clientName) => ipcRenderer.on('render-client', clientName),

    listOrders: () => ipcRenderer.send("list-orders"),
    renderOrders: (order) => ipcRenderer.on("render-orders", order),
});
