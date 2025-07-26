import React, { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';

const STORAGE_KEY = 'user_data';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await SecureStore.getItemAsync(STORAGE_KEY);
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error loading user from SecureStore:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const updateUser = async (newUser) => {
    try {
      await SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify(newUser));
      setUser(newUser);
    } catch (error) {
      console.error('Error saving user to SecureStore:', error);
    }
  };

  const clearUser = async () => {
    try {
      await SecureStore.deleteItemAsync(STORAGE_KEY);
      setUser(null);
    } catch (error) {
      console.error('Error clearing user from SecureStore:', error);
    }
  };

  return (
    <UserContext.Provider value={{ user, updateUser, clearUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
