const { ObjectId } = require("mongodb");

class Borrowed {
  constructor(client) {
    this.Borrowed = client.db().collection("borrowedBooks");
  }

  extractBorrowedData(payload) {
    const borrowBooks = {
      userId: payload.userId,
      name: payload.name,
      ngayMuon: payload.ngayMuon,
      ngayTra: payload.ngayTra,
      books: payload.books,
      status: payload.status,
    };

    Object.keys(borrowBooks).forEach(
      (key) => borrowBooks[key] === undefined && delete borrowBooks[key]
    );

    return borrowBooks;
  }

  async create(payload) {
    const borrowBooks = this.extractBorrowedData(payload);
    borrowBooks.status = "Đang đợi duyệt";
    const newOrder = await this.Borrowed.insertOne(borrowBooks);
    return newOrder.value;
  }

  async findById(id) {
    return await this.Borrowed.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
  }

  async find(filter) {
    const cursor = await this.Borrowed.find(filter);
    return await cursor.toArray();
  }

  async update(id, payload) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    };
    const update = this.extractBorrowedData(payload);
    const result = await this.Borrowed.findOneAndUpdate(
      filter,
      { $set: update },
      { returnDocument: "after" }
    );
    return result;
  }
}
module.exports = Borrowed;
