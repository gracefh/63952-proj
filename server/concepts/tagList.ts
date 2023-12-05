import { Filter, ObjectId } from "mongodb";

import DocCollection, { BaseDoc } from "../framework/doc";
import { NotAllowedError, NotFoundError } from "./errors";

export interface TagListDoc extends BaseDoc {
  art: ObjectId;
  tags: string[];
}

export default class TagListConcept {
  public readonly tagLists = new DocCollection<TagListDoc>("tagLists");

  async create(art: ObjectId) {
    await this.isArtUnique(art);
    const _id = await this.tagLists.createOne({ art, tags: [] });
    return { msg: "Tag list for art successfully created!", tagList: await this.tagLists.readOne({ _id }) };
  }

  async getTagLists(query: Filter<TagListDoc>) {
    const tagLists = await this.tagLists.readMany(query, {
      sort: { dateUpdated: -1 },
    });
    return tagLists;
  }

  async getByArtID(art: ObjectId) {
    const tagList = await this.tagLists.readOne({ art });
    if (!tagList) {
      throw new NotFoundError(`Tag list for art ${art} does not exist!`);
    }
    return tagList;
  }

  async update(_id: ObjectId, update: Partial<TagListDoc>) {
    this.sanitizeUpdate(update);
    await this.tagLists.updateOne({ _id }, update);
    return { msg: "Tag list successfully updated!" };
  }

  async addTagToArt(art: ObjectId, tag: string) {
    const tagList = await this.getByArtID(art);
    if (!tagList.tags.includes(tag)) {
      tagList.tags.push(tag);
    }
    return { msg: "Tag successfully added to art!" };
  }

  async removeTagFromArt(art: ObjectId, tag: string) {
    const tagList = await this.getByArtID(art);
    const newTags = tagList.tags.filter((elt, i) => elt !== tag)
    this.update(tagList._id, { tags: newTags })
    return { msg: "Tag successfully removed from art!" };
  }

  async delete(_id: ObjectId) {
    await this.tagLists.deleteOne({ _id });
    return { msg: "Tag list deleted successfully!" };
  }

  async isArtForThisTagList(art: ObjectId, _id: ObjectId) {
    const tagList = await this.tagLists.readOne({ _id });
    if (!tagList) {
      throw new NotFoundError(`Tag list ${_id} does not exist!`);
    }
    if (tagList.art.toString() !== art.toString()) {
      throw new tagListArtNotMatchError(art, _id);
    }
  }

  private sanitizeUpdate(update: Partial<TagListDoc>) {
    // Make sure the update cannot change the author.
    const allowedUpdates = ["tags"];
    for (const key in update) {
      if (!allowedUpdates.includes(key)) {
        throw new NotAllowedError(`Cannot update '${key}' field!`);
      }
    }
  }

  private async isArtUnique(art: ObjectId) {
    if (await this.tagLists.readOne({ art })) {
      throw new NotAllowedError(`Tag list for art ${art} already exists!`);
    }
  }
}

export class tagListArtNotMatchError extends NotAllowedError {
  constructor(
    public readonly art: ObjectId,
    public readonly _id: ObjectId,
  ) {
    super("Art {0} does not have tag list {1}!", art, _id);
  }
}
