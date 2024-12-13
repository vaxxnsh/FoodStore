import express,{ Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from "cors";

dotenv.config();
const app = express();
const PORT = process.env.PORT;

app.use(cors());

app.get('/', (req : Request, res : Response) => {
    res.send("Hi!");
});

app.listen(PORT,() => console.log(`Listening at PORT : ${PORT}`));



