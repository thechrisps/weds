var express = require("express");
var app = express();
var router = express.Router();
var path = __dirname + '/views/';

router.use(function (req,res,next) {
  console.log("/" + req.method);
  next();
});

router.get("/",function(req,res){
  console.log("Providing "+path+"index.html");
  res.sendFile(path + "index.html");
});

app.use("/",router);

app.use("*",function(req,res){
  console.log("Providing "+path+"404.html");
  res.sendFile(path + "404.html");
});

app.listen(process.env.PORT,function(){
  console.log("App up! Live at Port"+process.env.PORT);
});
