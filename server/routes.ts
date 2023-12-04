import { ObjectId } from "mongodb";

import { Router, getExpressRouter } from "./framework/router";

import { Art, User, WebSession } from "./app";
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

  @Router.get("/users/:username")
  async getUser(username: string) {
    return await User.getUserByEmail(username);
  }

  @Router.post("/users")
  async createUser(session: WebSessionDoc, firstName: string, lastName: string, email: string, password: string, isArtist: boolean) {
    WebSession.isLoggedOut(session);
    return await User.create(firstName, lastName, email, password, isArtist);
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
    return { msg: "Logged in!" };
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
    return { msg: created.msg, post: await Responses.art(created.art) };
  }

  @Router.patch("/art/:_id")
  async updatePost(session: WebSessionDoc, _id: ObjectId, update: Partial<ArtDoc>) {
    const user = WebSession.getUser(session);
    await Art.isAuthor(user, _id);
    return await Art.update(_id, update);
  }

  @Router.delete("/posts/:_id")
  async deletePost(session: WebSessionDoc, _id: ObjectId) {
    const user = WebSession.getUser(session);
    await Art.isAuthor(user, _id);
    return Art.delete(_id);
  }
}

export default getExpressRouter(new Routes());
