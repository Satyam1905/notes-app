import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const userInfo = localStorage.getItem("userInfo");

    if(!userInfo) {
        return <Navigate to="/signin" replace/>
    }

    return children;
};

export default ProtectedRoute;