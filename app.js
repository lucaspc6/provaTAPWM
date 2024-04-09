const express = require("express")
const app = express()
const handlebars = require("express-handlebars").engine
const bodyParser = require("body-parser")
const post = require("./models/post")

app.engine("handlebars", handlebars({defaultLayout: "main"}))
app.set("view engine", "handlebars")

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.get("/", function(req, res){
    res.render("primeira_pagina")
})

app.get("/consulta", function(req, res){
    post.findAll().then(function(post){
        res.render("consulta", {post})
    }).catch(function(erro){
        console.log("Erro ao carregar dados do banco: " + erro)
    })
})

app.post("/cadastrar", function(req, res){
    post.create({
        nome: req.body.nome,
        endereco: req.body.endereco,
        bairro: req.body.bairro,
        cep: req.body.cep,
        cidade: req.body.cidade,
        estado: req.body.estado
    }).then(function(){
        res.redirect("/")
    }).catch(function(erro){
        res.send("Falha ao cadastrar os dados: " + erro)
    }) 
})

app.get("/excluir/:id", function (req, res) {
    post.destroy({ where: { 'id': req.params.id } }).then(function () {
        res.redirect("/consulta"); 
    }).catch(function (erro) {
        console.log("Erro ao excluir registro: " + erro); 
    });
});


app.get("/editar/:id", function (req, res) {
    
    post.findAll({ where: { 'id': req.params.id } }).then(function (post) {
        res.render("editar", { post }); 
    }).catch(function (erro) {
        console.log("Erro ao carregar dados do banco:" + erro); 
    });
});


app.post("/atualizar", function (req, res) {
    post.update({
        nome: req.body.nome,
        endereco: req.body.endereco,
        bairro: req.body.bairro,
        cep: req.body.cep,
        cidade: req.body.cidade,
        estado: req.body.estado
    }, {
        where: {
            id: req.body.id 
        }
    }).then(function () {
        res.redirect("/consulta"); 
    });
});

app.listen(8081, function(){
    console.log("Servidor ativo!")
})