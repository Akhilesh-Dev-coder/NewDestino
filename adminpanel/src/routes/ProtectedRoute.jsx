import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';

const ProtectedRoute = ({ children }) => {
  const { token } = useAdminAuth();
  return token ? children : <Navigate to="/admin/login" />;
};

export default ProtectedRoute;
