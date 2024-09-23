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