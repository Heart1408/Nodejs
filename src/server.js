import express from 'express';
import configViewEngine from './config/viewEngine';
import initWebRoute from './route/web'
import connection from './config/connectDB';

require('dotenv').config();

var cors = require('cors')
app.use(cors())

const app = express();
let port = process.env.PORT || 8000;

//body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// setup view engine
configViewEngine(app);

// init web route
initWebRoute(app);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
