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


