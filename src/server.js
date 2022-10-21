import express from 'express';
import initAPIRoute from './route/api'
import connection from './config/connectDB';

require('dotenv').config();
const app = express();

var cookies = require("cookie-parser");
app.use(cookies());

let port = process.env.PORT || 8000;

var cors = require('cors')
app.use(cors())

//body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((req, res, next) => {
  console.log("HTTP Method . " + req.method + " , URL . " + req.url);
  next();
})

// init web route
initAPIRoute(app);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
