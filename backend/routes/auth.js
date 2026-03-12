import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";
import { protect } from "../middlewear/auth.js";


const router = express.Router();


const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 30 * 24 * 60 * 60 * 1000,
};


const generateToken = (id) =>{
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
}

//Register

router.post("/register", async (req , res) =>{

     const {name,email,password} = req.body;

     if (!name || !email || !password) {
         return res
             .status(400)
             .json({ message: "Please provide all required fields" });

     }

    const userExists = await  pool.query("SELECT * FROM users WHERE email = $1 ",[
        email
    ])

    if (userExists.rows.length > 0){
        return res.status(400).json({message: "This user already exists"});
    }

    const hashedPassword = await  bcrypt.hash(password,10);

    const newUser = await pool.query("INSERT INTO users(name,email,password) VALUES ($1,$2,$3) RETURNING id,name,email",[
        name,  email , hashedPassword
    ])


     const token = generateToken(newUser.rows[0].id);

     res.cookie("token", token , cookieOptions);

     return res.status(200).json({user : newUser.rows[0]});

})


router.post("/login", async (req , res )=>{
    const { email, password } = req.body;
    if (!email || !password) {
        return res
            .status(400)
            .json({ message: "Please provide all required fields" });
    }

    const user = await pool.query("SELECT * FROM users WHERE email = $1", [
        email,
    ]);

    if (user.rows.length === 0) {
        return res.status(400).json({ message: "Invalid credentials" });
    }

    const userData = user.rows[0];

    const isMatch = await bcrypt.compare(password, userData.password);

    if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(userData.id);

    res.cookie("token", token, cookieOptions);

    res.json({
        user: {
            id: userData.id,
            name: userData.name,
            email: userData.email,
        },
    });

})


router.get("/me",protect,(req ,res )=>{
    return res.json(req.user);
})

router.post("/logout",  (req , res) =>{
    res.cookie("token","",{...cookieOptions,maxAge:1})
    res.json({message:"Logged out successfully"})


})


router.post("/save",protect,async (req , res)=>{
    const {url, score , label} = req.body;


    try{
        const saved_data = await pool.query("SELECT * FROM history WHERE url = ($1) AND user_id = ($2)",[
            url , req.user.id
        ])

        if (saved_data.rows.length > 0){

            return res.status(400)
                .json({message:"This news report is already saved!"})
        }

    }  catch(e){
        console.log("Error while checking for already saved news reports")
    }


    try{
        const new_saved_report = await pool.query("INSERT INTO history(user_id,url,label,score) VALUES ($1,$2,$3,$4) RETURNING user_id,url,label,score  ",
            [req.user.id,url,label,score]
        )

        return res.status(200).json({saved:new_saved_report.rows[0]})
    }catch (e){
        console.log("Saving news report error " + e )
    }


})


router.get("/history",protect,async (req ,res)=>{

   const history = await pool.query("SELECT * FROM history WHERE user_id = ($1)", [req.user.id])


    return res.status(200).json(history.rows)

})


router.post("/delete",async(req , res)=>{
    const {report_id} = req.body

    try{
        const del = await pool.query("DELETE FROM history WHERE id = ($1)" , [report_id])
    }catch(e){
        console.log("Something went wrong "+e)
    }
})



export default router;