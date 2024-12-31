import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connect } from './connection/connect.js';
import { error } from './middleware/error.js';
import userRouter from './routes/user.js';
import cookieParser from 'cookie-parser';

dotenv.config();

const server = express();

server.use(
    cors({
      origin: "http://localhost:5173", // Allow frontend's origin
      methods: ["GET", "POST", "PUT", "DELETE"], // Allow required HTTP methods
      credentials: true, // Allow credentials (cookies)
    })
  );
  

const port=process.env.PORT || 3000;
server.use(cookieParser());
server.use(express.json());
server.use(express.urlencoded({ extended : true }));
server.use('/user',userRouter);
server.listen(port,()=>{
    console.log("Server is running on port " + port);
});

connect();

server.use(error);