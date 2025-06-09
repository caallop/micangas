/**
 * Modelos de dados das notqas
 * Criaçao da coleçao
 */

//importaçao dos recusrsos do moongose
const { model, Schema, version } = require("mongoose");

//criaçao da estutura da coleçao
const clientSchema = new Schema(
  {
    gmail: {
      type: String,
    },
    telefone: {
      type: String,
    },
    cpf: {
      type: String,
      unique: true,
      index: true,
    },
    nome: {
      type: String,
    },
    cep: {
      type: String,
    },
    bairro: {
      type: String,
    },
    numero: {
      type: String,
    },
    complemento: {
      type: String,
    },
    logradouro: {
    type: String,
    },
  },
  { versionKey: false }
);
//exportar o modelo de dados para o main.js
module.exports = model("Clientes", clientSchema);
