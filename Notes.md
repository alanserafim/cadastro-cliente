# Anotações da Aula


## Configurando rotas com  GET e POST

    ### GET

        // =====> simples

        app.get("/", function(req, resp){
            resp.send("<h1>Bem-vindo ao meu app</h1>");
        })

        //  =====> com paramêtros

            app.get('/edit/usuario/:id', seguranca.autenticar, async (req, res, next) => {
                try{
                    var id = req.params.id;
                    const usuario = await usuarioBanco.getUsuarioId(id);
                    res.render('usuario/EditUsuario', { mensagem: '', usuario });
                } catch (err){
                    next(err);
                }
            });


        //  =====> com condicional

        app.get('/cadastro', function (req, res){
            if(req.query.fail) 
                res.render('usuario/CadastroUsuario', {mensagem: 'Cadastro'});
            else
                res.render('usuario/CadastroUsuario', {mensagem: null});
        })



    ### POST
        app.post('/cadastro/usuario/edit/salvar', (req, res) => {
            var usuario = { 
                nome: req.body.nome,
                senha: req.body.senha,
                id: req.body.id
            };
            try {
                usuarioBanco.updateUsuario(usuario);
                res.render('usuario/Sucesso', {mensagem: 'alterado'});
            } catch (error){
                res.render('usuario/EditUsuario', {title: 'Edição Cadastro', mensagem: "Erro no cadastro"})
            }
        })


    ### Propriedades

        resp.send("<h1>Bem-vindo ao meu app</h1>")
        res.render('usuario/CadastroUsuario', {mensagem: 'Cadastro'}, variavelXYZ);
        req.query.fail = boolean
        req.body.atributoObjeto = valor
        req.params.nomeParametro = valor



## CRUD com MySql

    ### Conexão com o Banco de Dados

        async function connect(){
            //confirma se está conectado com a variavel global
            if(global.connection && global.connection.state != 'disconnected'){
                return global.connection;
            }

            const mysql = require("mysql2/promise");
            const connection = await mysql.createConnection("mysql://root:alunofatec@localhost:3306/webii");
            console.log("conectou no MySQL");
            global.connection = connection;
            return connection;
        }

        module.exports = {connect};

    ### Criação de Tabelas

            Criamos as tabelas diretamento no Banco de Dados


    ### importando a conexão

            const usuarioDB = require('../../controller/SQL/db')

    ### SELECT

            //=============================>Retorna todas as linhas
            async function selectUsuario(){
                const conn = await usuarioDB.connect();
                const [rows] = await conn.query('SELECT * FROM nome_tabela;');
                return rows;
            }

            //=============================>Retornando uma linha específica
            async function getUsuarioId(id){
                const conn = await usuarioDB.connect();
                const sql = 'SELECT * FROM nome_tabela where id=?;';
                const values = [id];
                const [rows] = await conn.query(sql, values);
                if(rows.length > 0) return rows[0];
                else return null;
            }

    ### INSERT

            async function insertUsuario(usuario){
                const conn = await usuarioDB.connect();
                const sql = 'INSERT INTO nome_tabela(nome, senha) VALUES (?,?);';
                const values = [usuario.nome, usuario.senha];
                return await conn.query(sql, values);
            }

    ### DELETE

            async function deleteUsuario(id){
                const conn = await usuarioDB.connect();
                const sql = 'DELETE FROM nome_tabela where id=?;';
                return await conn.query(sql, [id]);
            }

    ### UPDATE

            async function updateUsuario(usuario){
                const conn = await usuarioDB.connect();
                const sql = 'UPDATE usuario SET nome=?, senha=? where id=?;';
                const values = [usuario.nome, usuario.senha, usuario.id];
                return await conn.query(sql, values);
            }


## CRUD com ORM - Sequelize

    ### Conexão com o Banco de Dados
        
        const Sequelize = require('sequelize');

        const sequelize = new Sequelize ('webii', 'root', 'alunofatec', {dialect: 'mysql', host: 'localhost', port:3306});
        //nomeBAnco, usuario, senha, { linguagemBD, host, porta}

        module.exports = {sequelize};

    ### Criação de Tabelas

            const Sequelize = require('sequelize');
            const database = require('./dborm.js');

            const Cliente = database.sequelize.define('cliente',{
                id: {
                    type: Sequelize.INTEGER,
                    autoIncrement: true,
                    allowNull: false,
                    primaryKey: true
                },
                nome: {
                    type: Sequelize.STRING,
                    allowNull: false, 
                },
                idade: {
                    type: Sequelize.INTEGER
                },
                endereco: Sequelize.STRING
            });

            module.exports = {Cliente}

            (async ()=> {
                const database = require('./dborm');
                const { Cliente } = require('./cliente');

                const resultado = await database.sequelize.sync();
            })();

    ### Importando a conexão

            (async ()=> {
                const database = require('./dborm');
                const { Cliente } = require('./cliente');
            })();

    ### SELECT

            //=============================>Retorna todas as linhas
            const clientes = await Clientes.findAll(1);


            //=============================>Retornando uma linha específica
            const cliente = await Cliente.findByPk(1);

    ### INSERT

            const inserirCliente = await Cliente.create({
                nome: 'João da Silva',
                idade: 10,
                endereco: 'Rua Paulista, n 10000'
            })

    ### DELETE

                const clienteDelete = await Cliente.findAll(1);
                clienteDelete.destroy();
            
    ### UPDATE

            const clienteAlterar = await Cliente.findByPk(1);
            clienteAlterar.nome = "Icaro Freitas";
            const resultadoSave = await clienteAlterar.save();


## Autenticação e Sessão
    
    ### Conceito

    ### Sintaxe

    ### Aplicação
        
        //===========> criptografando a senha com a biblioteca de hash sha1
            
            function ocultarsenha(senha){
                var sha1 = require('sha1');
                console.log(senha);
                var hash = sha1(senha);
                console.log(hash);
                return(hash);
            }

            module.exports = {ocultarsenha};

        
        //===========> Aplicando autenticação de usuário com a blibioteca passport

        const LocalStrategy = require('passport-local').Strategy;
        const seguranca = require("./seguranca");
        const usuarioBanco = require("../repositories/usuarioDB");

        module.exports = function(passport){
            passport.serializeUser((user, done) => {
                done(null, user.id);
            });

            passport.deserializeUser(async (id, done) =>{
                try {
                    const usuario = await usuarioBanco.getUsuarioId(id);
                    done(null, usuario);
                } catch (err) {
                    done(err, null);
                }
            });

            passport.use(new LocalStrategy({
                    usernameField: 'nome',
                    passwordField: 'senha'
                    },

                async (nome, senha, done) => {
                    try {
                        const usuario = await usuarioBanco.login(nome, senha);
                        if(usuario != null && usuario){
                            return done(null, usuario);
                        } else {
                            return done (null, false);
                        }
                    } catch (err) {
                        done(err, false)
                    }
                }
            ));
        };

        //====> modularizando a estratégia de autenticação

        function autenticar(req, res, next){
            if(req.isAuthenticated()) return next();
            res.redirect('/login?fail=true')
        }

        module.exports = {autenticar};  

        // ====> configuração da session e login no arquivo base

        const passport = require('passport');
        const session = require('express-session');
        require('./model/components/autenticacao')(passport);

        app.use(session({
            secret: '12345678', // configure um segredo seu aqui
            resave: false, //salvar cada requisição
            saveUninitialized: false, /// sessoês anônimas
            cookie: { maxAge: 30 * 60 * 1000} //30 min
        }))

        app.use(passport.initialize());
        app.use(passport.session());

        //Validação de login do usuário -> a URL listada abaixo está como atributo do form da página de Login
        app.post('/login/executar', passport.authenticate('local', {
            successRedirect: '/lista/usuario',
            failureRedirect: '/login/?fail=true'
        }));          

## Funções assíncronas

    ### CONCEITO

    ### SINTAXE

    ### EXEMPLO


## Resumo: Modelo Cliente-Servidor, Padrão REST e SOAP 

    ### Cliente-Servidor
    Definição:

    ### Padrão REST
    Definição:
    
    ### Padrão SOAP
    Definição: 