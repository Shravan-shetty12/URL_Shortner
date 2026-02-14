const {nanoid} = require('nanoid');
const URl=require('../models/url');
async function handleGenerateNewShortUrl(req,res) {
    const body=req.body;
    if(!body.url) return res.status(400).json({error:'URL is required'});
    const shortId = nanoid(8);

    await URl.create({
        shortId:shortId,
        redirectURL:body.url,
        visitHistory:[]
});

res.json({shortId:shortId});
    
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
