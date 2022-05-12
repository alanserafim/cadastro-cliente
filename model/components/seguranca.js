function ocultarsenha(senha){
    //npm install sha1 --- api
    var sha1 = require('sha1');
    console.log(senha);
    var hash = sha1(senha);
    console.log(hash);
    return(hash);
}

function autenticar(req, res, next){
    if(req.isAuthenticated()) return next();
    res.redirect('/login?fail=true')
}

module.exports = {ocultarsenha, autenticar};