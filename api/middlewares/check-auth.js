
module.exports = (req, res, next) => {
    //if logged in
    if (req.isAuthenticated()) {
        next();
    }
    else {
          //not logged in
        req.flash("error", "oops!!You must login first")
        res.redirect("/users/login");
        
    }
  
   
}
