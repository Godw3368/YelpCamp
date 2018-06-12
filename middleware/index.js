var middlewareObj = {},
    Campground = require("../models/campground"),
    User = require("../models/user"),
    Comment = require("../models/comment");



// CAMPGROUND

middlewareObj.checkCampgroundOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
            if (err || !foundCampground){
                req.flash("error", "I'm Sorry That Campground is not Found");
                res.redirect("back");
            } else {
                if(foundCampground.author.id.equals(req.user._id) || req.user.isAdmin){
                   next(); 
                } else {
                    req.flash("error", "I'm Sorry You Don't Have Authorization For That");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "Please Login");
        res.redirect("back");
    }
};



// COMMENT

middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if (err || !foundComment){
                req.flash("error", "I'm Sorry, That Comment is not Found");
                res.redirect("back");
            } else {
                if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin){
                    next(); 
                } else {
                    req.flash("error", "I'm Sorry, You Don't Have Authorization For That");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "Please Login");
        res.redirect("back");
    }
};


// PROFILE

middlewareObj.checkProfileOwnership = function(req, res, next) {
    if(req.isAuthenticated()){
        User.findById(req.params.id, function(err, foundUser){
            if(err || !foundUser){
                req.flash("error", "User not found");
                res.redirect("back");
            } else {
                if(foundUser._id.equals(req.user._id) || req.user.isAdmin){
                    next();
                } else {
                    req.flash("error", "Sorry, You Don't Have Permission");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "Please Log In");
        res.redirect("back");
    }
};



// ISLOGGEDIN

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please Login");
    res.redirect("/login");
};









module.exports = middlewareObj;
