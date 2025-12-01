import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import ScannerHallPage from './pages/ScannerHallPage';
import ScannerFoodPage from './pages/ScannerFoodPage';
import ScanResultPage from './pages/ScanResultPage';
import HallOccupancyPage from './pages/HallOccupancyPage';
import RegisteredStudentsPage from './pages/RegisteredStudentsPage';
import HallsListPage from './pages/HallsListPage';
import FoodClaimsPage from './pages/FoodClaimsPage';
import VolunteersListPage from './pages/VolunteersListPage';

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
        <Route path="/scan-result" element={<ScanResultPage />} />
        <Route path="/admin/hall-occupancy" element={<HallOccupancyPage />} />
        <Route path="/admin/students" element={<RegisteredStudentsPage />} />
        <Route path="/admin/halls" element={<HallsListPage />} />
        <Route path="/admin/food-claims" element={<FoodClaimsPage />} />
        <Route path="/admin/volunteers" element={<VolunteersListPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
