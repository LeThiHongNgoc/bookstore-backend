const { ObjectId } = require("mongodb");

class Favorite {
  constructor(client) {
    this.Favorite = client.db().collection("favorite");
  }

  extractFavoritesData(payload) {
    const userfavorite = {
      userId: payload.userId,
      bookId: payload.bookId,
    };
  }

  async addFavorite(userId, bookId) {
    try {
      const existingFavorite = await this.Favorite.findOne({
        userId: userId,
      });

      if (existingFavorite) {
        const updatedFavorite = await this.Favorite.findOneAndUpdate(
          { userId: userId },
          { $addToSet: { bookId: bookId } },
          { returnDocument: "after" }
        );
        return updatedFavorite._id.toString();
      } else {
        const userFavoriteData = {
          userId: userId,
          bookId: [bookId],
        };
        const result = await this.Favorite.insertOne(userFavoriteData);
        return result.insertedId.toString();
      }
    } catch (error) {
      throw new Error("Failed to add favorite");
    }
  }

  async findAll(userId) {
    try {
      const userFavorite = await this.Favorite.findOne({ userId: userId });
      if (!userFavorite) {
        return [];
      }
      return userFavorite.bookId;
    } catch (error) {
      throw new Error("Failed to find user's favorites");
    }
  }

  async removeFavorite(userId, bookIdToRemove) {
    try {
      await this.Favorite.findOneAndUpdate(
        { userId: userId },
        { $pull: { bookId: bookIdToRemove } },
        { returnDocument: "after" }
      );
      return true;
    } catch (error) {
      throw new Error("Failed to remove favorite");
    }
  }
}

module.exports = Favorite;
