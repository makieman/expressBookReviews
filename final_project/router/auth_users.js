const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");

const regd_users = express.Router();

let users = [];

const SECRET_KEY = "fingerprint_customer";



const isValid = (username) => {
  return users.some(user => user.username === username);
};

const authenticatedUser = (username, password) => {
  return users.some(user => user.username === username && user.password === password);
};



regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username or password missing" });
  }

  const valid = authenticatedUser(username, password);

  if (!valid) {
    return res.status(401).json({ message: "Invalid login credentials" });
  }

  // create JWT token
  const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });

  req.session.authorization = {
    token,
    username
  };

  return res.status(200).json({ message: "Login successful", token });
});



regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.authorization.username;

  if (!review) {
    return res.status(400).json({ message: "Review is required" });
  }

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  books[isbn].reviews[username] = review;

  return res.status(200).json({
    message: "Review added/updated",
    reviews: books[isbn].reviews
  });
});



regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (books[isbn].reviews[username]) {
    delete books[isbn].reviews[username];
    return res.status(200).json({ message: "Review deleted successfully" });
  }

  return res.status(400).json({ message: "No review found for this user" });
});


// ------------------ EXPORTS ------------------

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;