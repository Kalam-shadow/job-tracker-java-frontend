import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./auth/Login";
import JobList from "./jobs/JobList";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element = {<Login />} />
        <Route
          path="/jobs"
          element={
            <ProtectedRoute>
              <JobList />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}