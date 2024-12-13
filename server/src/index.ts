import express,{ Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from "cors";
import authRouter from "./routes/customer/route"
import { connectToDB } from './utils/prisma';

dotenv.config();
const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

app.get('/', (req : Request, res : Response) => {
    res.send("Hi!");
});
app.use('/auth',authRouter);

const startServer = async () => {
    try {
      app.listen(PORT,() => console.log(`Listening at PORT : ${PORT}`));
      await connectToDB();
    } catch (error : any) {
      console.error('Failed to start the server: ', error.message);
      process.exit(1);
    }
};
  
startServer();


