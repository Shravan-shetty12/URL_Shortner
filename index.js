const express=require('express');
require("dotenv").config();

const app=express();
const port=8001;
app.use(express.json());
const connectToMongoDB = require('./connect');
const urlRoutes=require('./routes/url');
app.use("/url",urlRoutes);

//redirecting to the main url and updating the visit history
const URL=require('./models/url');
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
