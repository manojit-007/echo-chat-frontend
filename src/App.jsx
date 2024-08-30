/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Authentication from "./pages/auth/Authentication";
import Profile from "./pages/profile/Profile";
import Chat from "./pages/chat/Chat";
import { useStore } from "./store/store";
import { useEffect, useState } from "react";
import { apiClient } from "./lib/apiClient";
import { GET_USER_INFO } from "./utills/const";

const PrivateRoute = ({ children }) => {
  const { userInfo,token } = useStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? children : <Navigate to="/auth" />;
};

const AuthRoute = ({ children }) => {
  const { userInfo,token } = useStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? <Navigate to="/chat" /> : children;
};

function App() {
  const { userInfo, setUserInfo, token } = useStore(); // Ensure token is also available
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await apiClient.get(GET_USER_INFO, {
          withCredentials: true,
          // headers: { Authorization: `Bearer ${token}` }, // Ensure token is included
        });
        setUserInfo(response.data.user); // Update the userInfo state with fetched data
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false); // Set loading to false after the fetch is complete
      }
    };

    if (!userInfo) {
      getUserData();
    } else {
      setLoading(false);
    }
  }, [userInfo, setUserInfo, token]); // Include token in dependency array

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthRoute><Authentication /></AuthRoute>} />
        <Route path="/home" element={<AuthRoute><Authentication /></AuthRoute>} />
        <Route path="/auth" element={<AuthRoute><Authentication /></AuthRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/chat" element={<PrivateRoute><Chat /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
