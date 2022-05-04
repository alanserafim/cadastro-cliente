const seguranca = require('../../model/components/seguranca')
const usuarioBanco = require('../../controller/SQL/usuarioDB')

module.exports = function (app){

    app.get("/", function(req, resp){
        resp.send("Bem-vindo ao meu app");
    })

    app.get('/usuario/Cadastro', function (req, res){
        if(req.query.fail) 
            res.render('usuario/CadastroUsuario', {mensagem: 'Cadastro'});
        else
            res.render('usuario/CadastroUsuario', {mensagem: null});

    })
    
    app.post('/cadastro/usuario/edit/salvar', (req, res) => {
        var usuario = {nome: req.body.nome,
                       senha: req.body.senha,
                       id: req.body.id};
        try {
            usuarioBanco.updateUsuario(usuario);
            res.render('usuario/Sucesso', {mensagem: 'alterado'});
        } catch (error){
            res.render('usuario/EditUsuario', {title: 'Edicção Cadastro', mensagem: "Erro no cadastro"})
        }
    });

}