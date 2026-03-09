import {Pool} from "pg";
import dotenv from "dotenv";


dotenv.config();

const pool=new Pool({
    host:process.env.DB_HOST,
    port:process.env.DB_PORT,
    database:process.env.DB_NAME,
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD
})

pool.on("connect",()=>{
    console.log("Connected to the database")
})

pool.on("error",(err)=>{
    console.error("DB error",err);

})

pool.connect().then(() => console.log("DB connected ")).catch(e => console.error("DB error ", e.message));

export default  pool;