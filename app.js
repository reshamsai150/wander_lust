const express=require("express");
const app=express();
const mongoose=require("mongoose");

const path=require("path");
const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js");
const session=require("express-session")

const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("pasport-local")
const User=require("./models/user.js");
const listings=require("./routes/listing.js");
const reviews=require("./routes/review.js")
// http://localhost:8080/listings
main()
    .then(()=>{
        console.log("connected to DB");
    })
    .catch((err)=>{
        console.log(err);
    });

async function main(){
    await mongoose.connect(MONGO_URL);
}
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const sessionOptions={
  secret:"mysupersecretcode",
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now() + 7 * 24 * 60 *60 *1000,
    maxAge:7*24*60*60*100,
    httpOnly:true,
  },
};
app.get("/",(req,res)=>{
  res.send("Hi Iam root");
});

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
// it is used to verify whether request sent by same user or diffferent
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
 next();
});
app.get("/demouser",async(req,res)=>{
  let fakeuser=new User({
    email:"student@gmail.com",
    username:"delta-student"
  });
  let registeredUser= await User.register(fakeUser,"helloworld");
  res.send(registeredUser);
})
app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);


app.all("*",(req,res,next)=>{
  next(new ExpressError(404,"page Not Found"));
});
app.use((err,req,res,next)=>{
  let{statusCode=500,message="Something went wrong"}=err;
res.render("error.ejs",{message})
  // res.status(statusCode).send(message);
})
app.listen(8080,()=>{
    console.log("server is listening to port 8080");
});