import { Home } from "./pages/Home";
import { Navbar } from "./components/Navbar";

function App() {
  return (
    <>
      <Navbar />
      <div className="w-[90%] mx-auto">
        <Home />
      </div>
    </>
  );
}

export default App;
