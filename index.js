// Vamos construir um servidor usando p modulo dO Express 
// Esse modulo possue funções para executar e manipular um servidor node 
// Iniciaremos criando uma referencia do express com a importação do modulo
const express = require("express");

//Vamos importar o modulo mongoose que fará a interface entre o 
//nodejs e o banco de dados mongodb
const mongoose = require("mongoose");

const url =  "mongodb+srv://matheus:matheus123@clusterclientes.lej2l.mongodb.net/primeiraapi?retryWrites=true&w=majority";

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

    const cliente = new Cliente(req.body);
    cliente.save().then(()=>{
        res.status(201).send({output:`Cliente cadastrado`})
    })
    .catch((erro)=>res.status(400).send({output:`Erro ao tentar cadastrar o cliente -> ${erro}`}))
});

app.put("/api/cliente/atualizar/:id",(req,res)=>{
    Cliente.findByIdAndUpdate(req.params.id,req.body,(erro,dados)=>{
        if(erro){
            return res.status(400).send({output:`Erro ao tentar atualizar -> ${erro}`});
        }
        res.status(200).send({output:`Dados atualizados`});
    })
});

app.delete("/api/cliente/apagar/:id",(req,res)=>{
    Cliente.findOneAndDelete(req.params.id,(erro,dados)=>{
        if(erro){
            return res.status(400).send({output:`Erro ao tentar apagar o Cliente->${erro}`});
        }
        res.status(204).send({});
    })
});

app.listen(3000,()=>console.log("Servidor online em http://localhost:3000"));