const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');
dotenv.config({ path: './config.env' });
//Database connection
const DB = process.env.DATABASE.replace('<password>', process.env.DB_PASSWORD);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection successful'))
  .catch((err) => {
    console.log('DB connection failed');
  });

//Port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}.....`);
});
