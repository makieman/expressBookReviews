const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const { username, password } = req.body;

    // Check if username & password provided
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password required" });
    }
    // Check if user already exists
    if (isValid(username)) {
      return res.status(400).json({ message: "User already exists" });
    }
    // Add new user
    users.push({ username, password });
  
    return res.status(200).json({ message: "User successfully registered" });
  });

// Get the book list available in the shop
const axios = require("axios");

public_users.get('/', async function (req, res) {
  try {
    const response = await axios.get("http://localhost:5000/");
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books" });
  }
});
// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    try {
      const isbn = req.params.isbn;
      const response = await axios.get("http://localhost:5000/");
      const books = response.data;
  
      return res.status(200).json(books[isbn]);
    } catch (error) {
      return res.status(500).json({ message: "Error fetching book by ISBN" });
    }
  });
  
// get the author
  public_users.get('/author/:author', async function (req, res) {
    try {
      const author = req.params.author.toLowerCase();
      const response = await axios.get("http://localhost:5000/");
      const books = response.data;
  
      let result = {};
  
      Object.keys(books).forEach(key => {
        if (books[key].author.toLowerCase() === author) {
          result[key] = books[key];
        }
      });
  
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ message: "Error fetching by author" });
    }
  });

// Get all books based on title


//  Get book review
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
