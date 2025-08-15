import { useAuth } from '../contexts/AuthContext';
import AuthWrapper from './auth/AuthWrapper';

export default function ProtectedRoute({ children }) {
  const { currentUser } = useAuth();
  
  return currentUser ? children : <AuthWrapper />;
}
