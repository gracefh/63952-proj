import { ObjectId } from "mongodb";

import { Router, getExpressRouter } from "./framework/router";

import { Art, Cart, TagList, User, WebSession } from "./app";
import { ArtDoc } from "./concepts/art";
import { UserDoc } from "./concepts/user";
import { WebSessionDoc } from "./concepts/websession";
import Responses from "./responses";

class Routes {
  @Router.get("/session")
  async getSessionUser(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    return await User.getUserById(user);
  }

  @Router.get("/users")
  async getUsers() {
    return await User.getUsers();
  }

  @Router.get("/users/:email")
  async getUser(email: string) {
    return await User.getUserByEmail(email);
  }

  @Router.post("/users")
  async createUser(session: WebSessionDoc, firstName: string, lastName: string, email: string, password: string, isArtist: boolean) {
    WebSession.isLoggedOut(session);
    const user = await User.create(firstName, lastName, email, password, isArtist);
    Cart.create(user.user!._id);
    return user;
  }

  @Router.patch("/users")
  async updateUser(session: WebSessionDoc, update: Partial<UserDoc>) {
    const user = WebSession.getUser(session);
    return await User.update(user, update);
  }

  @Router.delete("/users")
  async deleteUser(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    WebSession.end(session);
    return await User.delete(user);
  }

  @Router.post("/login")
  async logIn(session: WebSessionDoc, username: string, password: string) {
    const u = await User.authenticate(username, password);
    WebSession.start(session, u._id);
    return { msg: "Logged in!", isArtist: await User.isArtist(u._id) };
  }

  @Router.post("/logout")
  async logOut(session: WebSessionDoc) {
    WebSession.end(session);
    return { msg: "Logged out!" };
  }

  // ART

  @Router.get("/art")
  async getArtPieces(author?: string) {
    let artPieces;
    if (author) {
      const id = (await User.getUserByEmail(author))._id;
      artPieces = await Art.getByAuthor(id);
    } else {
      artPieces = await Art.getArtPieces({});
    }
    return Responses.artPieces(artPieces);
  }

  @Router.post("/art")
  async createArt(session: WebSessionDoc, title: string, link: string) {
    const user = WebSession.getUser(session);
    const created = await Art.create(user, title, link);
    await TagList.create(created.art!._id);
    return { msg: created.msg, post: await Responses.art(created.art) };
  }

  @Router.patch("/art/:_id")
  async updateArt(session: WebSessionDoc, _id: ObjectId, update: Partial<ArtDoc>) {
    const user = WebSession.getUser(session);
    await Art.isAuthor(user, _id);
    return await Art.update(_id, update);
  }

  @Router.delete("/art/:_id")
  async deleteArt(session: WebSessionDoc, _id: ObjectId) {
    const user = WebSession.getUser(session);
    await Art.isAuthor(user, _id);
    return Art.delete(_id);
  }

  // CART

  @Router.get("/cart")
  async getUserCart(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    return await Cart.getByAuthor(user);
  }

  @Router.patch("/cart/:art")
  async updateCart(session: WebSessionDoc, art: ObjectId) {
    const user = WebSession.getUser(session);
    return await Cart.addToCart(user, art);
  }

  @Router.patch("/cart/clear")
  async clearCart(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    const cart = await Cart.getByAuthor(user);
    return await Cart.update(cart._id, { contents: [] });
  }

  // TAG

  @Router.get("/tagList")
  async getTags(session: WebSessionDoc, art: ObjectId) {
    return await TagList.getByArtID(art);
  }

  @Router.patch("/tagList/add")
  async addTag(session: WebSessionDoc, art: ObjectId, tag: string) {
    return await TagList.addTagToArt(art, tag);
  }

  @Router.patch("/tagList/remove")
  async removeTag(session: WebSessionDoc, art: ObjectId, tag: string) {
    return await TagList.removeTagFromArt(art, tag);
  }

}

export default getExpressRouter(new Routes());
