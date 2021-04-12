require("dotenv").config();
const Express = require('express');
const app = Express();
const dbConnection = require("./db");

app.use(require('./middleware/headers'));

const controllers = require ("./controllers");

app.use(Express.json());

// const router = require('./controllers/journalcontroller');
app.use("/log", controllers.logController);

// app.use(require("./middleware/validate-jwt"));
app.use("/user", controllers.userController);

dbConnection.authenticate()
    .then(() => dbConnection.sync())
    .then(() => {
        app.listen(3001, () => {
            console.log(`[Server]: App is listening on 3001.`);
        });
    })

.catch((err) => {
    console.log(`[Server]: Server crashed. Error = ${err}`);
});