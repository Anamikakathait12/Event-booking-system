import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import api from '../lib/api.js';
import {
  clearStoredToken,
  getStoredToken,
  storeToken,
} from '../lib/auth-storage.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => getStoredToken());
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(() => Boolean(getStoredToken()));
  const [sessionError, setSessionError] = useState('');

  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      return undefined;
    }

    let isCurrent = true;
    setSessionError('');

    api.get('/auth/me')
      .then(({ data }) => {
        if (isCurrent) {
          setUser(data.user);
        }
      })
      .catch((error) => {
        if (isCurrent && error.response?.status === 401) {
          clearStoredToken();
          setToken(null);
          setUser(null);
        } else if (isCurrent) {
          setSessionError('We couldn’t restore your session. Check your connection and refresh to try again.');
        }
      })
      .finally(() => {
        if (isCurrent) {
          setIsLoading(false);
        }
      });

    return () => {
      isCurrent = false;
    };
  }, [token]);

  const establishSession = useCallback((data) => {
    storeToken(data.token);
    setToken(data.token);
    setUser(data.user);
    setSessionError('');
  }, []);

  const login = useCallback(async (credentials) => {
    const { data } = await api.post('/auth/login', credentials);
    establishSession(data);
    return data.user;
  }, [establishSession]);

  const register = useCallback(async (details) => {
    const { data } = await api.post('/auth/register', details);
    establishSession(data);
    return data.user;
  }, [establishSession]);

  const logout = useCallback(() => {
    clearStoredToken();
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(() => ({
    token,
    user,
    isLoading,
    sessionError,
    isAuthenticated: Boolean(token && user),
    login,
    register,
    logout,
  }), [token, user, isLoading, sessionError, login, register, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider.');
  }

  return context;
}
