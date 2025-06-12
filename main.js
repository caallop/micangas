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

//============================================================
//===================== janela sobre==========================
let about;
function aboutWindows() {
  nativeTheme.themeSource = "system";
  const mainwindow = BrowserWindow.getFocusedWindow();
  if (mainwindow) {
    about = new BrowserWindow({
      width: 500,
      height: 320,
      autoHideMenuBar: true,
      resizable: false,
      minimizable: false,
      //estabelcer uma relaçao hieraquica entre janelas
      parent: mainwindow,
      modal: true,
    });
    about.loadFile("./src/views/sobre.html");
  }
}


//===================== janela sobre==========================
//============================================================

app.whenReady().then(() => {
  createWindow()
  ipcMain.on("db-connect", async (event) => {
    await conectar();
    setTimeout(() => {
      event.reply("db-status", "conectado");
    }, 500); //500ms = 0.5 seg
  });

  
app.on("before-quit", async () => {
  await desconectar();
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
      },
      {
        label: "Ajuda",
        submenu: [
          {
            label: "repositorio",
            click: () =>
              shell.openExternal("https://github.com/caallop/micangas"),
          },
          {
            label: "sobre",
            click: () => aboutWindows(),
          },
        ],
      },
    
]

//crud read

ipcMain.on("list-orders", async (event) => {
  try {

    const order = await clientModel.find();
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


//crud read
ipcMain.on("validar-busca", () => {
  dialog.showMessageBox({
    type: "warning",
    title: "Atenção",
    message: "preencha o campo de busca",
    buttons: ["OK"],
  });
});





//crud read cpf----------
ipcMain.on("search-cpf", async (event, searchField) => {
  try {
    const clientData = await clientModel.find({
      cpf: new RegExp(searchField),
    });
    if (clientData.length === 0) {
      dialog
        .showMessageBox({
          type: "warning",
          title: " Busca CPF",
          message: "Cliente não cadastrado. \n Deseja cadastrar este cliente?",
          defaultId: 0, //
          buttons: ["Sim", "Não"], // [0,1] DEFAULTID esta associado ao sim, enquanto o não esta associado ao não (quando apertar enter ja vai no sim)
        })
        .then((result) => {
          if (result.response === 0) {
            //enviar ao cliente um pedido para copiar o nome do ususario do cliente no campo de bvusca para o campo nome (evitar que o usuario tenha que idigitar novamente o nome)
            event.reply("set-cpf");
          } else {
            //enviar ao renderer cliente, um pedido para limpar os campos
            event.reply("reset-form");
          }
        });
    } else {
      event.reply("render-clientCPF", JSON.stringify(clientData));
    }
  } catch (error) {
    console.log(error);
  }
});
//crud read cpf----------
//crud read nome----------

ipcMain.on("search-name", async (event, searchField) => {
  //teste do recebimento entre arquivos
  console.log(searchField);
  try {
    const clientName = await clientModel.find({
      //RegExp (expressão regular ''i' -> insensitive (ignorar letras maisculas e minusculas))
      nome: new RegExp(searchField, "i"),
    });
    console.log(clientName);
    //melhoriar da experiencia do usuaario (se nao existir um cliente cadastrado enviar uma mensagem ao usuario questionando se ele deseja cadastrar um novo cliente)
    //se o vetor esiver vazio (lenght) fala o tamanho do vetor
    if (clientName.length === 0) {
      //questionar o usuario...
      dialog
        .showMessageBox({
          type: "question",
          title: " Clientes",
          message: "Cliente não cadastrado. \n Deseja cadastrar este cliente?",
          defaultId: 0, //
          buttons: ["Sim", "Não"], // [0,1] DEFAULTID esta associado ao sim, enquanto o não esta associado ao não (quando apertar enter ja vai no sim)
        })
        .then((result) => {
          if (result.response === 0) {
            //enviar ao cliente um pedido para copiar o nome do ususario do cliente no campo de bvusca para o campo nome (evitar que o usuario tenha que idigitar novamente o nome)
            event.reply("set-name");
          } else {
            //enviar ao renderer cliente, um pedido para limpar os campos
            event.reply("reset-form");
          }
        });
    } else {
      //Mandar para os clientes para o renderClientes
      event.reply("render-client", JSON.stringify(clientName));
    }
  } catch (error) {
    console.log(error);
  }
});


//crud read nome----------