import { useState, useEffect } from 'react';
import AuthContext from '../../context/AuthContext';
import { api } from '../../services/api';
import * as jwt_decode_module from "jwt-decode";

const jwt_decode = jwt_decode_module.default || jwt_decode_module;

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      if (token) {
        try {
          const decoded = jwt_decode(token);
          const tokenRoles = decoded.roles || [];
          setRoles(tokenRoles);
          // fetch full user info from API if endpoint exists
          try {
            const resp = await api.getUserInfo(token);
            if (resp.ok) {
              const data = await resp.json();
              // expected shape: { username, email, profileImg, businessOwned, orderPlace, role }
              setUser({
                username: data.username || decoded.sub,
                email: data.email,
                profileImg: data.profileImg,
                businessOwned: data.businessOwned || [],
                orderPlace: data.orderPlace || [],
                role: data.role || tokenRoles
              });
            } else {
              // fallback to token decoded info
              setUser({ username: decoded.sub });
            }
          } catch (err) {
            console.error('Error fetching user info:', err);
            setUser({ username: decoded.sub });
          }
        } catch (err) {
          console.error('Token decode error:', err);
          setToken(null);
          setUser(null);
          setRoles([]);
        }
      }

      setLoading(false);
    };

    init();
  }, [token]);

  const login = async (credentials) => {
  try {
    const response = await api.login(credentials);
    const tokenData = await response.text();

    if (tokenData !== 'Failure') {
      localStorage.setItem('token', tokenData);
      setToken(tokenData);

      const decoded = jwt_decode(tokenData); // works now
      console.log(decoded.roles);
      setRoles(decoded.roles || []);
      // attempt to fetch full user info
      try {
        const resp = await api.getUserInfo(tokenData);
        if (resp.ok) {
          const data = await resp.json();
          setUser({
            username: data.username || decoded.sub,
            email: data.email,
            profileImg: data.profileImg,
            businessOwned: data.businessOwned || [],
            orderPlace: data.orderPlace || [],
            role: data.role || decoded.roles || []
          });
        } else {
          setUser({ username: decoded.sub });
        }
      } catch (err) {
        console.error('Error fetching user info after login:', err);
        setUser({ username: decoded.sub });
      }
      return true;
    }
    return false;
  } catch (error) {
    console.error('Login error:', error);
    return false;
  }
};

  const register = async (userData) => {
    try {
      const resp = await api.register(userData);
      return resp.ok;
    } catch (err) {
      console.error('Register error:', err);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setRoles([]);
  };

  const hasRole = (role) => {
    // be forgiving: accept both 'ROLE_ADMIN' and 'ADMIN' checks
    if (!role) return false;
    if (roles.includes(role)) return true;
    if (roles.includes(`ROLE_${role}`)) return true;
    if (role.startsWith('ROLE_') && roles.includes(role.replace(/^ROLE_/, ''))) return true;
    return false;
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      roles,
      login,
      register,
      logout,
      hasRole,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
