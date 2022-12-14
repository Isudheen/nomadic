const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './vars/config.env' });
const app = require('./app');
//Database connection
const DB = process.env.DATABASE.replace('<password>', process.env.DB_PASSWORD);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection successful'));
//Port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}.....`);
});

//unhandled rejections, async
process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log(`Unhandled rejection...Shutting Down`);
  process.exit(1); //0 for success and 1 for uncaught exception
});

process.on('SIGTERM', () => {
  console.log(`SIGTERM Received, Shutting down`);
  process.exit(1);
});
