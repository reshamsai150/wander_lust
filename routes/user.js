const express=require("express");
const router=express.Router();
const User=required("../models/user.js");
router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
});

router.post("/signup",(req,res)=>{
    let {username,email,password}=req.body;
    const newUser=new User({email,username});
    const registeredUser= await User.register(newUser,password);
    console.log(registeredUser);
    req.flash("success","welcome to wanderlust!");
    res.redirect("/listings");
})

module.exports=router;