const { ObjectId } = require("mongodb");

class UserService {
  constructor(client) {
    this.User = client.db().collection("users");
  }
  // Định nghĩa các phương thức truy xuất CSDL sử dụng mongodb API
  extractUserData(payload) {
    const user = {
      name: payload.name,
      gender: payload.gender,
      email: payload.email,
      phone: payload.phone,
      address: payload.address,
      password: payload.password,
      isAdmin: payload.isAdmin,
    };
    // Remove undefined fields
    Object.keys(user).forEach(
      (key) => user[key] === undefined && delete user[key]
    );
    return user;
  }
  async create(payload) {
    const user = this.extractUserData(payload);

    if (payload.isAdmin === undefined) {
      user.isAdmin = false;
    }
    const result = await this.User.findOneAndUpdate(
      user,
      { $set: { isAdmin: user.isAdmin } },
      { returnDocument: "after", upsert: true }
    );
    return result.value;
  }

  async find(filter) {
    const cursor = await this.User.find(filter);
    return await cursor.toArray();
  }

  async findByName(name) {
    return await this.find({
      name: { $regex: new RegExp(name), $options: "i" },
    });
  }

  async findById(id) {
    return await this.User.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
  }

  async findByEmailPassword(email, password) {
    return await this.User.findOne({ email, password });
  }

  async update(id, payload) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    };
    const update = this.extractUserData(payload);
    const result = await this.User.findOneAndUpdate(
      filter,
      { $set: update },
      { returnDocument: "after" }
    );
    return result;
  }

  async delete(id) {
    const result = await this.User.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return result;
  }

  async deleteAll() {
    const result = await this.User.deleteMany({});
    return result.deletedCount;
  }
}

module.exports = UserService;
