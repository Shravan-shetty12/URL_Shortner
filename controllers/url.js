const { nanoid } = require("nanoid");
const URl = require("../models/url");
const redis = require("../config/redis");

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
    try {
      const { url } = req.body;

      const customAlias = req.body.customAlias?.trim();

      // Validate URL
      if (!url || !isValidUrl(url)) {
        return res.status(400).json({
          error: "Please enter a valid URL.",
        });
      }

      // Validate custom alias
      if (customAlias) {
        if (!/^[A-Za-z0-9_-]+$/.test(customAlias)) {
          return res.status(400).json({
            error:
              "Custom alias can contain only letters, numbers, hyphens and underscores.",
          });
        }

        // Check whether alias already exists
        const existingUrl = await URl.findOne({
          shortId: customAlias,
        });

        if (existingUrl) {
          return res.status(409).render("home", {
            error: "This custom alias is already taken.",
            urls: await URl.find({ createdBy: req.user._id }).sort({
              createdAt: -1,
            }),
          });
        }
      }

      // Use custom alias OR generate random ID
      const shortId = customAlias || nanoid(8);

      await URl.create({
        shortId,
        redirectURL: url,
        visitHistory: [],
        createdBy: req.user._id,
      });

      return res.redirect(`/?id=${shortId}`);
    } catch (err) {
      // Handles race-condition collision
      if (err.code === 11000) {
        return res.status(409).render("home", {
          error: "This custom alias is already taken. Please choose another.",
          urls: await URl.find({ createdBy: req.user._id }).sort({
            createdAt: -1,
          }),
        });
      }

      console.error("URL creation error:", err);

      return res.status(500).json({
        error: "Unable to create short URL. Please try again.",
      });
    }
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

      // Remove corresponding Redis cache
      await redis.del(`url:${shortId}`);

      return res.redirect("/");
    } catch (error) {
      console.error("Delete URL error:", error);
      return res.status(500).send("Unable to delete URL");
    }
  }
  async function handleAdminDeleteShortUrl(req, res) {
    try {
      const { shortId } = req.params;

      // Admin can delete any URL
      const deletedUrl = await URl.findOneAndDelete({
        shortId,
      });

      if (!deletedUrl) {
        return res.status(404).send("URL not found");
      }

      // Remove Redis cache
      await redis.del(`url:${shortId}`);

      return res.redirect("/admin/urls");
    } catch (error) {
      console.error("Admin delete URL error:", error);
      return res.status(500).send("Unable to delete URL");
    }
  }
  module.exports = {
    handleGenerateNewShortUrl,
    getAnalyticsForShortUrl,
    handleDeleteShortUrl,
    handleAdminDeleteShortUrl,
  };
} catch (err) {
  console.error(err);
  res.status(500).send("Server error");
}
