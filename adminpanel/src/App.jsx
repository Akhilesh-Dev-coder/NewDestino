import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AdminAuthProvider } from './context/AdminAuthContext';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import ProtectedRoute from './routes/ProtectedRoute';
import Activities from './components/Activities';
import Trips from './components/Trips';
import Users from './components/Users';
import AdminLayout from './components/AdminLayout';

function App() {
  return (
    <AdminAuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/admin/login" />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <Users />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/trips"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <Trips />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/activities"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <Activities />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AdminAuthProvider>
  );
}

export default App;