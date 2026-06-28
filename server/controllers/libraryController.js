import LibraryBook from "../models/LibraryBook.js";

export const getBooks = async (req, res) => {
  try {
    const books = await LibraryBook.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: books });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch books" });
  }
};

export const createBook = async (req, res) => {
  try {
    const exists = await LibraryBook.findOne({
      isbn: req.body.isbn,
    });

    if (req.body.isbn && exists) {
      return res.status(400).json({
        success: false,
        message: "Book with this ISBN already exists.",
      });
    }
    const book = await LibraryBook.create({
      ...req.body,
      createdBy: req.user?._id,
    });

    res.status(201).json({ success: true, data: book });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Book with this ISBN already exists.",
      });
    }
    res.status(500).json({ success: false, message: "Failed to create book" });
  }
};

export const updateBook = async (req, res) => {
  try {
    const book = await LibraryBook.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!book) {
      return res.status(404).json({ success: false, message: "Book not found" });
    }

    res.status(200).json({ success: true, data: book });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update book" });
  }
};

export const deleteBook = async (req, res) => {
  try {
    const book = await LibraryBook.findByIdAndDelete(req.params.id);

    if (!book) {
      return res.status(404).json({ success: false, message: "Book not found" });
    }

    res.status(200).json({ success: true, message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete book" });
  }
};
