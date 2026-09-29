const { nanoid } = require("nanoid");
const URl = require("../models/url");

try {
  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  async function handleGenerateNewShortUrl(req, res) {
    const body = req.body;
    if (!body.url || !isValidUrl(req.body.url))
      return res.status(400).json({ error: "URL is required" });
    const shortId = nanoid(8);

    await URl.create({
      shortId: shortId,
      redirectURL: body.url,
      visitHistory: [],
      createdBy: req.user._id,
    });

    res.redirect(`/?id=${shortId}`);
  }

  async function getAnalyticsForShortUrl(req, res) {
    const shortId = req.params.shortId;
    const result = await URl.findOne({ shortId });

    return res.json({
      totalClicks: result.visitHistory.length,
      analytics: result.visitHistory,
    });
  }

  async function handleDeleteShortUrl(req, res) {
    try {
      const { shortId } = req.params;

      const deletedUrl = await URl.findOneAndDelete({
        shortId: shortId,
        createdBy: req.user._id,
      });

      if (!deletedUrl) {
        return res.status(404).send("URL not found or unauthorized");
      }

      return res.redirect("/");
    } catch (error) {
      console.error("Delete URL error:", error);
      return res.status(500).send("Unable to delete URL");
    }
  }
  module.exports = {
    handleGenerateNewShortUrl,
    getAnalyticsForShortUrl,
    handleDeleteShortUrl,
  };
} catch (err) {
  console.error(err);
  res.status(500).send("Server error");
}
