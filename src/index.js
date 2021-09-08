const express = require('express');
const app = express();
const http = require("http");
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');


const port = process.env.APP_PORT || 5000;
const host = "0.0.0.0";

app.use(cors());
app.use(morgan('dev', {}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

// Base
require('./routes').auth(app);
require('./routes').upload(app);
require('./routes').forgotPassword(app);

// Admins
require('./routes').admins.todo(app);

// Users
require('./routes').users.todo(app);

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
      'Access-Control-Allow-Header',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

app.use((req, res, next) =>{
    const erro = new Error('Não encontrado');
    erro.status = 404;
    next(erro);
});

app.use((error, req, res, next) =>{
    res.status(error.status || 500);
    res.json({
        erro: {
            mensagem: error.message
        }
    });
});

const server = http.createServer(app);

server.listen(port, host);

module.exports = app;
