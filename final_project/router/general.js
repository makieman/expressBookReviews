const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

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


public_users.get('/', function (req, res) {
  new Promise((resolve, reject) => {
    if (books) { resolve(books); } else { reject("No books found"); }
  })
  .then(data => res.status(200).send(JSON.stringify(data, null, 4)))
  .catch(err => res.status(500).json({ message: err }));
});


public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  try {
    const book = await new Promise((resolve, reject) => {
      if (books[isbn]) { resolve(books[isbn]); } else { reject("Book not found"); }
    });
    return res.status(200).send(JSON.stringify(book, null, 4));
  } catch (err) {
    return res.status(404).json({ message: err });
  }
});


public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  try {
    const data = await new Promise((resolve, reject) => {
      const booksByAuthor = {};
      Object.keys(books).forEach(key => {
        if (books[key].author === author) { booksByAuthor[key] = books[key]; }
      });
      if (Object.keys(booksByAuthor).length > 0) { resolve(booksByAuthor); }
      else { reject("No books found for this author"); }
    });
    return res.status(200).send(JSON.stringify(data, null, 4));
  } catch (err) {
    return res.status(404).json({ message: err });
  }
});


public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;
  try {
    const data = await new Promise((resolve, reject) => {
      const booksByTitle = {};
      Object.keys(books).forEach(key => {
        if (books[key].title === title) { booksByTitle[key] = books[key]; }
      });
      if (Object.keys(booksByTitle).length > 0) { resolve(booksByTitle); }
      else { reject("No books found with this title"); }
    });
    return res.status(200).send(JSON.stringify(data, null, 4));
  } catch (err) {
    return res.status(404).json({ message: err });
  }
});

public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) { return res.status(200).json(book.reviews); }
  else { return res.status(404).json({ message: "Book not found" }); }
});

module.exports.general = public_users;