import express from "express"
import cors from "cors"
import "./index.js"

const app=express();

app.use(cors({
    origin:process.env.ORIGIN
}))

app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/",(req,res)=>{
    res.send("Server is run")
})

// Route
import  screenshotRouter  from "./routers/screenshotAPI.router.js";

app.use("/api/v1",screenshotRouter)


app.listen(process.env.PORT||5001, ()=>{
    console.log("server start");
})

export{app}