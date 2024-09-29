const Listing=require("./models/listing");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("./schema.js");
const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
      let errMsg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(404, errMsg);
  } else {
      next();
  }
}
module.exports.isLoggedIn=(req,res,next)=>{
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
  let {id}=req.params;
      let listing=await Listing.findById(id);
          if(!listing.owner._id.equals(req.user._id)){
              req.flash("error","you dont have permission to make changes");
              return res.redirect(`/listings/${id}`);
          }
          next();
  
  };

  module.exports.validateReview=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
      let errMsg=error.details.map((el)=>el.message).join(",");
      throw new ExpressError(400,errMsg);
    }else{
      next();
    }
  };

