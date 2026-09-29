const User = require("../models/user");
const bcrypt = require("bcrypt");
const { setUser } = require("../service/auth");

async function handleUserRegistration(req, res) {
  try {
    let { name, email, password } = req.body;

    email = email.trim().toLowerCase();

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).render("signup", {
        error: "An account with this email already exists.",
        name,
        email,
      });
    }

    // Hash password before storing it
    const hashedPassword = await bcrypt.hash(password, 12);

    await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return res.redirect("/login");
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).render("signup", {
        error: "An account with this email already exists.",
        name: req.body.name,
        email: req.body.email,
      });
    }

    console.error("Registration error:", err);

    return res.status(500).render("signup", {
      error: "Something went wrong. Please try again.",
      name: req.body.name,
      email: req.body.email,
    });
  }
}

async function handleUserlogin(req, res) {
  const { email, password } = req.body;

  const user = await User.findOne({
    email: email.trim().toLowerCase(),
  });

  if (!user) {
    return res.status(404).render("signup", {
      error:
        "No account found with this email. Please create an account first.",
      email,
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).render("login", {
      error: "Invalid email or password. Please try again.",
      email,
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
