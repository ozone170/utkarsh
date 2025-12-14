import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
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
import ProfilePage from './pages/ProfilePage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import ActivityPage from './pages/ActivityPage';


function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/scanner" element={<ScannerHallPage />} />
          <Route path="/scanner/hall" element={<ScannerHallPage />} />
          <Route path="/scanner/food" element={<ScannerFoodPage />} />
          <Route path="/scan-result" element={<ScanResultPage />} />
          <Route path="/admin/hall-occupancy" element={<HallOccupancyPage />} />
          <Route path="/admin/students" element={<RegisteredStudentsPage />} />
          <Route path="/admin/halls" element={<HallsListPage />} />
          <Route path="/admin/food-claims" element={<FoodClaimsPage />} />
          <Route path="/admin/volunteers" element={<VolunteersListPage />} />
          
          {/* Volunteer Routes */}
          <Route path="/volunteer/students" element={<RegisteredStudentsPage />} />

          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/change-password" element={<ChangePasswordPage />} />
          <Route path="/admin/activity/:userId" element={<ActivityPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
