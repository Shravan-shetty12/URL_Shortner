const express=require('express');
require("dotenv").config();
const path=require('path');
const cookieParser=require('cookie-parser');
const connectToMongoDB = require('./connect');
const {v4:uuidv4}=require('uuid');
const {restrictTo,checkForAuthentication}=require('./middleware/auth');
const session = require("express-session");
const passport = require("passport");
require('./config/passport');





 

const urlRoutes=require('./routes/url');
const staticRoute=require('./routes/staticRouter');
const userRoutes=require('./routes/user');      
const authRoutes = require("./routes/auth");

const app=express();
const port=8001;

//OAuth session configuration
app.use(
  session({
    secret: "secretkey",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());



app.use(express.urlencoded({extended:false}));
app.use(express.json());//middleware to parse json request body
app.use(cookieParser());//middleware to parse cookies from incoming requests
app.use(checkForAuthentication);//middleware to check for authentication in incoming requests and set req.user accordingly  
   
app.use("/url",restrictTo(["NORMAL"]),urlRoutes);
app.use("/",staticRoute);//for ejs home files
app.use("/user",userRoutes);   
app.use("/auth", authRoutes); // for O Authentication routes


 


app.set('view engine','ejs');
app.set('views',path.resolve("./views"));





//redirecting to the main url and updating the visit history
const URL=require('./models/url');
const { url } = require('inspector');


app.get('/:shortId', async (req,res)=>{
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate(
        { shortId },
        { $push:{ visitHistory:{ timestamp:Date.now() } } }
    );
    if(!entry){
        return res.status(404).send("Short URL not found");
    }
    return res.redirect(entry.redirectURL);
});











app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});
connectToMongoDB(process.env.Mongo_URL).then(()=>{
    console.log('Connected to MongoDB');
});
