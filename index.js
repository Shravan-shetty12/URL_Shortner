const express=require('express');
require("dotenv").config();
const path=require('path');
const connectToMongoDB = require('./connect');
const urlRoutes=require('./routes/url');
const staticRoute=require('./routes/staticRouter');



const app=express();
const port=8001;
app.use(express.urlencoded({extended:false}));
app.use(express.json());//middleware to parse json request body

app.use("/url",urlRoutes);
app.use("/",staticRoute)


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
res.redirect(entry.redirectURL);
});













app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});
connectToMongoDB(process.env.Mongo_URL).then(()=>{
    console.log('Connected to MongoDB');
});
