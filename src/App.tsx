import LoginPage from "./pages/Auth/Login/Login";
import DashboardPage from "./pages/Dashboard/Dashboard";
import Customer from "./pages/Dashboard/Customer";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthRedirect from "./components/AuthRedirect";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route 
        path="/" 
        element={
          <AuthRedirect>
            <LoginPage />
          </AuthRedirect>
        } 
      />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <DashboardPage/>
          </ProtectedRoute>
        }
      />
      <Route 
        path="/customers" 
        element={
          <ProtectedRoute>
            <Customer/>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
