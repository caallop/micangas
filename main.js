const { app, BrowserWindow, Menu, shell, ipcMain, dialog, nativeTheme } = require('electron')
const path = require("node:path");


const { conectar, desconectar } = require("./database.js");

//============================================================
//===================== janela inicial======================== 
const createWindow = () => {
  const win = new BrowserWindow({
    nativeTheme,themeSource: "light", //escolher o tema do projeto
    width: 800,
    height: 600,
    webPreferences: {
        preload: path.join(__dirname, "preload.js"),
      },
  })

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));


  win.loadFile('src/views/index.html')
}
//===================== janela inicial======================== 
//============================================================

//============================================================


//============================================================
//===================== janela de clientes====================
const loginWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600
    })

    win.loadFile('src/views/login.html')
}
//===================== janela de clientes====================
//============================================================




app.whenReady().then(() => {
  createWindow()
  ipcMain.on("db-connect", async (event) => {
    await conectar();
    setTimeout(() => {
      event.reply("db-status", "conectado");
    }, 500); //500ms = 0.5 seg
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})



//============================================================
//===================== Para MAC =============================
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
//===================== Para MAC =============================
//============================================================


//============================================================
//========================= COMANDOS =========================
ipcMain.on('open-login', (event) => {
  loginWindow()
} )

//============================================================
//========================= COMANDOS =========================


const template = [
    {
        label: "teste do template",
        submenu:[
            {
                label:"alert",
                click: ()=> console.log("banana nanica")
            }
        ]
    },
    {
        label: "Ferramentas",
        submenu: [
          {
            label: "aplicar zoom",
            role: "zoomIn",
            //ou control+ ++
          },
          {
            label: "tirar zoom",
            role: "zoomOut",
          },
          //ou ctrl + --
          {
            label: "restaurar o zoom padrao",
            role: "resetZoom",
          },
          {
            type: "separator",
          },
          {
            label: "DevTools",
            role: "toggleDevTools",
          },
          {
            label: "recarregar",
            role: "reload",
          },
        ],
      }
    
]

//crud read

ipcMain.on("list-orders", async (event) => {
  try {

    const order = await orderModel.find();
    console.log("===================")
    console.log("===================")
    console.log("===================")
    console.log("===================")
    console.log(order)
    console.log(order)
    console.log(order)
    console.log(order)
    console.log(order)
    event.reply("render-orders", JSON.stringify(order));
  } catch (error) {
    console.log(error)
  }
});