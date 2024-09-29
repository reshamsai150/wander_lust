const Listing=require("./models/listing");

module.exports.isLoggedIn=(req,res,next)=>{
  // checks whether user is logged in or not
    if(!req.isAuthenticated())
        {
         req.session.redirectUrl=req.originalUrl;
          req.flash("error","you must be logged in to create Listing!");
           return res.redirect("/login");
        }
        next();
}
module.exports.saveRedirectUrl=(req,res,next)=>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl=req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner=async(req,res,next)=>{
  let { id } = req.params;
  let listing=await Listing.findById(id);
 const prevListing = await Listing.findById(id);
 
 if(!listing.owner._id.equals(res.locals.currUser._id)){
  req.flash("error","you don't have permission to edit");
  return res.redirect(`/listings/${id}`);
 }
}