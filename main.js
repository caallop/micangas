const { app, BrowserWindow, Menu, shell, ipcMain, dialog, nativeTheme } = require('electron')
const path = require("node:path");


const { conectar, desconectar } = require("./database.js");
const clientModel = require("./src/models/client.js");

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
        height: 570,
        webPreferences: {
        preload: path.join(__dirname, "preload.js"),
      },
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

//crud read fim


//crud creat
ipcMain.on("cadastrar-cliente", async (event, cadastroCliente) => {

  try {
    const newClient = clientModel({
      gmail: cadastroCliente.gmailCli,
      telefone: cadastroCliente.telCli,
      cpf: cadastroCliente.cpfCli,
      nome: cadastroCliente.nomeCli,
      cep: cadastroCliente.cepCli,
      bairro: cadastroCliente.bairroCli,
      numero: cadastroCliente.numCli,
      complemento: cadastroCliente.compCli,
      logradouro: cadastroCliente.lograCli,
    });
    await newClient.save();
    //confirmaçao do cliente adicionado ao banco (uso do dialog)
    dialog
      .showMessageBox({
        type: "info",
        title: "aviso",
        message: "cliente adicionado com sucesso",
        buttons: ["OK"],
      })
      .then((result) => {
        if (result.response === 0) {
          event.reply("reset-form");
        }
      });
  } catch (error) {
    if (error.code === 11000) {
      dialog
        .showMessageBox({
          type: "error",
          title: "CPF",
          message: "CPF já cadastrado",
          buttons: ["OK"],
        })
        .then((result) => {
          if (result.response === 0) {
            event.reply("reset-Cpf");
          }
        });
    } else {
      console.log(error);
    }
  }
});
//crud create fim