const express = require('express');
const path = require('path')
const app = express();
const inject = require('./src/inject');

inject(app)

const port = 3000;

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
    res.render('index');
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
