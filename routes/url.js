const express = require('express');
const { handleGenerateNewShortUrl } = require('../controllers/url');
const { getAnalyticsForShortUrl } = require('../controllers/url');
const router = express.Router();

router.post('/',handleGenerateNewShortUrl); 

router.get('/analytics/:shortId',getAnalyticsForShortUrl);

module.exports = router;  