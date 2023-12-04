import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { BadValuesError, NotAllowedError, NotFoundError } from "./errors";

export interface UserDoc extends BaseDoc {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isArtist: boolean;
  isVerified: boolean;
}

export default class UserConcept {
  public readonly users = new DocCollection<UserDoc>("users");

  async create(firstName: string, lastName: string, email: string, password: string, isArtist: boolean) {
    await this.canCreate(email, password);
    const _id = await this.users.createOne({ firstName, lastName, email, password, isArtist, isVerified: false });
    return { msg: "User created successfully!", user: await this.users.readOne({ _id }) };
  }

  private sanitizeUser(user: UserDoc) {
    // eslint-disable-next-line
    const { password, ...rest } = user; // remove password
    return rest;
  }

  async getUserById(_id: ObjectId) {
    const user = await this.users.readOne({ _id });
    if (user === null) {
      throw new NotFoundError(`User not found!`);
    }
    return this.sanitizeUser(user);
  }

  async getUserByEmail(email: string) {
    const user = await this.users.readOne({ email });
    if (user === null) {
      throw new NotFoundError(`User not found!`);
    }
    return this.sanitizeUser(user);
  }

  async idsToEmails(ids: ObjectId[]) {
    const users = await this.users.readMany({ _id: { $in: ids } });

    // Store strings in Map because ObjectId comparison by reference is wrong
    const idToUser = new Map(users.map((user) => [user._id.toString(), user]));
    return ids.map((id) => idToUser.get(id.toString())?.email ?? "DELETED_USER");
  }

  async idsToUserNames(ids: ObjectId[]) {
    const users = await this.users.readMany({ _id: { $in: ids } });

    // Store strings in Map because ObjectId comparison by reference is wrong
    const idToUser = new Map(users.map((user) => [user._id.toString(), user]));
    return ids.map((id) => idToUser.get(id.toString())?.firstName + " " ?? "DELETED_USER" + idToUser.get(id.toString())?.lastName ?? "");
  }

  async getUsers(email?: string) {
    // If username is undefined, return all users by applying empty filter
    const filter = email ? { email } : {};
    const users = (await this.users.readMany(filter)).map(this.sanitizeUser);
    return users;
  }

  async authenticate(email: string, password: string) {
    const user = await this.users.readOne({ email, password });
    if (!user) {
      throw new NotAllowedError("Username or password is incorrect.");
    }
    return { msg: "Successfully authenticated.", _id: user._id };
  }

  async update(_id: ObjectId, update: Partial<UserDoc>) {
    if (update.email !== undefined) {
      await this.isEmailUnique(update.email);
    }
    await this.users.updateOne({ _id }, update);
    return { msg: "User updated successfully!" };
  }

  async delete(_id: ObjectId) {
    await this.users.deleteOne({ _id });
    return { msg: "User deleted!" };
  }

  async userExists(_id: ObjectId) {
    const maybeUser = await this.users.readOne({ _id });
    if (maybeUser === null) {
      throw new NotFoundError(`User not found!`);
    }
  }

  async isArtist(_id: ObjectId) {
    const maybeUser = await this.users.readOne({ _id });
    if (maybeUser === null) {
      throw new NotFoundError(`User not found!`);
    }
    return maybeUser.isArtist === true;
  }

  private async canCreate(email: string, password: string) {
    if (!email || !password) {
      throw new BadValuesError("Username and password must be non-empty!");
    }
    await this.isEmailUnique(email);
  }

  private async isEmailUnique(email: string) {
    if (await this.users.readOne({ email })) {
      throw new NotAllowedError(`User with email ${email} already exists!`);
    }
  }
}
