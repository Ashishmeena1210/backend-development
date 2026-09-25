import dns from "dns";
import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/index.js";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

dotenv.config();

const app = express();

connectDB();

app.listen(process.env.PORT || 8000, () => {
    console.log(`Server running on port ${process.env.PORT || 8000}`);
});






// const app = express();

// (async()=>{
//     try{
//         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
//         app.on("error", (error)=>{
//             console.log("ERROR: ", error)
//             throw error;
//         })

//         app.listen(process.env.PORT, ()=>{
//             console.log(`port is listening on ${process.env.PORT}`);
//         })
//     }
//     catch (error){
//      console.error("ERROR: ", error)
//      throw error
//     }
// })()