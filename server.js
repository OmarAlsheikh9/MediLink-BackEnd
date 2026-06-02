import dotenv from 'dotenv';
import Mongoose from 'mongoose';
process.on('uncaughtException', (err) => {
  console.log('unhandeld rejection 🐦‍🔥: server shuting down');
  console.log(err.name, err.message);
  process.exit(1);
});
dotenv.config({ path: './config.env' });
import { app } from './app.js';
Mongoose.connect(process.env.LOCAL_DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
}).then(() => {
  console.log('db connect successfly');
});

const port = process.env.PORT;
const server = app.listen(port, () => {
  console.log(`server runing in port ${port}`);
});
process.on('unhandledRejection', (err) => {
  console.log('unhandeld rejection 🐦‍🔥: server shuting down');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
