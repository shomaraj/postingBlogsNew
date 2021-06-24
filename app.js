//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");

const mongoose = require("mongoose");

const path = require("path");
const fs = require("fs");

const homeStartingContent = "Nature is the most precious and valuable gift to us on the earth. Nature makes our life easy by providing all the required resources for daily living. We should be thankful to our nature for helping, caring and nurturing us like a mother.Nature has been proven, time and time again, to reduce depression, anxiety, stress, and anger, as well as generally boost psychological wellbeing. Nature can help to make you feel happier and more content as a person, which can improve many areas of your life.Everyone has a comfortable place to escape for relaxation. They go there when they need to be alone and not with people to disturb them.  Nature, in the spring, relaxes  with its magical colors. All love sitting in the green grass and listening to the nature sounds around . Flowers with mesmerizing colors amidst of the birds singing and chirping as if they are creating a song. After sitting for a few minutes,  hear the light breeze coming down through the trees, waving their leaves. But there is something we love above all those things. It is a peaceful quietness that you can't get in a big city or town.  You don't need a sweater or something to keep warm, just the joy of being there. When you look around you can see beautiful bright clear things. A tall green grass and the leaves on the trees dancing in the breeze. Then see the bright flowers around. Most days, unless rainy, flowers are bright, shiny, and warm. The sky is a beautiful blue landscape with fantastic clouds in it. The clouds are big, foamy things resting in the infinite sky. They have different shapes, that makes them fun.\n"+"Ever tried to understand why everything is so beautiful in nature? The whiteness of snow, the brightness of sky, greenness of trees and blueness of water. This is because they give the contemplance, warmth and comfort, which one strives in life."

const aboutContent = "I'm a true nature lover and an Explorer....A travel enthusiast................."+"\n" +" Do you find happiness in single drop of rain? Do you love listening to chirping of birds or being lost amidst the greenery of mother earth? Well, if answer to all such questions is Yes, then you are a true nature lover. The joy of being around the nature is priceless. However, amidst the hustle and bustle of life, we have forgotten to enjoy what we want to. Because of this, stress has overpowered our lives and we have become a time machine. Jealousy, anger, negativity is what is taking over humans. But in midst of these all burdens of life, if you take out a moment and enjoy the beloved nature, I am sure you would find beauty everywhere and start seeing everything in a good way in your life..";
const contactContent = "Interested in knowing more about our activities?..We are incredibly responsive to your requests and value your queries. If you have any queries or suggestions please write to us";

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
//mongoose.connect("mongodb://localhost:27017/blogDB", {
mongoose.connect("mongodb+srv://Admin-Shoma:test123@cluster0.h8r1o.mongodb.net/blogDB", {
  useNewUrlParser: true,
   useUnifiedTopology: true,
   useCreateIndex: true,
   useFindAndModify: false
});
const postsSchema = {
  title : String,
  content: String,
  imageUrl: String

};
const Post = new mongoose.model("post", postsSchema);


app.get("/", function(req, res){
  Post.find({},function (err,posts) {
  res.render("home", {
    startingContent: homeStartingContent,
    posts: posts
    });
  });
});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){

  // posts.push(post); //storing in array
//console.log("post.content is:"+post.content);

  // Find the document for updating

  const post = new Post({
      title: req.body.postTitle,
      content: req.body.postBody,
      imageUrl:req.body.postImagefile

    });
console.log("img  :+post.postImagefile");
 const query = { "title": post.title };
  // Set some fields in that document
  const update = {
    "$set": {
      "title": post.title,
      "content": post.content,
      "imageUrl":post.imageUrl
    }
  };
  // Return the updated document instead of the original document
  const options = { returnNewDocument: true };
  return Post.findOneAndUpdate(query, update, options) //updates an existing post
    .then(updatedDocument => {
      if(updatedDocument) {
        console.log(`Successfully updated post: ${updatedDocument}.`);
        res.redirect("/");
      } else {
        console.log("A new post adding to the database.");

        post.save();
        console.log("db is  : +post");// store the new postin database
        res.redirect("/");
      }
      return updatedDocument;
    })
    .catch(err => console.error(`Failed to find and update document: ${err}`));

}); //closing for /compose


// app.get  to include DB (without using array posts)

app.get("/posts/:postname", function(req, res){
  const requestedname= req.params.postname;
  console.log("u r in page"+requestedname);
Post.findOne({title:requestedname},function (err,post) {
      res.render("post", {
        title: post.title,
        content: post.content,
        imageUrl:post.imageUrl
      });

  });

});

// delete post from home page
app.post("/",function (req,res) {

  var postId_Del=req.body.buttonDel;
  var postId_Edit=req.body.buttonEdit;

if(!postId_Edit){
  // alert("sure to delete?");
  Post.findByIdAndRemove(postId_Del,function (err) {
    if(err) {
      console.log(err);
    }
    else {
       console.log("successfully deleted the post  ");
       res.redirect("/");
  }
});
}else{
  Post.findOne({id:postId_Edit},function (err,post) {
    res.render("compose");
});
}
});

app.post("/mail",function (req,res) {
  res.send("We will reply soon");
});
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
//app.listen(port);

app.listen(port, function() {
  console.log("Server started on port");
});
