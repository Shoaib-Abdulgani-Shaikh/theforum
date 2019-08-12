var express =require("express");
var bodyparser=require("body-parser");
var path=require("path");
var rn = require('random-number');
var multer=require('multer');
var mysql = require('mysql');
var app=express();

var options = {
    min:  100
  , max:  1000
  , integer: true
  }

"use strict";
const nodemailer = require("nodemailer");

//inittializations
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'public'));

//setting up[ middleweare]

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,'public')));



//database connection

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "user_pictures"
});






//starting file
app.get('/',function(req,res){
  
  res.render('main');
  
  })
//to uploadvideoorpicture
app.get('/uploadingcontent',function(req,res){
res.render('uploadvideoorpicture');
});

//to shows_video_image
app.get('/readingcontent',function(req,res){
 var pictures;
  con.query("select * from picture_info",function(err,result) {
    if (err) throw err;
    
    pictures=result;
  });

  con.query("select * from video_info",function(err,result) {
    if (err) throw err;
    console.log("Connected!");
    res.render('shows_video_image',{videos:result,pictures});
  });

  
  });

//to uploadvideoorpicture
app.get('/uploadingcontent',function(req,res){
res.render('uploadvideoorpicture');
});

//starting file checking if else...!!!!impppppp
app.get('/',function(req,res){
  var msg=0;
    res.render('shows_video_image',{d:msg});
    
    })






    
//to main.ejs

app.post('/signin',function(req,res){
res.render('main');
});

//otpsend
app.post('/sendotp',function(req,res){

    

     var create_mail=req.body.create_account_mail;
     var create_mail_password=req.body.create_account_password;
     console.log(create_mail);
     console.log(create_mail_password);

var random_number=rn(options);
console.log(random_number);
    //nodemailer starts...!!! 
    

        
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                   user: 'shoaibsshaikh12@gmail.com',
                   pass: '9881Superman'
               }
           });
      
        
        const mailOptions = {
            from: 'TheForumCommunity@gmail.com', 
            to: create_mail, 
            subject: 'THE FORUM', 
            text: 'Your O.T.P. is '+random_number+' please do not share it with anyone.'
          };

          transporter.sendMail(mailOptions, function(error, response){
            if(error){
            console.log(error);
            res.end("error");
            }else{
            console.log("Message sent: " + response.message);
            res.end("sent");
            }
            });


console.log("send");



    res.render('createaccount');
    });

//veryify
app.post('/verifyotp',function(req,res){
    res.render('createaccount');

    });


//multer initializations
var storage = multer.diskStorage({
    destination:'./public/uploads/images',
    filename: function(req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() +path.extname(file.originalname));
    }
  });

  var upload = multer({ storage: storage }).single('user_uploaded_image');



//uploading images

app.post('/upload_image',function(req,res){
upload(req,res,function(err){

    console.log(req.file);
    console.log(req.file.filename);
    var nm="uploads/images/"+req.file.filename;
    con.connect(function(err)
    {

      var sql = "INSERT INTO picture_info VALUES ('"+nm+"',0,0)";
      con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("1 record inserted");
  });
    });
    res.render('uploadingpicture', {msg:'Image Uploaded Successfully..!!'} );
});
});


var x;
//multer initializations videos
var storage2 = multer.diskStorage({
    destination:'./public/uploads/videos',
    filename: function(req, file, cb) {

      cb(null, file.fieldname + '-' + Date.now() +path.extname(file.originalname));
    }
  });

  var upload2 = multer({ storage: storage2 }).single('user_uploaded_video');

//uploading video

app.post('/upload_video',function(req,res){
    upload2(req,res,function(err){
    
        console.log(req.file);
        console.log(req.file.filename);
        var nm="uploads/videos/"+req.file.filename;
        con.connect(function(err)
        {
    
          var sql = "INSERT INTO video_info VALUES ('"+nm+"',0,0)";
          con.query(sql, function (err, result) {
          if (err) throw err;
          console.log("1 record inserted");
      });
        });


        
        res.render('uploadingvideo',{msg:'Video Uploaded Successfully..!!'});
    });
    });


    var vidupdatedlikes=0;
    var vidupdatedupvotes=0;
//liking the video.................!!!!!!!!!!!
app.post('/like_video',function(req,res){
  vidupdatedlikes=1;
  var name=req.body.likebutton;
  console.log(name);
  var pictures;
  con.query("select * from picture_info",function(err,result) {
    if (err) throw err;
    
    pictures=result;
  });
  con.query("update video_info set likes=likes+'"+vidupdatedlikes+"' where vname='"+name+"'",function(err,result) {
    if (err) throw err;
    console.log(vidupdatedlikes);
    
  });
  con.query("select * from video_info ",function(err,result) {
    if (err) throw err;
    console.log(result);
    res.render('shows_video_image',{videos:result,pictures});
  });
  
});

//upvoting the video....................!!!!!!!
app.post('/upvote_video',function(req,res){
  vidupdatedupvotes=1;
  var name=req.body.trendbutton;
  var pictures;
  con.query("select * from picture_info",function(err,result) {
    if (err) throw err;
    
    pictures=result;
  });
  con.query("update video_info set upvotes=upvotes+'"+vidupdatedupvotes+"' where vname='"+name+"'",function(err,result) {
    if (err) throw err;
    console.log(vidupdatedupvotes);
    
  });
  con.query("select * from video_info ",function(err,result) {
    if (err) throw err;
    console.log(result);
    res.render('shows_video_image',{videos:result,pictures});
  });
 
  console.log(name);
  
});
//liking image............!!!!!!!

app.post('/like_image',function(req,res){
var videos;
  var name=req.body.likeimagebutton;
  console.log(name);
  con.query("select * from video_info ",function(err,result) {
    if (err) throw err;
    console.log(result);
    videos=result;
  });

  con.query("update picture_info set likes=likes+1 where pname='"+name+"'",function(err,result) {
    if (err) throw err;
    
    
  });
  con.query("select * from picture_info ",function(err,result) {
    if (err) throw err;
    console.log(result);
    res.render('shows_video_image',{videos,pictures:result});
  });
  
});


//upvoting the video....................!!!!!!!
app.post('/upvote_image',function(req,res){

  var videos;
  var name=req.body.upvoteimagebutton;
  console.log(name);
  con.query("select * from video_info ",function(err,result) {
    if (err) throw err;
    console.log(result);
    videos=result;
  });

  con.query("update picture_info set upvotes=upvotes+1 where pname='"+name+"'",function(err,result) {
    if (err) throw err;
    
    
  });
  con.query("select * from picture_info ",function(err,result) {
    if (err) throw err;
    console.log(result);
    res.render('shows_video_image',{videos,pictures:result});
  });
  
});



app.get('/upload_video',function(req,res)
{
  res.render('uploadingvideo',{msg:"select Video..!!"});
}
);

app.get('/upload_picture',function(req,res)
{
  res.render('uploadingpicture',{msg:"select picture..!!"});
}
);

//listening
app.listen(3000,function(req,res){

    console.log('turned on 3000');
    
    })