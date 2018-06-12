var mongoose = require("mongoose"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment");
    
// var data = [
//     {name: "Sparks Lake",
//     image: "https://i.pinimg.com/originals/2e/b9/b5/2eb9b5dab5c2c5635fa050c0da4f8b3f.jpg",
//     description: "Boat-in only camp sites that don’t require reservations. Backcountry camping just a short paddle from your car. Epic views of South Sister, Mt. Bachelor, and Broken Top. Secluded lakeside campsites."    
//     },
//     {name: "Sapmi Nature Camp",
//     image: "http://www.sapminature.com/wp-content/uploads/2017/06/SapmiNatureCamp_auroraslider.jpg",
//     description: "Sápmi Nature Camp is a newly opened, personal, sustainable and small-scale camp that offers high quality, close to nature accommodation in the Laponia World Heritage Area, outside Gällivare and Jokkmokk."    
//     },
//     {name: "Arches National Park",
//     image: "https://i.pinimg.com/originals/1b/0e/9e/1b0e9e137484100cb86b3338ab313b91.jpg",
//     description: "Camp among slickrock outrcoppings at Devils Garden Campground, 18 miles from the park entrance. "    
//     }
// ];
    
    
    
function seedDB(){
    // remove campgrounds
    Campground.remove({}, function(err){
        if(err){
            console.log(err);
        } else {
            console.log("removed!");
            // add campgrounds
        //     data.forEach(function(seed){
        //         Campground.create(seed, function(err, campground){
        //             if(err){
        //                 console.log(err);
        //             } else {
        //                 console.log("created!");
        //                 // create comment
        //                 Comment.create(
        //                     {text: "This place is great!",
        //                      author: "Person"
        //                     }, function(er, comment){
        //                         if(err){
        //                             console.log(err);
        //                         } else {
        //                             campground.comments.push(comment);
        //                             campground.save();
        //                             console.log("created comments");
        //                         }
        //                     }
        //                 );
        //             }
        //         });
        //     });
         }
    });
}

module.exports = seedDB;
