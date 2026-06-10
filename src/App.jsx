import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Loginpage from "./pages/Loginpage";
import Dashboard from "./pages/Dashboard";
import Readblog from "./pages/Readblog";
import ReadblogDetail from "./pages/ReadblogDetail";
import CreateBlog from "./pages/CreateBlog";
import { LoadingProvider } from "./context/LoadingContext";

function App() {
  return (
    <BrowserRouter>
      <LoadingProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Loginpage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/readblog" element={<Readblog />} />
          <Route path="/readblog/:id" element={<ReadblogDetail />} />
          <Route path="/editor" element={<CreateBlog />} />
          <Route path="/editor/:id" element={<CreateBlog />} />
          <Route path="/createblog" element={<Navigate to="/editor" replace />} />
          <Route path="/editblog/:id" element={<CreateBlog />} />
        </Routes>
      </LoadingProvider>
    </BrowserRouter>
  );
}

export default App;


