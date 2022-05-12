*Execute os comandos npm abaixo no terminal

npm install express --save
npm install nodemon -g
npm install sha1
npm install mysql2
npm install body-parser
npm install ejs
npm install consign
npm install passport express-session

SQL

*Serviços>MySQL80>iniciar
*Abrir o MySQL WorkBench
*Caso esteja executando o projeto em casa/trabalho e a senha do MySQL seja diferente de alunofatec, alterar a linha 8 do arquivo db.js na pasta controller>SQL colocando a senha correta.
*Crie o banco de dados, tabela usuario com os campos id, nome e senha, insira o valor do primeiro usuario (use o script abaixo)
*nome do login: admin
*senha para login: 12345

Script SQL

create database webii;

create table webii.usuario(
    id int auto_increment primary key,
    nome varchar(255) not null, 
    senha varchar(255)
);

insert into webii.usuario values(1,'admin', '8cb2237d0679ca88db6464eac60da96345513964');

