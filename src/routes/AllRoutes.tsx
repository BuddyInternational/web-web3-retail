import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import Home from "../pages/Home";
import NotFound from "../utils/NotFound";

const AllRoutes = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* Add 404 page */}
          {/* <Route path="*" element={<PageNotFound />} /> */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
};

export default AllRoutes;
