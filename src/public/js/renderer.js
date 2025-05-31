
// inserção da data no rodapé

//==========================================================================
//========================================================================== 
//====================obtençao da data atual================================
function obterData() {
  const data = new Date();
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return data.toLocaleDateString("pt-BR", options);
}

document.getElementById("dataAtual").innerHTML = obterData();
//====================obtençao da data atual================================
//==========================================================================
//==  api.dbConnect()========================================================================
api.dbConnect()


api.dbStatus((event, message) => {
  // teste de recebimento da mensagem
  console.log(message);
  if (message === "conectado") {
    document.getElementById("iconeDB").src = "../public/img/dbon.png";
  } else {
    document.getElementById("iconeDB").src = "../public/img/dboff.png";
  }

});

function teste() {
  console.log("AAAAAAAAAAAAAAAAAAAAAAAAAA")
}

function clientLogin() {
  api.clientLogin()
}

api.listOrders();

api.renderOrders((event, notes) => {
  console.log("ta chegando!!")
  console.log("ta chegando!!")
  console.log("ta chegando!!")
  console.log("ta chegando!!")
  console.log("ta chegando!!")
  
  const renderNotes = JSON.parse(notes);
  arrayNotes = renderNotes;
  arrayNotes.forEach((n) => {
    list.innerHTML += `
      <p id="code">${n._id}</p>
      <p>${n.nome}</p>
      <p id="data">${n.data}</p>
      </li>`;
  });
});