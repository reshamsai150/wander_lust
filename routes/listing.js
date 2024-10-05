const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");

const Listing=require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");



//Index Route
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});

    res.render("listings/index.ejs", {allListings});
 }));

//New Route
router.get("/new",isLoggedIn,(req,res)=>{

  res.render("listings/new.ejs");
})
//show route
router.get("/:id", async (req, res) => {
  try {
    let { id } = req.params;
   
    const listing = await Listing.findById(id).populate({path:"reviews",populate: {
      path:"author",
    }}).populate("owner");

    if (!listing) {
      req.flash("error","Listing you requested for doesnot exist");
      res.redirect("/listings");
    }
   console.log(listing);
    res.render("listings/show.ejs", { listing }); // Update the path here
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

//create route

router.post("/",isLoggedIn,validateListing, wrapAsync(async (req,res,next) => {
    
  const newListing = new Listing(req.body.listing);

  newListing.owner=req.user._id;
    await newListing.save();
    req.flash("success","New Listing Created");
    res.redirect("/listings");
  })
);
   
   //edit route
   router.get("/:id/edit",isLoggedIn,async(req,res)=>{
     let { id } = req.params;
       const listing = await Listing.findById(id);
       if (!listing) {
        req.flash("error","Listing you requested for doesnot exist");
        res.redirect("/listings");
      }
   res.render("listings/edit.ejs",{listing})
     });
   //update route
  //  isLoggedIn is the middleware checks whether user is loggedin or not
   router.put("/:id",isLoggedIn,
   isOwner,validateListing,wrapAsync(async (req, res) => {
     let { id } = req.params;
      let listing=await Listing.findById(id);
     const prevListing = await Listing.findById(id);
     
     if(!listing.owner._id.equals(res.locals.currUser._id)){
      req.flash("error","you don't have permission to edit");
      return res.redirect(`/listings/${id}`);
     }
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
     
     req.flash("success","Listing updated");
     res.redirect(`/listings/${id}`);
   }));
   
   //delete route
   router.delete("/:id",isLoggedIn,async(req,res)=>{
     let { id } = req.params;
     const deletedListing= await Listing.findByIdAndDelete(id);
     console.log(deletedListing);
     req.flash("success"," Listing Deleted");
     res.redirect("/listings");
   }); 

   module.exports=router;