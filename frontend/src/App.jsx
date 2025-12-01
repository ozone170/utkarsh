import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import ScannerHallPage from './pages/ScannerHallPage';
import ScannerFoodPage from './pages/ScannerFoodPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/scanner/hall" element={<ScannerHallPage />} />
        <Route path="/scanner/food" element={<ScannerFoodPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
