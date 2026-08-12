# 🔗 URL Shortener

A full-stack URL Shortener built with **Node.js, Express.js, MongoDB, and EJS**. The application converts long URLs into short, shareable links and tracks URL visits.

## 🚀 Live Demo

**[URL Shortener](https://url-shortner-mere.onrender.com)**

## ✨ Features

* 🔗 Generate unique short URLs
* ↪️ Redirect short URLs to original URLs
* 📊 Track URL visit history
* 👤 User signup and login
* 🔐 JWT-based authentication
* 🔑 Google OAuth authentication
* 🍪 Cookie-based session handling
* 🗄️ MongoDB-based data persistence
* ☁️ Deployed on Render with MongoDB Atlas

## 🛠️ Tech Stack

**Frontend:** EJS, HTML, CSS
**Backend:** Node.js, Express.js
**Database:** MongoDB, Mongoose
**Authentication:** JWT, Passport.js, Google OAuth
**Deployment:** Render, MongoDB Atlas

## 📁 Project Structure

```text
URL_Shortner/
├── config/          # Passport / OAuth configuration
├── controllers/     # Application business logic
├── middleware/      # Authentication middleware
├── models/          # MongoDB schemas
├── routes/          # Application routes
├── service/         # Authentication services
├── views/           # EJS frontend templates
├── connect.js       # MongoDB connection
└── index.js         # Application entry point
```

## ⚙️ Run Locally

```bash
git clone https://github.com/Shravan-shetty12/URL_Shortner.git
cd URL_Shortner
npm install
npm start
```

Create a `.env` file with the required MongoDB, JWT, Google OAuth, and session credentials.

## 🔄 How It Works

```text
Long URL
   ↓
Express Route
   ↓
Controller
   ↓
Generate Short ID
   ↓
MongoDB
   ↓
Short URL
   ↓
User accesses Short URL
   ↓
Lookup + Track Visit
   ↓
Redirect to Original URL
```

## 📌 Future Improvements

* Advanced analytics dashboard
* Custom short URLs
* URL expiration
* Rate limiting
* Redis caching
* Automated testing
* CI/CD pipeline
