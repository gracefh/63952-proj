import "./App.css";
import SignInPage from "./pages/sign-in";
import SignUpPage from "./pages/sign-up";
import ArtUploadPage from "./pages/art-upload";
import ArtistListViewPage from "./pages/artist-list-view";
import SelectionPage from "./pages/selection-page";

function App() {
  return (
    // Routes for backend have not been set up yet, so for now just uncomment the component you want to see
    // (at least I think this is how it works)
  <>
    <SignInPage />
    <SignUpPage />
    <SelectionPage />
  </>

  // <ArtUploadPage />
  // <ArtistListViewPage artistName={"Catherine"} /> 
    
  );
}

export default App;
