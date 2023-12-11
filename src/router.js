import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import SignInPage from "./pages/sign-in";
import SignUpPage from "./pages/sign-up";
import ArtUploadPage from "./pages/art-upload";
import ArtistListViewPage from "./pages/artist-list-view";
import SelectionPage from "./pages/selection-page";
import ShoppingCartPage from "./pages/shopping-cart";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignInPage />} />
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/upload" element={<ArtUploadPage />} />
        <Route
          path="/your-art"
          element={<ArtistListViewPage artistName="Catherine" />}
        />
        <Route path="/select-art" element={<SelectionPage />} />
        <Route path="/cart" element={<ShoppingCartPage />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
