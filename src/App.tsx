import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Range from "@/components/Range";
import useFetch from "@/utils/useFetch";
import { isDataValid } from "@/utils/helperFunctions";
import { APIEndpoint } from "./constants/urls";

function App() {
  const { data, error, loading } = useFetch(APIEndpoint, isDataValid);

  if (loading) {
    return (
      <div className="centered">
        <div className="spinner"></div>
        <div>Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="centered">
        <div>Oops! Something went wrong.</div>
        <br />
        <div className="error">Error: {error.message}</div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div style={{ position: "absolute" }}>
        <Link to="/exercise1" reloadDocument>
          Exercise 1
        </Link>
        <br />
        <Link to="/exercise2" reloadDocument>
          Exercise 2
        </Link>
      </div>
      <Routes>
        {data && (
          <>
            <Route
              path="/exercise1"
              element={<Range min={data.min} max={data.max} />}
            />
            <Route
              path="/exercise2"
              element={<Range values={data.rangeValues} />}
            />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
