import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Range from "@/components/Range";
import useFetch from "@/utils/useFetch";

//Mock API
const APIEndpoint: string = "http://demo8880427.mockable.io/mockrange";

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