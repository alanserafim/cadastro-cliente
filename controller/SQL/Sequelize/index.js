/*
(async()=>{
    const db = require("./db");   
   
    console.log('SELECT * FROM USUARIO');
    const usuarios = await db.selectUsuario();
    console.log(usuarios);
        
    console.log('INSERT INTO USUARIO');
    const result = await db.insertUsuario({nome: "Zé", senha: "ajsailjhshaisuhak"});
    console.log(result);
    
    console.log('DELETE FROM usuario');
    const result3 = await db.deleteUsuario(2);
    console.log(result3);
    
    console.log('UPDATE USUARIO');
    const result2 = await db.updateUsuario(3, {nome: "Zé José", senha: "slkjdlkjsdlksjdlk"});
    console.log(result2);
})();

*/

(async ()=> {
    const database = require('./dborm');
    const { Cliente } = require('./cliente');

    console.log(' Criar tabela =======================================');
    const resultado = await database.sequelize.sync();

    console.log(resultado);

    console.log('Criar um registro ===================================');
        const inserirCliente = await Cliente.create({
            nome: 'João da Silva',
            idade: 10,
            endereco: 'Rua Paulista, n 10000'
        })
        console.log(inserirCliente);
    
    console.log('Buscar um registro ===================================');
    const cliente = await Cliente.findByPk(1);
    console.log(cliente);

    console.log('Alterar um registro ===================================');
    const clienteAlterar = await Cliente.findByPk(1);
    clienteAlterar.nome = "Icaro Freitas";
    const resultadoSave = await clienteAlterar.save();
    console.log(resultadoSave);

    console.log('Buscar todos registro ===================================');
    const clientes = await Clientes.findAll(1);
    console.log(clientes);

    console.log('Deletar o registro ===================================');
    const clienteDelete = await Cliente.findAll(1);
    clienteDelete.destroy();

    
})();

