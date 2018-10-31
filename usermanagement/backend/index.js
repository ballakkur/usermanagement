const express = require('express');
const app = express();
const fs = require('fs');

const appConfig = require('./Config/appConfig');


const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
if (app.get('env') === 'development')
    app.use(morgan('tiny'));


    app.all('*', function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
        next();
    });
    
//read models

fs.readdirSync('./app/models').forEach((file) => {
    if (~file.indexOf('.js'))
        require(`./app/models/${file}`);
})

//read  routes
fs.readdirSync('./app/routes').forEach((file) => {
    if (~file.indexOf('.js')) {
        let route = require(`./app/routes/${file}`);
        route.setRouter(app);
    }
})




app.listen(appConfig.port, () => {
    console.log(`listening on port ${appConfig.port}`);
    mongoose.connect(appConfig.db.url, { useCreateIndex: true, useNewUrlParser: true })
        .then(() => console.log('connected to database'))
        .catch((err) => console.error(`${err}`))
});
module.exports = app;
