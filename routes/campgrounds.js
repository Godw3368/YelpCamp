var express = require("express"),
    router = express.Router(),
    Campground = require("../models/campground"),
    middleware = require("../middleware"),
    multer = require('multer');


var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});

var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

var upload = multer({ storage: storage, fileFilter: imageFilter});


var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'godw3368', 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});




// INDEX ROUTE

router.get("/", function(req, res){
    var perPage = 12;
    var pageQuery = parseInt(req.query.page);
    var pageNumber = pageQuery ? pageQuery : 1;
    var noMatch = null;
    if(req.query.search){
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        //get all campgrounds from database
         Campground.find({name: regex}).skip((perPage * pageNumber) - perPage).limit(perPage).exec(function(err, allCampgrounds){
            Campground.count({name: regex}).exec(function (err, count) {
            if(err){
                console.log(err);
                res.redirect("back");
            } else {
                if(allCampgrounds.length < 1) {
                    noMatch = "Sorry, There Are No Campgrounds With That Name";
                }
                res.render("campgrounds/index", {
                    campgrounds: allCampgrounds,
                    page: 'campgrounds',
                    current: pageNumber,
                    pages: Math.ceil(count / perPage), 
                    noMatch: noMatch,
                    search: req.query.search
                    });
                }   
            });
        });
    } else {
        Campground.find({}).skip((perPage * pageNumber) - perPage).limit(perPage).sort({"createdAt":-1}).exec(function (err, allCampgrounds) {
            Campground.count().exec(function (err, count) {
            if(err) {
                console.log(err);
            } else {
                res.render("campgrounds/index", {
                    campgrounds: allCampgrounds,
                    current: pageNumber,
                    pages: Math.ceil(count / perPage),
                    noMatch: noMatch,
                    search: false
                });
            }
            });
        });
    }
});

// DATA PERSISTANCE!!

// CREATE ROUTE


router.post("/", middleware.isLoggedIn, upload.single('image'), function(req, res) {
    cloudinary.v2.uploader.upload(req.file.path, function(err, result) {
        if(err){
            req.flash("error", err.message);
            return res.redirect("back");
        }
      // add cloudinary url for the image to the campground object under image property
      req.body.campground.image = result.secure_url;
      // add image's public_id to campground object
      req.body.campground.imageId = result.public_id;
      // add author to campground
      req.body.campground.author = {
        id: req.user._id,
        username: req.user.username
        };
      Campground.create(req.body.campground, function(err, campground) {
        if (err) {
            req.flash('error', err.message);
            return res.redirect('back');
        }
        res.redirect('/campgrounds/' + campground.id);
        });
    });
});




// NEW ROUTE

router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});



// SHOW ROUTE

router.get("/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
       if(err || !foundCampground){
           req.flash("error", "I'm Sorry That Campground is not Found");
           res.redirect("back");
       } else {
           console.log(foundCampground);
          res.render("campgrounds/show", {campground: foundCampground}); 
       }
    });
});


// EDIT

router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            req.flash("error", "I'm Sorry You Don't Have Authorization For That");
        } else {
            res.render("campgrounds/edit", {campground: foundCampground});
        }
    });
});


// UPDATE

router.put("/:id", upload.single('image'), middleware.checkCampgroundOwnership, function(req, res){
    //find and update correct campground and redirect
    Campground.findById(req.params.id, async function(err, campground){
        if(err){
            req.flash("error", "I'm Sorry You Don't Have Authorization For That");
            res.redirect("back");
        } else {
            // check to see if there is a file then destroying w/cloudinary and uploading a new one
            if(req.file) {
                try {
                    await cloudinary.v2.uploader.destroy(campground.imageId);
                    var result = await cloudinary.v2.uploader.upload(req.file.path);
                    campground.imageId = result.public_id;
                    campground.image = result.secure_url;
                } catch(err) {
                    req.flash("error", err.message);
                    return res.redirect("back");
                }
            }
            campground.activities = req.body.campground.activities;
            campground.location = req.body.campground.location;
            campground.name = req.body.campground.name;
            campground.description = req.body.campground.description;
            campground.save();
            req.flash("success", "Successfully Updated");
            res.redirect("/campgrounds/" + campground._id);
        }
    });
});


// DESTROY

router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, async function(err, campground){
        if(err){
            req.flash("error", err.message);
            return res.redirect("back");
        } try {
            await cloudinary.v2.uploader.destroy(campground.imageId);
            campground.remove();
            req.flash("success", "Campground Successfully Deleted");
            res.redirect("/campgrounds");
        } catch(err) {
            if(err){
                req.flash("error", err.message);
                return res.redirect("back");
            }
        }
    });
});



function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}



module.exports = router;