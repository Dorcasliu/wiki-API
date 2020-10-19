const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const mongoose=require("mongoose");

const app=express();

app.set("view engine","ejs");

app.use(bodyParser.urlencoded({
  extends:true
}));

app.use(express.static("public"));


mongoose.connect("mongodb://localhost:27017/wikiDB",{useNewUrlParser:true});

const articleSchema={
  title:String,
  content:String
};

const Article=mongoose.model("Article",articleSchema);

/////////////////////////////////////////Request Targeting All Article ////////////////////////////////////////
app.get("/articles",function(req,res){
  Article.find({},function(err,articles){
    if (err){
      console.log(err);
    }
    else{
      console.log(articles);
      res.send(articles);
    }
  })
});

app.post("/articles",function(req,res){
  const newArtcile=new Article({
    title:req.body.title,
    content:req.body.content
  });
  newArtcile.save(function(err){
    if (!err){
      res.send("successfully added");
    }else{
      res.send(err);
    }
  });
  // res.redirect("/articles");
});

app.delete("/articles",function(req,res){
  Article.deleteMany({},function(err){
    if (!err){
      res.send("delete all successfully");
    }
    else{
      res.send(err);
    }
  })
});


/////////////////////////////////////////Request Targeting A Specific Article ////////////////////////////////////////
app.get("/articles/:articleTitle",function(req,res){
  Article.findOne({title:req.params.articleTitle},function(err,findArticle){
    if (err){
      res.send(err);
    }else{
      if (findArticle){
        res.send("foundOne successfully");
      }else{
        res.send("not exist");
      }
    }
  });
});

app.put("/articles/:articleTitle",function(req,res){
  Article.update(
    {title:req.params.articleTitle},
    {title:req.body.title,content:req.body.content},
    {overwrite:true},
    function(err){
      if (err){
        res.send(err);
      }else{
        res.send("changed successfully");
      }
  });
});

app.patch("/articles/:articleTitle",function(req,res){
  Article.update(
    {title:req.params.articleTitle},
    {$set:req.body},
    function(err){
      if (err){
        res.send(err);
      }else{
        res.send("patch! successfully");
      }
  });
});

app.delete("/articles/:articleTitle",function(req,res){
  Article.deleteOne({title:req.params.articleTitle},function(err){
    if (err){
      res.send(err);
    }else{
      res.send("delete successfully");
    }
  });
});

app.listen(3000,function(){
  console.log("Server started on port 3000.");
});
