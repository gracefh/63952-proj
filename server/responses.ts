import { User } from "./app";
import { ArtAuthorNotMatchError, ArtDoc } from "./concepts/art";
import { Router } from "./framework/router";

/**
 * This class does useful conversions for the frontend.
 * For example, it converts a {@link PostDoc} into a more readable format for the frontend.
 */
export default class Responses {
  /**
   * Convert PostDoc into more readable format for the frontend by converting the author id into a username.
   */
  static async art(art: ArtDoc | null) {
    if (!art) {
      return art;
    }
    const author = await User.getUserById(art.author);
    return { ...art, author: author.email };
  }

  /**
   * Same as {@link post} but for an array of PostDoc for improved performance.
   */
  static async artPieces(artPieces: ArtDoc[]) {
    const authors = await User.idsToUserNames(artPieces.map((art) => art.author));
    return artPieces.map((art, i) => ({ ...art, author: authors[i] }));
  }
}

Router.registerError(ArtAuthorNotMatchError, async (e) => {
  const username = (await User.getUserById(e.author)).email;
  return e.formatWith(username, e._id);
});