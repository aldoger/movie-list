import express, { Request, Response, Router } from 'express';
import mongoose from "mongoose";
import router from './routes/router';

const app = express();
const PORT = 3000;

app.use(express.json());

app.use(express.urlencoded({ extended: true }));


app.use('/api/movie-list', router);

mongoose.connect('mongodb://127.0.0.1:27017/movielist')
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Running on PORT ${PORT}`);
    });
  })
  .catch(err => console.error("MongoDB connection error:", err)
);
