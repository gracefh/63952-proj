import { Filter, ObjectId } from "mongodb";

import DocCollection, { BaseDoc } from "../framework/doc";
import { NotAllowedError, NotFoundError } from "./errors";

export interface ArtDoc extends BaseDoc {
  author: ObjectId;
  title: string;
  link: string;
  price: number;
}

export default class ArtConcept {
  public readonly artPieces = new DocCollection<ArtDoc>("artPieces");

  async create(author: ObjectId, title: string, link: string) {
    const _id = await this.artPieces.createOne({ author, title, link, price: 0 });
    return { msg: "Art successfully created!", art: await this.artPieces.readOne({ _id }) };
  }

  async getArtPieces(query: Filter<ArtDoc>) {
    const artPieces = await this.artPieces.readMany(query, {
      sort: { dateUpdated: -1 },
    });
    return artPieces;
  }

  async getByAuthor(author: ObjectId) {
    return await this.getArtPieces({ author });
  }

  async update(_id: ObjectId, update: Partial<ArtDoc>) {
    this.sanitizeUpdate(update);
    await this.artPieces.updateOne({ _id }, update);
    return { msg: "Art successfully updated!" };
  }

  async delete(_id: ObjectId) {
    await this.artPieces.deleteOne({ _id });
    return { msg: "Art deleted successfully!" };
  }

  async isAuthor(user: ObjectId, _id: ObjectId) {
    const art = await this.artPieces.readOne({ _id });
    if (!art) {
      throw new NotFoundError(`Art ${_id} does not exist!`);
    }
    if (art.author.toString() !== user.toString()) {
      throw new ArtAuthorNotMatchError(user, _id);
    }
  }

  private sanitizeUpdate(update: Partial<ArtDoc>) {
    // Make sure the update cannot change the author.
    const allowedUpdates = ["author", "title", "link"];
    for (const key in update) {
      if (!allowedUpdates.includes(key)) {
        throw new NotAllowedError(`Cannot update '${key}' field!`);
      }
    }
  }
}

export class ArtAuthorNotMatchError extends NotAllowedError {
  constructor(
    public readonly author: ObjectId,
    public readonly _id: ObjectId,
  ) {
    super("{0} is not the author of art {1}!", author, _id);
  }
}
