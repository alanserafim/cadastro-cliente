CREATE DATABASE WEBII;

use WEBII;

create table usuario (
    id int(11) not null auto_increment,
    nome varchar(50) null default null, 
    senha VARCHAR(50) null default null,
    primary key (id)
);

create table cliente (
    id int(11) not null auto_increment,
    nome varchar(50) null default null, 
    senha VARCHAR(50) null default null,
    primary key (id)
);

create table prduto (
    id int(11) not null auto_increment,
    nome varchar(250) null default null, 
    quantidade int(50) not null,
    preco double not null, 
    primary key (id)
);

/* CRUD CREATE */
insert into usuario (nome, senha) VALUES ("Icaro", "Asljalksjlka");
insert into usuario(nome, senha) VALUES ("Aline","ajsklajskljalkisjal");

/* CRUD READ */
SELECT * FROM webii.usuario;

/* CRUD UPDATE */
UPDATE usuario SET nome="Frank" WHERE id=1;
UPDATE usuario SET nome="Icaro" WHERE id=2;
SELECT * FROM webii.usuario;

/* CRUD DELETE */
DELETE from usuario WHERE id=1;
SELECT * FROM webii.usuario;