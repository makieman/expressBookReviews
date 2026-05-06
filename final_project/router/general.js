const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require("axios");

const public_users = express.Router();


// REGISTER
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  if (isValid(username)) {
    return res.status(400).json({ message: "User already exists" });
  }

  users.push({ username, password });

  return res.status(200).json({ message: "User successfully registered" });
});


// GET ALL BOOKS
public_users.get('/', async (req, res) => {
  try {
    const response = await axios.get("http://localhost:5000/");
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books" });
  }
});


// GET BY ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
  try {
    const isbn = req.params.isbn;
    const response = await axios.get("http://localhost:5000/");
    const booksData = response.data;

    const book = booksData[isbn];

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    return res.status(200).json(book);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching by ISBN" });
  }
});


// GET BY AUTHOR
public_users.get('/author/:author', async (req, res) => {
  try {
    const author = req.params.author.toLowerCase();
    const response = await axios.get("http://localhost:5000/");
    const booksData = response.data;

    let result = {};

    Object.keys(booksData).forEach(key => {
      if (booksData[key].author.toLowerCase() === author) {
        result[key] = booksData[key];
      }
    });

    if (Object.keys(result).length === 0) {
      return res.status(404).json({ message: "No books found for this author" });
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching by author" });
  }
});


// GET BY TITLE
public_users.get('/title/:title', async (req, res) => {
  try {
    const title = req.params.title.toLowerCase();
    const response = await axios.get("http://localhost:5000/");
    const booksData = response.data;

    let result = {};

    Object.keys(booksData).forEach(key => {
      if (booksData[key].title.toLowerCase() === title) {
        result[key] = booksData[key];
      }
    });

    if (Object.keys(result).length === 0) {
      return res.status(404).json({ message: "No books found for this title" });
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching by title" });
  }
});


// GET REVIEWS
public_users.get('/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;

  const book = books[isbn];

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  return res.status(200).json(book.reviews || {});
});


module.exports.general = public_users;