import { useState } from "react";
import SiteLayout from "./layouts/SiteLayout";
import Home from "./pages/Home";
import Calculator from "./pages/Calculator";

type View = "home" | "calculator";

function App() {
  const [view, setView] = useState<View>("home");

  return (
    <SiteLayout>
      {view === "home" ? (
        <Home onStartCalculator={() => setView("calculator")} />
      ) : (
        <Calculator />
      )}
    </SiteLayout>
  );
}

export default App;
