import cors from "cors";
import dotenv from "dotenv";
import express, { json } from "express";
import "express-async-errors";
import router from "./routers/index";
import errorHandler from "./middlewares/errorHandler"


dotenv.config();

const app = express();
app.use(json());
app.use(cors());
app.use(router);
app.use(errorHandler);



const PORT = Number(process.env.PORT) || 5009;

app.listen(PORT, () => {
  console.log(`Server com TS rodando na porta: ${PORT}`);
});
