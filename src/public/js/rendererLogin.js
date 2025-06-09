
let frmSearchClient = document.getElementById("frmSearchClient");
let cadInsta = document.getElementById("cadInsta");
let cadTel = document.getElementById("cadTel");
let cadNome = document.getElementById("cadNome");
let cadCpf = document.getElementById("cadCpf");
let cadCep = document.getElementById("cadCep");
let cadBairro = document.getElementById("cadBairro");
let cadNumb = document.getElementById("cadNumb");
let cadComp = document.getElementById("cadComp");
let cadLogra = document.getElementById("cadLogra");
let IdCliente = document.getElementById("id");

const foco = document.getElementById("buscarCli");

let frmCadastro = document.getElementById("frmCadastro");


//criar um vetor global para manipular os dados do cliente
let arrayClient = [];


function buscarEndereco() {
  let cep = document.getElementById("cadCep").value
console.log(cep)
console.log(cep)
console.log(cep)
console.log(cep)
console.log(cep)

  let urlAPI = `https://viacep.com.br/ws/${cep}/json/`;
  fetch(urlAPI)
    .then((response) => response.json()) // Corrigido o nome da variável para 'response'
    .then((dados) => {
      document.getElementById("cadLogra").value = dados.logradouro;
      document.getElementById("cadBairro").value = dados.bairro;
      document.getElementById("cadComp").value = dados.complemento;
    })
    .catch((error) => console.error("Erro ao buscar o endereço:", error));
}


function resetForm() {
  location.reload();
}

api.resetForm((args) => {
  resetForm();
});

// Validar CPF
function validaCPF(cpf) {
  cpf = cpf.replace(/\D/g, ""); // Remove caracteres não numéricos

  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
    return false; // Verifica se tem 11 dígitos e se não é uma sequência repetida (ex: 111.111.111-11)
  }

  // Validação do primeiro dígito verificador
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpf[i]) * (10 - i);
  }
  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf[9])) return false;

  // Validação do segundo dígito verificador
  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpf[i]) * (11 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf[10])) return false;
  return true;
}

// Checar CPF
function testaCPF() {
  let inputCPF = document.getElementById("cadCpf").value;
  let cpfNotificacao = document.getElementById("cpfNotificacao");
  if (!validaCPF(inputCPF)) {
    cpfNotificacao.style.display = "block"; // Mostra o popup
    cadCpf.classList.remove("border-2 border-green-500 focus:ring-green-500 focus:border-green-500");
    cadCpf.classList.add("border-2 border-red-500 focus:ring-red-500 focus:border-red-500 ");
  } else {
    cpfNotificacao.style.display = "none"; // Esconde o popup
    cadCpf.classList.remove("border-2 border-red-500 focus:ring-red-500 focus:border-red-500");
    cadCpf.classList.add("border-2 border-green-500 focus:ring-green-500 focus:border-green-500");
  }
}



frmCadastro.addEventListener("submit", async (event) => {
  event.preventDefault();
    const cadastroCliente = {
      gmailCli: cadInsta.value,
      telCli: cadTel.value,
      cpfCli: cadCpf.value,
      nomeCli: cadNome.value,
      cepCli: cadCep.value,
      bairroCli: cadBairro.value,
      numCli: cadNumb.value,
      compCli: cadComp.value,
      lograCli: cadLogra.value,
    };
    api.cadastroBanco(cadastroCliente);
});

function dpsApaga(){
 event.preventDefault();
    const cadastroCliente = {
      gmailCli: cadInsta.value,
      telCli: cadTel.value,
      cpfCli: cadCpf.value,
      nomeCli: cadNome.value,
      cepCli: cadCep.value,
      bairroCli: cadBairro.value,
      numCli: cadNumb.value,
      compCli: cadComp.value,
      lograCli: cadLogra.value,
    };
    api.cadastroBanco(cadastroCliente);
}
