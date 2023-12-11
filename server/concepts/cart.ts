import { Filter, ObjectId } from "mongodb";

import DocCollection, { BaseDoc } from "../framework/doc";
import { NotAllowedError, NotFoundError } from "./errors";

export interface CartDoc extends BaseDoc {
  author: ObjectId;
  contents: ObjectId[];
}

export default class CartConcept {
  public readonly carts = new DocCollection<CartDoc>("carts");

  async create(author: ObjectId) {
    await this.isAuthorUnique(author);
    const _id = await this.carts.createOne({ author, contents: [] });
    return { msg: "Cart successfully created!", cart: await this.carts.readOne({ _id }) };
  }

  async getCarts(query: Filter<CartDoc>) {
    const carts = await this.carts.readMany(query, {
      sort: { dateUpdated: -1 },
    });
    return carts;
  }

  async getByAuthor(author: ObjectId) {
    const cart = await this.carts.readOne({ author });
    if (!cart) {
      const _id = await this.carts.createOne({author, contents: []});
      const createdCart = await this.carts.readOne({ _id });
      if(!createdCart) {
        throw new NotAllowedError("Could not create cart");
      }
      return createdCart
    }
    return cart;
  }

  async update(_id: ObjectId, update: Partial<CartDoc>) {
    this.sanitizeUpdate(update);
    await this.carts.updateOne({ _id }, update);
    return { msg: "Cart successfully updated!" };
  }

  async addToCart(author: ObjectId, art: ObjectId) {
    const cart = await this.getByAuthor(author);
    if (cart.contents.includes(art)) {
      return { msg: "Art has already been added to cart!" };
    }
    cart.contents.push(art);
    return { msg: "Art successfully added to cart!" };
  }

  async delete(_id: ObjectId) {
    await this.carts.deleteOne({ _id });
    return { msg: "Cart deleted successfully!" };
  }

  async deleteItemFromCart(author: ObjectId, art: ObjectId) {
    const cart = await this.getByAuthor(author);
    if (cart.contents.includes(art)) {
      cart.contents = cart.contents.filter((item) => item !== art);
      return { msg: "Item deleted successfully!" }
    }
    return { msg: "Item not in cart" };
  }

  async isAuthor(user: ObjectId, _id: ObjectId) {
    const cart = await this.carts.readOne({ _id });
    if (!cart) {
      throw new NotFoundError(`Cart ${_id} does not exist!`);
    }
    if (cart.author.toString() !== user.toString()) {
      throw new CartAuthorNotMatchError(user, _id);
    }
  }

  private sanitizeUpdate(update: Partial<CartDoc>) {
    // Make sure the update cannot change the author.
    const allowedUpdates = ["author", "contents"];
    for (const key in update) {
      if (!allowedUpdates.includes(key)) {
        throw new NotAllowedError(`Cannot update '${key}' field!`);
      }
    }
  }

  private async isAuthorUnique(author: ObjectId) {
    if (await this.carts.readOne({ author })) {
      throw new NotAllowedError(`Cart with author ${author} already exists!`);
    }
  }
}

export class CartAuthorNotMatchError extends NotAllowedError {
  constructor(
    public readonly author: ObjectId,
    public readonly _id: ObjectId,
  ) {
    super("{0} is not the author of cart {1}!", author, _id);
  }
}
