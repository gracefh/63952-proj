import ArtConcept from "./concepts/art";
import CartConcept from "./concepts/cart";
import UserConcept from "./concepts/user";
import WebSessionConcept from "./concepts/websession";

// App Definition using concepts
export const WebSession = new WebSessionConcept();
export const User = new UserConcept();
export const Art = new ArtConcept();
export const Cart = new CartConcept();
