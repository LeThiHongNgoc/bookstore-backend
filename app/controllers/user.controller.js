const UserService = require("../services/user.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api_error");

// Cài đặt handler create
exports.create = async (req, res, next) => {
  if (!req.body?.name || !req.body?.email || !req.body?.password) {
    return next(new ApiError(400, "Can not be empty"));
  }

  try {
    const userService = new UserService(MongoDB.client);
    const document = await userService.create(req.body);
    return res.send(document);
  } catch (error) {
    return next(new ApiError(500, "An error occurred while creating the user"));
  }
};

// Cài đặt handler findByEmailPassword:
exports.findByEmailPassword = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const userService = new UserService(MongoDB.client);
    const document = await userService.findByEmailPassword(email, password);
    if (!document) {
      return next(new ApiError(404, "Incorrect email or password"));
    }
    return res.send(document);
  } catch (error) {
    return next(new ApiError(500, `Error login user)`));
  }
};

// Cài đặt handler findAll:
exports.findAll = async (req, res, next) => {
  let documents = [];

  try {
    const userService = new UserService(MongoDB.client);
    const { name } = req.query;
    if (name) {
      documents = await userService.findByName(name);
    } else {
      documents = await userService.find({});
    }
  } catch (error) {
    return next(new ApiError(500, "An error occurred while creating the user"));
  }
  return res.send(documents);
};

// Cài đặt handler findOne:
exports.findOne = async (req, res, next) => {
  try {
    const userService = new UserService(MongoDB.client);
    const document = await userService.findById(req.params.id);
    if (!document) {
      return next(new ApiError(404, "User not found"));
    }
    return res.send(document);
  } catch (error) {
    return next(
      new ApiError(500, `Error retrieving user with id=${req.params.id}`)
    );
  }
};

// Cài đặt handler update:
exports.update = async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new ApiError(400, "Data to update can not be empty"));
  }

  try {
    const userService = new UserService(MongoDB.client);
    const document = await userService.update(req.params.id, req.body);
    if (!document) {
      return next(new ApiError(404, "User not found"));
    }
    return res.send({ message: "User was updated successfully" });
  } catch (error) {
    return next(
      new ApiError(500, `Error update user with id=${req.params.id}`)
    );
  }
};

// Cài đặt handler delete:

exports.delete = async (req, res, next) => {
  try {
    const userService = new UserService(MongoDB.client);
    const document = await userService.delete(req.params.id);
    if (!document) {
      return next(new ApiError(404, "User not found"));
    }
    return res.send({ message: "User was deleted successfully" });
  } catch (error) {
    return next(
      new ApiError(500, `Could not delete user with id=${req.params.id}`)
    );
  }
};

exports.deleteAll = async (_req, res, next) => {
  try {
    const userService = new UserService(MongoDB.client);
    const deleteCount = await userService.deleteAll();
    return res.send({
      message: `${deleteCount} user was deleted successfully`,
    });
  } catch (error) {
    return next(new ApiError(500, "An error occurred while removing"));
  }
};
