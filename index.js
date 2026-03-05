const express=require('express');
require("dotenv").config();
const path=require('path');
const cookieParser=require('cookie-parser');
const connectToMongoDB = require('./connect');
const {v4:uuidv4}=require('uuid');
const {restrictTo,checkForAuthentication}=require('./middleware/auth');



 

const urlRoutes=require('./routes/url');
const staticRoute=require('./routes/staticRouter');
const userRoutes=require('./routes/user');      


const app=express();
const port=8001;

app.use(express.urlencoded({extended:false}));
app.use(express.json());//middleware to parse json request body
app.use(cookieParser());//middleware to parse cookies from incoming requests
app.use(checkForAuthentication);//middleware to check for authentication in incoming requests and set req.user accordingly  
   
app.use("/url",restrictTo(["NORMAL"]),urlRoutes);
app.use("/",staticRoute);//for ejs home files
app.use("/user",userRoutes);   


 


app.set('view engine','ejs');
app.set('views',path.resolve("./views"));

app.get("/test",async (req,res)=>{
    const allUrls=await URL.find();
    return res.render('home',{
        urls:allUrls,
    });
        
    });



//redirecting to the main url and updating the visit history
const URL=require('./models/url');
const { url } = require('inspector');


app.get('/:shortId',async(req,res)=>{
    const shortId=req.params.shortId;
    const entry= await URL.findOneAndUpdate({shortId},{$push:{visitHistory:{timestamp:Date.now()}}});
    return res.redirect(entry.redirectURL);
});











app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});
connectToMongoDB(process.env.Mongo_URL).then(()=>{
    console.log('Connected to MongoDB');
});
