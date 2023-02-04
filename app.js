require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const { routes } = require('./src/routes');

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use(routes);

app.get('/ping', (req, res) => {
  res.status(200).json({ message: 'pong' });
});

const PORT = process.env.PORT;

const start = async () => {
  try {
    app.listen(PORT, () => console.log(`Server is listening on ${PORT}`));
  } catch (err) {
    console.error(err);
  }
};
start();
