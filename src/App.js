import React, { Component } from "react";
import Range from "./components/Range";
import { BrowserRouter, Routes, Route } from "react-router-dom";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Routes>
          <Route
            path="/exercise1"
            element={<Range min="0" max="100" step="1" value="0" onChange />}
          />
          <Route path="/exercise2" element={<Range />} />
        </Routes>
      </BrowserRouter>
    );
  }
}

export default App;
