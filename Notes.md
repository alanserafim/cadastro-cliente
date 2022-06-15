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
    Quando uma função assícrona é chamada ela retorna um Promise. Quando a função assícrona retorna um valor, a Promise será resolvida com o valor retornado. Quando a função assícrona lança uma exceção ou algum valor, a Promise será rejeitada com o valor lançado.
    A função assícrona pode conter uma expressão await, que pausa a execução da função assícrona e espera pela resolução da Promisse passada, e depois retorna a execução da função assícrona e retorna o valor resolvido.
    

    ### SINTAXE
    A declaração async define uma função assícrona que retorna um objeto AsyncFunction

    ### EXEMPLO
    async function nome([param[, param[, ... param]]]) {
        instruções
    }

## Promisses

    Uma Promise representa um proxy para um valor que não é necessariamente conhecido quando a promessa é criada. Isso permite a associação de métodos de tratamento para eventos da ação assíncrona num caso eventual de sucesso ou de falha. Isto permite que métodos assíncronos retornem valores como métodos síncronos: ao invés do valor final, o método assíncrono retorna uma promessa ao valor em algum momento no futuro.

    Um Promise está em um destes estados: 

    pending (pendente): Estado inicial, que não foi realizada nem rejeitada.
    fulfilled (realizada): sucesso na operação.
    rejected (rejeitado):  falha na operação.


## Resumo: Modelo Cliente-Servidor, Padrão REST e SOAP 

    ### Cliente-Servidor
    Definição: Um sistema cliente-servidor é formado por ao menos dois componentes com responsabilidades bem definidas. Cabe ao cliente elaborar requisições e cabe ao servidor respondê-las. O servidor nunca atua ativamente abrindo a conexão, esta sempre é iniciada pelo cliente.

    ### Padrão REST
    Definição: É um estilo arquitetural que tem como propriedades a) modelo cliente-servidor b) servidor stateless c) requisições podem ser cacheadas d) interface uniforme -> verbo http e) pode ser composto por várias camadas
    
    Definição: O que é REST?
    Conceitualmente falando, o modelo REST (REpresentational State Transfer) representa nada mais que uma “nova” possibilidade para a criação de web services, cujas principais diferenças em relação ao modelo tradicional (SOAP) estão na utilização semântica dos métodos HTTP (GET, POST, PUT e DELETE), na leveza dos pacotes de dados transmitidos na rede e na simplicidade, fazendo desnecessária a criação de camadas intermediárias (Ex.: Envelope SOAP) para encapsular os dados.

    ### API rest 
    Uma API (Interface de Programação de Aplicações, na sigla em inglês), é um conjunto de padrões e protocolos que integram um usuário a uma aplicação, permitindo que ele acesse e faça uso das funcionalidades do software em questão. 

    Uma API funciona como um mediador, ou comunicador, entre o usuário e o sistema. Deste modo, ela facilita o acesso e o desenvolvimento de aplicações para a internet. 

    Uma API RESTful funciona através da manipulação de recursos e representações. Essas representações são trocadas entre os usuários e o servidor através de uma interface padronizada e de um protocolo de comunicação específico — geralmente o HTTP. 

    Assim, quando um usuário deseja usar uma funcionalidade da aplicação, seu dispositivo envia uma solicitação via HTTP ao servidor. O servidor localiza o recurso e comunica a representação do estado dele na resposta ao usuário através do mesmo protocolo. E são essas representações que podem ser feitas em diversos formatos.

    Em termos de nomenclatura, é importante sabermos a diferença entre os conceitos de REST e RESTful. 

    Como já definimos anteriormente, REST é um conjunto de princípios e restrições de arquitetura de softwares. 

    Uma API RESTful é aquela que está em conformidade com os critérios estabelecidos pela Transferência de Estado Representacional (REST).

    Assim, quando uma API é do tipo RESTful, significa que esse sistema consegue aplicar os princípios propostos por Roy Fielding em sua tese REST.

    ### SOAP        
    SOAP é um protocolo de transferência de mensagens em formato XML para uso em ambientes distribuídos. O padrão SOAP funciona como um tipo de framework que permite a interoperabilidade entre diversas plataformas com mensagens personalizadas.

    Aplicando este padrão em Web Services, geralmente usa-se o WSDL para descrever a estrutura das mensagens SOAP e as ações possíveis em um endpoint.

    Uma das maiores vantagens disso é que várias linguagens e ferramentas conseguem ler e gerar mensagens facilmente. Várias linguagens de programação permitem a geração de objetos de domínio, Stubs e Skeletons a partir da definição do WSDL, permitindo a comunicação remota via RPC através de chamadas a métodos remotos, inclusive com argumentos complexos, como se fossem chamadas locais.

    O problema desse padrão, é que ele adiciona um overhead considerável, tanto por ser em XML quanto por adicionar muitas tags de meta-informação. Além disso, a serialização e desserialização das mensagens pode consumir um tempo considerável.

    ### REST
    REST é outro um protocolo de comunicação, baseado no protocolo de hipermídia HTTP. Porém ele não impõe restrições ao formato da mensagem, apenas no comportamento dos componentes envolvidos.

    A maior vantagem do protocolo REST é sua flexibilidade. O desenvolvedor pode optar pelo formato mais adequado para as mensagens do sistema de acordo com sua necessidade específica. Os formatos mais comuns são JSON, XML e texto puro, mas em teoria qualquer formato pode ser usado.

    Isso nos leva a outra vantagem: quase sempre Web Services que usam REST são mais "leves" e, portanto, mais rápidos.

    O problema com o REST pode surgir justamente por causa de suas vantagens. Como a definição do corpo de dados fica totalmente a cargo do desenvolvedor, os problemas de interoperabilidade são mais comuns.

    ### SOAP ou REST?
    Aviso: Esta é uma opinião pragmática.

    Em geral, SOAP é uma boa opção para instituições com padrões rígidos e ambientes complexos (várias plataformas e sistemas). Muitas ferramentas corporativas (como ESB) tiram vantagem do padrão e possibilitam filtrarem, enfileiramento, classificação e redirecionamento das mensagens trocadas entre sistemas.

    No restante, para uso no dia-a-dia, não vejo motivos concretos para não usar REST e JSON. Praticamente todas as plataformas e linguagens modernas que conheço suportam esses conceitos e a solução final é muito mais simples do que o equivalente em SOAP.

    Além disso, integrações com alto volume de requisições são inviáveis em SOAP. REST é capaz de atender volume e complexidade sem dificuldades, exigindo apenas um mínimo de experiência do desenvolvedor para estabelecer e reforçar os padrões adequados.