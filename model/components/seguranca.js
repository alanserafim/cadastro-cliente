function ocultarsenha(senha){
    //npm install sha1 --- api
    var sha1 = require('sha1');
    console.log(senha);
    var hash = sha1(senha);
    console.log(hash);
    return(hash);
}

module.exports = {ocultarsenha};