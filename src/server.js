import express from 'express';
import initAPIRoute from './route/api'
import connection from './config/connectDB';
import verify from './middleware/auth';
const verifyJWT = require('./middleware/auth');

require('dotenv').config();
const app = express();

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
app.use('/', require('./route/root'));
app.use(verifyJWT);
initAPIRoute(app);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
