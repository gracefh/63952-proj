import "./App.css";
import AppRouter from "./router";
import { AuthProvider } from "./AuthContext";
import { CartProvider } from "./CartContext";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <div className="App">
          <AppRouter />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
