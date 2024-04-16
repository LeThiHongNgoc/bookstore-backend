const { ObjectId } = require("mongodb");

class PublishService {
  constructor(client) {
    this.Publish = client.db().collection("publisher");
  }

  extractPublishData(payload) {
    const publish = {
      name: payload.name,
      address: payload.address,
    };

    Object.keys(publish).forEach(
      (key) => publish[key] === undefined && delete publish[key]
    );

    return publish;
  }

  async create(payload) {
    const publish = this.extractPublishData(payload);
    const result = await this.Publish.insertOne(publish);
    return result.insertedId.toString();
  }

  async find(filter) {
    const cursor = await this.Publish.find(filter);
    return await cursor.toArray();
  }

  async findById(id) {
    return await this.Publish.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
  }

  async update(id, payload) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    };
    const update = this.extractPublishData(payload);
    const result = await this.Publish.findOneAndUpdate(
      filter,
      { $set: update },
      { returnDocument: "after" }
    );
    return result;
  }

  async delete(id) {
    const result = await this.Publish.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return result;
  }
  async deleteAll() {
    const result = await this.Publish.deleteMany({});
    return result.deletedCount;
  }
}

module.exports = PublishService;
