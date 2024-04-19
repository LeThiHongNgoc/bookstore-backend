const PublishService = require("./../services/publish.service");
const MongoBD = require("../utils/mongodb.util");
const ApiError = require("../api_error");

exports.create = async (req, res, next) => {
  try {
    const publishService = new PublishService(MongoBD.client);
    const document = await publishService.create(req.body);
    return res.send(document);
  } catch (error) {
    return next(
      new ApiError(500, "An error occurred while creating the Publish")
    );
  }
};

exports.findAll = async (req, res, next) => {
  let documents = [];

  try {
    const publishService = new PublishService(MongoBD.client);
    documents = await publishService.find({});
  } catch (error) {
    return next(
      new ApiError(500, "An errer occured while retrieving Publishs")
    );
  }
  return res.send(documents);
};
exports.findById = async (req, res, next) => {
  try {
    const publishService = new PublishService(MongoBD.client);
    const document = await publishService.findById(req.params.id);
    if (!document) {
      return next(new ApiError(400, "Publish not found"));
    }
    return res.send(document);
  } catch (error) {
    return next(
      new ApiError(500, `Error retrieving Publish with id=${req.params.id}`)
    );
  }
};

exports.update = async (req, res, next) => {
  try {
    const publishService = new PublishService(MongoBD.client);
    const document = await publishService.update(req.params.id, req.body);
    if (!document) {
      return next(new ApiError(404, "Publish not found"));
    }
    return res.send({ message: "Publish was update successfully" });
  } catch (error) {
    return next(
      new ApiError(500, `Error updating Publish with id=${req.params.id}`)
    );
  }
};

exports.delete = async (req, res, next) => {
  try {
    const publishService = new PublishService(MongoBD.client);
    const document = await publishService.delete(req.params.id);
    if (!document) {
      return next(new (404, "Publish not found")());
    }
    return res.send({ message: "Publish was deleted successfully" });
  } catch (error) {
    return next(
      new ApiError(500, `Could not delete Publish with id=${req.params.id}`)
    );
  }
};

// Cài đặt handler deleteAll:

exports.deleteAll = async (_req, res, next) => {
  try {
      const publishService = new PublishService(MongoBD.client);
      const deleteCount = await publishService.deleteAll();
      return res.send({ message: `${deleteCount} publish was deleted successfully`, });
  } catch (error) {
      return next(new ApiError(500, "An error occurred while removing"));
  }
};