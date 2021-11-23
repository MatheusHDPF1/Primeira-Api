// Vamos construir um servidor usando p modulo dO Express 
// Esse modulo possue funções para executar e manipular um servidor node 
// Iniciaremos criando uma referencia do express com a importação do modulo
const express = require("express");

//Vamos importar o modulo mongoose que fará a interface entre o 
//nodejs e o banco de dados mongodb
const mongoose = require("mongoose");

//importação do modulo bcrypt para criptografia de senhas
const bcrypt = require("bcrypt");

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


//Aplicação da criptografia do bcrypt a tabela de cadastro 
//de clientes será feita um passo antes do salvamento dos dados do cliente vamos usar o comando pre
tabela.pre("save", function(next){
    let cliente = this;
    if(!cliente.isModified('senha')) return next()
    bcrypt.hash(cliente.senha,10,(erro,rs)=>{
        if(erro) return console.log(`erro ao gerar senha->${erro}`);
        cliente.senha = rs;
        return next();
    })
   }
)



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



app.get("/api/cliente/:id",(req,res)=>{
    Cliente.findById(req.params.id,(erro,dados)=>{
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

app.post("/api/cliente/login",(req,res)=>{
    const us = req.body.usuario;
    const sh = req.body.senha;
    Cliente.findOne({usuario:us},(erro,dados)=>{
        if(erro){
            return res.status(400).send({output:`Usuario não localizado ${erro}`});
        }
        bcrypt.compare(sh,dados.senha,(erro,igual)=>{
            if(erro) return res.status(400).send({output:`Erro ao tentar logar->${erro}`});
            if(!igual) return res.status(400).send({output:`Erro ao tentar logar->${erro}`});
            res.status(200).send({output:`Logado`,palyload:dados});
        })
       
    })
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