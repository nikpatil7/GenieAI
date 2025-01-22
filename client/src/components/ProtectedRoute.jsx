import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

// Define type for props
const ProtectedRoute = (props) => {
  const isAuth = localStorage.getItem('authToken');
  
  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }
  return props.children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired
};

export default ProtectedRoute; 