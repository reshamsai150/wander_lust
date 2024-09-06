const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing.js");
const path=require("path");
const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("./schema.js");
const Review=require("./models/review.js");

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
app.get("/",(req,res)=>{

    res.send("hello iam root");
});


const validateListing=(req,res,next)=>{
  let {error}=listingSchema.validate(req.body);
 
  if(error){
    let errMsg=error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400,errMsg);
  }else{
    next();
  }

}
const validateReview=(req,res,next)=>{
  let {error}=reviewSchema.validate(req.body);
 
  if(error){
    let errMsg=error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400,errMsg);
  }else{
    next();
  }

}
//Index Route
app.get("/listings", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});

    res.render("listings/index.ejs", {allListings});
 }));

//New Route
app.get("/listings/new",(req,res)=>{
  res.render("listings/new.ejs");
})
//show route
app.get("/listings/:id", async (req, res) => {
  try {
    let { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
      return res.status(404).send("Listing not found");
    }
  
    res.render("listings/show.ejs", { listing }); // Update the path here
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});
//create route

app.post("/listings",validateListing, wrapAsync(async (req,res,next) => {
 let result=listingSchema.validate(req.body);
  console.log(result);
  if(result.error){
    throw new ExpressError(400,result.error);
  }
  const newListing = new Listing(req.body.listing);
  
    await newListing.save();
    res.redirect("/listings");
  })
);

//edit route
app.get("/listings/:id/edit",async(req,res)=>{
  let { id } = req.params;
    const listing = await Listing.findById(id);
res.render("listings/edit.ejs",{listing})
  });
//update route

app.put("/listings/:id",validateListing,wrapAsync(async (req, res) => {
  let { id } = req.params;
  const prevListing = await Listing.findById(id);
  const { title, description, image, price, country, location } = req.body.listing;
  prevListing.image.url = image;

  const updatedListing = await Listing.findByIdAndUpdate(id, {
    title,
    description,
    image: {
      filename: prevListing.image.filename,
      url: prevListing.image.url,
    },
    price,
    country,
    location,
  });

  res.redirect(`/listings/${id}`);
}));

//delete route
app.delete("/listings/:id",async(req,res)=>{
  let { id } = req.params;
  const deletedListing= await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  res.redirect("/listings");
});
//Reviews
//post Route
app.post("/listings/:id/reviews",validateReview, wrapAsync(async(req,res)=>{
let listing=await Listing.findById(req.params.id)
let newReview=new Review(req.body.review);
listing.reviews.push(newReview);
await newReview.save();
await listing.save();
res.redirect(`/listings/${listing._id}`)
}))
//delete Route
app.delete("/listings/:id/reviews/:reviewId",wrapAsync(async(req,res)=>{
  
  let {id,reviewId}=req.params;
  await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
  await Review.findByIdAndDelete(reviewId);
  res.redirect(`/listings/${id}`);
}))

// app.get("/testListing",async(req,res)=>{
//     let sampleListing=new Listing({
//         title:"my new villa",
//         description:"by the beach",
//         price:1200,
//         location:"Clangoute",
//         country:"India",
//     });
//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successfull testing");
// });
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
})

