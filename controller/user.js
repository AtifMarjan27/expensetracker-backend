import User from "../model/user.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import express from 'express'
import { authenticate } from "../middleware/authmiddlware.js";
const UserRouter = express.Router()



UserRouter.post("/signup",async(req,res)=>{
    const {name,email,password} = req.body;

    try{
      const ExistUser = await User.findOne({email})
      if(ExistUser){
        return res.status(400).json({message:"Email already exists"})
      }
      const hashPassword = await bcrypt.hash(password,10)
      const newUser = new User({name,email,password:hashPassword})
      await newUser.save()
      res.status(201).json({message:"user Registerd"})
    }
    catch(err){
       res.status(500).json({ message: err.message });
        
    }

})


UserRouter.post("/login",async(req,res)=>{
    const {email,password} = req.body;
    try{
      const user = await User.findOne({email})
      if(!user){
        return res.status(404).json({message:"User Not found"})
      }
      const IsMatch = await bcrypt.compare(password,user.password)
       if (!IsMatch){ return res.status(400).json({ message: "Invalid credentials" });}

       const token =jwt.sign({userId:user._id,name:user.name},"atif@321",{
        expiresIn:"1hr"
       })
     const decoded = jwt.decode(token);

    res.status(200).json({
      token,
      decoded,
    });

    }
    catch(err){
        res.status(500).json({ message: err.message });
        
    }
})

UserRouter.get('/data',authenticate,async(req,res)=>{
    const now = new Date(); // Current date and time
    const day = now.getDate()
    const month = now.getMonth()+1;
    const Year = now.getFullYear()
    

    res.json({Nama:"Atif",DATE:`${day}/${month}/${Year}`})
})


export {UserRouter}