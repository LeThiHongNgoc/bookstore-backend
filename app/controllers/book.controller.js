const BookService = require("../services/book.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api_error");

// Cài đặt handler create
exports.create = async (req, res, next) => {
    if (!req.body?.name) {
        return next(new ApiError(400, "Name can not be empty"));
    }

    try {
        const bookService = new BookService(MongoDB.client);
        const document = await bookService.create(req.body);
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while creating the book")
        );
    }
};

// Cài đặt handler findAll:
exports.findAll = async (req, res, next) => {
    let documents = [];

    try {
        const bookService = new BookService(MongoDB.client);
        const { name } = req.query;
        if (name) {
            documents = await bookService.findByName(name);
        } else {
            documents = await bookService.find({});
        }
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while creating the book")
        );
    }
    return res.send(documents);
}

// Cài đặt handler findOne:
exports.findOne = async (req, res, next) => {
    try {
        const bookService = new BookService(MongoDB.client);
        const document = await bookService.findById(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Book not found"));
        }
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(
                500,
                `Error retrieving book with id=${req.params.id}`
            )
        );
    }
};

// Cài đặt handler update:
exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(new ApiError(400, "Data to update can not be empty"));
    }

    try {
        const bookService = new BookService(MongoDB.client);
        const document = await bookService.update(req.params.id, req.body);
        if (!document) {
            return next(new ApiError(404, "Book not found"));
        }
        return res.send({ message: "Book was updated successfully" });
    } catch (error) {
        return next(
            new ApiError(500, `Error update book with id=${req.params.id}`)
        );
    }
};

// Cài đặt handler delete:

exports.delete = async (req, res, next) => {
    try {
        const bookService = new BookService(MongoDB.client);
        const document = await bookService.delete(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Book not found"));
        }
        return res.send({ message: "Book was deleted successfully" });
    } catch (error) {
        return next(
            new ApiError(500, `Could not delete book with id=${req.params.id}`)
        );
    }
};

// Cài đặt handler findAllFavorite:

exports.findAllFavorite = async (req, res, next) => {
    try {
        const bookService = new BookService(MongoDB.client);
        const document = await bookService.findFavorite();
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while retrieving favorite books"));
    }
};

// Cài đặt handler deleteAll:

exports.deleteAll = async (_req, res, next) => {
    try {
        const bookService = new BookService(MongoDB.client);
        const deleteCount = await bookService.deleteAll();
        return res.send({ message: `${deleteCount} book was deleted successfully`, });
    } catch (error) {
        return next(new ApiError(500, "An error occurred while removing favorite books"));
    }
};