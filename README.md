# 🔗 URL Shortener

A full-stack URL shortening service built with **Node.js, Express, MongoDB, and Redis**. It turns long URLs into short, shareable links, caches redirects for fast lookups, tracks click analytics, and includes user authentication and an admin dashboard.

**Live Demo:** [url-shortner-mere.onrender.com](https://url-shortner-mere.onrender.com)

---

## ✨ Features

- **Short link generation** with unique 8-character IDs (nanoid) or **custom aliases**
- **Fast redirects** using a Redis cache-aside layer with MongoDB as the source of truth
- **Click analytics**: every visit is timestamped and stored per link
- **Authentication**: email/password (bcrypt + JWT in cookies) and **Google OAuth 2.0**
- **Role-based access control**: `NORMAL` and `ADMIN` roles
- **Admin dashboard**: view all users and links, see Redis cache status, and delete any link
- **Rate limiting**: link creation limited to 10 requests per minute
- **Responsive UI** with light/dark theme and one-click copy

## 🛠️ Tech Stack

| Layer          | Technologies                                    |
| -------------- | ----------------------------------------------- |
| Frontend       | EJS, HTML, CSS, vanilla JavaScript              |
| Backend        | Node.js, Express 5                              |
| Database       | MongoDB (Mongoose)                              |
| Cache          | Redis (ioredis)                                 |
| Auth           | JWT, Passport.js (Google OAuth 2.0), bcrypt     |
| Security       | express-rate-limit, cookie-parser               |
| Deployment     | Render, MongoDB Atlas                           |

## 🏗️ Architecture

![Architecture Diagram](
<img width="3413" height="1847" alt="architecture" src="https://github.com/user-attachments/assets/1aceeed5-c07e-4c06-806a-e18361453950" />)

The application follows an MVC pattern. Redirects use a **cache-aside** strategy: Redis is checked first, MongoDB is the source of truth, and every visit is logged in MongoDB for analytics.

## 📁 Project Structure

```text
├── config/          # Passport (Google OAuth) and Redis configuration
├── controllers/     # URL and user business logic
├── middleware/      # Authentication, authorization, rate limiting
├── models/          # Mongoose schemas (URL, User)
├── routes/          # Route definitions (urls, users, auth, pages, admin)
├── service/         # JWT sign/verify helpers
├── utils/           # Email utility
├── views/           # EJS templates and partials
├── public/          # Static assets (CSS, JS)
├── connect.js       # MongoDB connection
└── index.js         # Application entry point
```

## 🚀 Getting Started

### Prerequisites

- Node.js v20 or later
- A MongoDB instance (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- A Redis instance (local or hosted)
- Google OAuth credentials from the [Google Cloud Console](https://console.cloud.google.com/)

### Installation

```bash
git clone https://github.com/Shravan-shetty12/URL_Shortner.git
cd URL_Shortner
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
PORT=8001
Mongo_URL=mongodb://localhost:27017/url-shortener
REDIS_URL=redis://localhost:6379
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:8001/auth/google/callback
```

> The variable is named `Mongo_URL` (case-sensitive), as read by `index.js`.

### Run

```bash
npm run dev     # development (nodemon)
npm start       # production
```

The app is available at `http://localhost:8001`.

### Creating an Admin

New accounts are created with the `NORMAL` role. To grant admin access, set the user's `role` field to `ADMIN` directly in MongoDB, then log in again.

## 📡 Routes

| Method | Endpoint                        | Access  | Description                            |
| ------ | ------------------------------- | ------- | -------------------------------------- |
| GET    | `/`                             | User    | Dashboard with your links              |
| POST   | `/url`                          | Normal  | Create a short URL (rate limited)      |
| GET    | `/url/analytics/:shortId`       | Normal  | Total clicks and visit timestamps      |
| POST   | `/url/:shortId/delete`          | Normal  | Delete your own short URL              |
| GET    | `/:shortId`                     | Public  | Redirect to the original URL           |
| POST   | `/user`                         | Public  | Register with email and password       |
| POST   | `/user/login`                   | Public  | Log in                                 |
| GET    | `/user/logout`                  | Public  | Log out                                |
| GET    | `/auth/google`                  | Public  | Start Google OAuth login               |
| GET    | `/admin/urls`                   | Admin   | View all users and URLs, cache status  |
| POST   | `/admin/urls/:shortId/delete`   | Admin   | Delete any short URL                   |

### Creating a short URL

`POST /url` accepts form or JSON fields:

| Field         | Required | Description                                       |
| ------------- | -------- | ------------------------------------------------- |
| `url`         | Yes      | The full destination URL (must be a valid URL)    |
| `customAlias` | No       | Letters, numbers, `-`, and `_` only; must be unique |
