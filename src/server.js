import express from 'express';
import configViewEngine from './config/viewEngine';
import initAPIRoute from './route/api'
import connection from './config/connectDB';

require('dotenv').config();

const app = express();
let port = process.env.PORT || 8000;

//body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// setup view engine
configViewEngine(app);

// init web route
initAPIRoute(app);

// handle 404 not found
// app.use((req, res) => {
//   return res.send('404.ejs')
// })

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
