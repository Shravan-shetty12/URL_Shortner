const User = require("../models/user");
const { setUser } = require("../service/auth");

async function handleUserRegistration(req, res) {
  const name = req.body.name?.trim();
  const email = req.body.email?.trim().toLowerCase();
  const password = req.body.password;

  try {
    // Check existing account
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).render("signup", {
        error: "An account with this email already exists.",
        name,
        email,
      });
    }

    // Create account
    await User.create({
      name,
      email,
      password,
    });

    return res.redirect("/login");
  } catch (err) {
    // MongoDB duplicate-key protection
    if (err.code === 11000) {
      return res.status(409).render("signup", {
        error: "An account with this email already exists.",
        name,
        email,
      });
    }

    console.error("REGISTRATION ERROR:", err);

    return res.status(500).render("signup", {
      error: "Something went wrong. Please try again.",
      name,
      email,
    });
  }
}

async function handleUserlogin(req, res) {
  const email = req.body.email?.trim().toLowerCase();
  const { password } = req.body;

  const user = await User.findOne({
    email,
    password,
  });

  if (!user) {
    return res.render("login", {
      error: "Invalid credentials",
    });
  }

  const token = setUser(user);

  res.cookie("token", token);

  return res.redirect("/");
}

module.exports = {
  handleUserRegistration,
  handleUserlogin,
};
