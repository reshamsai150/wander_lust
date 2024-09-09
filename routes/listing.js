const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");

const {listingSchema}=require("../schema.js");
const Listing=require("../models/listing.js");


const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
      let errMsg=error.details.map((el)=>el.message).join(",");
      throw new ExpressError(400,errMsg);
    }else{
      next();
    }
  };

//Index Route
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});

    res.render("listings/index.ejs", {allListings});
 }));

//New Route
router.get("/new",(req,res)=>{
  res.render("listings/new.ejs");
})
//show route
router.get("/:id", async (req, res) => {
  try {
    let { id } = req.params;
    // const listing = await Listing.findById(id);
    const listing = await Listing.findById(id).populate("reviews");

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

router.post("/",validateListing, wrapAsync(async (req,res,next) => {
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
   router.get("/:id/edit",async(req,res)=>{
     let { id } = req.params;
       const listing = await Listing.findById(id);
   res.render("listings/edit.ejs",{listing})
     });
   //update route
   
   router.put("/:id",validateListing,wrapAsync(async (req, res) => {
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
   router.delete("/:id",async(req,res)=>{
     let { id } = req.params;
     const deletedListing= await Listing.findByIdAndDelete(id);
     console.log(deletedListing);
     res.redirect("/listings");
   }); 

   module.exports=router;