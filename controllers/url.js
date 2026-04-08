const {nanoid} = require('nanoid');
const URl=require('../models/url');


try {
   

const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}; 


async function handleGenerateNewShortUrl(req,res) {
    const body=req.body;
    if(!body.url || !isValidUrl(req.body.url)) return res.status(400).json({error:'URL is required'});
    const shortId = nanoid(8);

    await URl.create({
        shortId:shortId,
        redirectURL:body.url,
        visitHistory:[],
        createdBy:req.user._id,
});

res.redirect(`/?id=${shortId}`);
    
}




async function getAnalyticsForShortUrl(req,res) {
    const shortId=req.params.shortId;
    const result=await URl.findOne({shortId});

    return res.json({
        totalClicks:result.visitHistory.length,
        analytics:result.visitHistory
    });



}
module.exports={handleGenerateNewShortUrl,getAnalyticsForShortUrl};





} catch (err) {
   console.error(err);
   res.status(500).send("Server error");
}