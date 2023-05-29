import React from "react";
import Range from "./components/Range";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import useFetch from "./utils/useFetch.jsx";

//Mock API
const APIEndpoint = "http://demo6492050.mockable.io/mockrange";

function App() {
  const { data, error, loading } = useFetch(APIEndpoint);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        {data && (
          <>
            <Route
              path="/exercise1"
              element={<Range min={data.min} max={data.max} step={1} />}
            />
            <Route
              path="/exercise2"
              element={<Range min={data.min} max={data.max} step={1} />}
            />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
