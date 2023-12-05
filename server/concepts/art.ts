import { Filter, ObjectId } from "mongodb";

import DocCollection, { BaseDoc } from "../framework/doc";
import { NotAllowedError, NotFoundError } from "./errors";

export interface ArtDoc extends BaseDoc {
  author: ObjectId;
  title: string;
  link: string;
  price: number;
  tags: string[];
}

export default class ArtConcept {
  public readonly artPieces = new DocCollection<ArtDoc>("artPieces");

  async create(author: ObjectId, title: string, link: string) {
    const _id = await this.artPieces.createOne({ author, title, link, price: 0, tags: [] });
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
    const art = await this.getArtById(_id);
    if (art.author.toString() !== user.toString()) {
      throw new ArtAuthorNotMatchError(user, _id);
    }
  }

  private sanitizeUpdate(update: Partial<ArtDoc>) {
    // Make sure the update cannot change the author.
    const allowedUpdates = ["title", "link", "price", "tags"];
    for (const key in update) {
      if (!allowedUpdates.includes(key)) {
        throw new NotAllowedError(`Cannot update '${key}' field!`);
      }
    }
  }

  async getArtById(_id: ObjectId) {
    const art = await this.artPieces.readOne({ _id });
    if (!art) {
      throw new NotFoundError(`Art ${_id} does not exist!`);
    }
    return art;
  }


  async getTags(_id: ObjectId) {
    const art = this.getArtById(_id);
    return art;
  }

  async addTag(_id: ObjectId, tag: string) {
    const art = await this.getArtById(_id);
    if (!art.tags.includes(tag)) {
      art.tags.push(tag);
    }
    return { msg: "Tag successfully added to art!" };
  }

  async removeTag(_id: ObjectId, tag: string) {
    const art = await this.getArtById(_id);
    const updatedTags = art.tags.filter((elt, i) => elt !== tag);
    this.update(_id, { tags: updatedTags });
    return { msg: "Tag successfully removed from art!" };
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
