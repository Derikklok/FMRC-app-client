import LoginPage from "./pages/Auth/Login/Login";
import DashboardPage from "./pages/Dashboard/Dashboard";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/dashboard" element={<DashboardPage/>}/>
    </Routes>
  );
}

export default App;
