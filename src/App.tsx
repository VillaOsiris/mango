import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Range from "@/components/Range";
import useFetch from "@/utils/useFetch";

//Mock API
const APIEndpoint: string = "http://demo8880427.mockable.io/mockrange";

type RangeProps =
  | {
      min: number;
      max: number;
      values?: never;
    }
  | {
      min?: never;
      max?: never;
      values: number[];
    };

function App() {
  const { data, error, loading } = useFetch(APIEndpoint);

  const dataIsValid = (data: RangeProps) => {
    typeof data === "object" &&
      ((data.hasOwnProperty(`min`) && data.hasOwnProperty(`max`)) ||
        data.hasOwnProperty("rangeValues"));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!dataIsValid) {
    return <div>Error: Invalid data format</div>;
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
