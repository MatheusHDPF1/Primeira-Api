// Vamos construir um servidor usando p modulo dO Express 
// Esse modulo possue funções para executar e manipular um servidor node 
// Iniciaremos criando uma referencia do express com a importação do modulo
const express = require("express");

//Vamos importar o modulo mongoose que fará a interface entre o 
//nodejs e o banco de dados mongodb
const mongoose = require("mongoose");

// const url =  "codigo do banco Mongodb, mudar senha na frente do nome, mudar o nome de firstdatabase para outro

mongoose.connect(url, {useNewUrlParser:true, useUnifiedTopology:true});


//vamos criar a estrutura da tabela clientes com o comando do Schema
const tabela = mongoose.Schema({
    nome:{type:String, required:true},
    email:{type:String, required:true, unique:true},
    cpf:{type:String, required:true, unique:true},
    usuario:{type:String, required:true,unique:true },
    senha:{type:String, required:true,unique:true },

});

// execução da tabela 
const Cliente = mongoose.model("tbcliente",tabela);

// criar uma referencia do servidor express para utilizá-lo
const app = express();

// Fazer o servidor express receber e tratar dados em formato json
app.use(express.json());

/*
Abaixo, iremos criar as 4 rotas para os verbos GET,POST ,PUT,DELETE:
    GET - > Esse verbo é utilizado todas as vezes que o usuario requista 
    alguma informação ao servidor e, este por sua vez responde;

    POST -> É utilizado todas vezes que o usuário quiser cadastrar um cliente 
    ou enviar um dado importante ao servidor.

    PUT-> É usado quando se deseja atualizar algum dado sobre um objeto.
    
    DELETE-> É usado para apagar um dado sobre um objeto.

Ao final das rotas iremos aplicar ao servidor uma porta de comunicação, no nosso 
caso será a porta 3000.
*/


app.get("/api/cliente/",(req,res)=>{
    Cliente.find((erro,dados)=>{
        if(erro){
            return res.status(400).send({output:`Erro ao tentar ler os Clientes -> ${erro}`});
        }
        res.status(200).send({output:dados});
    }

    );
});

app.post("/api/cliente/cadastro",(req,res)=>{

    res.send(`Os dados enviados foram ${req.body.nome}`);

});

app.put("/api/cliente/atualizar/:id",(req,res)=>{
    res.send(`O id passado foi ${req.params.id}
    e os dados para atualizar são ${req.body}`);
});

app.delete("/api/cliente/apagar/:id",(req,res)=>{
    res.send(`O id passado foi ${req.params.id}`);
});

app.listen(3000,()=>console.log("Servidor online em http://localhost:3000"));