const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register a new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  if (users.find(u => u.username === username)) {
    return res.status(409).json({ message: "User already exists" });
  }
  users.push({ username, password });
  return res.status(200).json({ message: "User successfully registered" });
});

// Task 10: Get all books using Promise
public_users.get('/', async function (req, res) {
  new Promise((resolve, reject) => {
    resolve(books);
  })
  .then(data => res.status(200).json(data))
  .catch(err => res.status(500).json({ message: "Error retrieving books" }));
});

// Task 11: Get book by ISBN using Promise
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  new Promise((resolve, reject) => {
    const book = books[isbn];
    if (book) {
      resolve(book);
    } else {
      reject("Book not found");
    }
  })
  .then(data => res.status(200).json(data))
  .catch(err => res.status(404).json({ message: err }));
});

// Task 12: Get books by Author using Promise
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  new Promise((resolve, reject) => {
    const booksByAuthor = {};
    Object.keys(books).forEach(key => {
      if (books[key].author === author) {
        booksByAuthor[key] = books[key];
      }
    });
    if (Object.keys(booksByAuthor).length > 0) {
      resolve(booksByAuthor);
    } else {
      reject("No books found for this author");
    }
  })
  .then(data => res.status(200).json(data))
  .catch(err => res.status(404).json({ message: err }));
});

// Task 13: Get books by Title using Promise
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;
  new Promise((resolve, reject) => {
    const booksByTitle = {};
    Object.keys(books).forEach(key => {
      if (books[key].title === title) {
        booksByTitle[key] = books[key];
      }
    });
    if (Object.keys(booksByTitle).length > 0) {
      resolve(booksByTitle);
    } else {
      reject("No books found with this title");
    }
  })
  .then(data => res.status(200).json(data))
  .catch(err => res.status(404).json({ message: err }));
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    return res.status(200).json(book.reviews);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
