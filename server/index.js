require("dotenv").config({path: __dirname + '/.env'});

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const sequelize = require("./db") // импортируем объект который мы сделали в файлике db
const app = express();
const router = require("./router/index")
const errorMiddleware = require("./middlewares/error-middleware")


const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser());
app.use(cors(
    {credentials: true,
    origin: process.env.CLIENT_URL
    }
));
app.use("/api", router);
app.use(errorMiddleware);

const startServerAndDb = async () =>{
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        app.listen(PORT, ()=>{
            console.log(`server started on port ${PORT}`);
        })
    } catch (e) {
        console.log(e);
    }
}

startServerAndDb()