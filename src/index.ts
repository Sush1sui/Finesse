import "dotenv";
import { startServer } from "./server";
import { startBot } from "./app";
import mongoose from "mongoose";
import { initializeVerification } from "./modules/verificationModule";

const uri = process.env.DB_CONNECTION_STRING;
if (!uri) throw new Error("No connection string");
mongoose
    .connect(uri)
    .then(() => {
        initializeVerification();
        console.log("Connected to DB");
    })
    .catch((e) => console.log(e));

startServer();
startBot();
