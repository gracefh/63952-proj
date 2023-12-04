import FriendConcept from "./concepts/friend";
import ArtConcept from "./concepts/art";
import UserConcept from "./concepts/user";
import WebSessionConcept from "./concepts/websession";

// App Definition using concepts
export const WebSession = new WebSessionConcept();
export const User = new UserConcept();
export const Art = new ArtConcept();
export const Friend = new FriendConcept();
