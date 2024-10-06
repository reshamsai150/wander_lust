const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");

const Listing=require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");

const listingController=require("../controllers/listings.js");

//Index Route
router.get("/", wrapAsync(listingController.index));

//New Route
router.get("/new",isLoggedIn,listingController.renderNewForm);
//show route
router.get("/:id", wrapAsync(listingController.showListing) 
);
//create route

router.post("/",isLoggedIn,validateListing, wrapAsync(listingController.createListing)
);
  
   //edit route
   router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));
  
   //update route
  //  isLoggedIn is the middleware checks whether user is loggedin or not
   router.put("/:id",isLoggedIn,
   isOwner,validateListing,wrapAsync(listingController.updateListing));
   
   //delete route
   router.delete("/:id",isLoggedIn,
    listingController.destroyListing); 

   module.exports=router;