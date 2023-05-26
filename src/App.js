import React, { useState } from "react";
import Range from "./components/Range";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  const [sliderState, setSliderState] = useState({
    min: 0,
    max: 100,
    step: 1,
  });

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/exercise2"
          element={<Range min={0} max={100} step={1} />}
        />
        <Route
          path="/exercise1"
          element={<Range min={0} max={100} step={1} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
