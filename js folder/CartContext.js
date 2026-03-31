import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import API from './axios';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!user) { setItems([]); setTotal(0); return; }
    try {
      setLoading(true);
      const { data } = await API.get('/cart');
      setItems(data.items || []);
      setTotal(data.total || 0);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const addToCart = async (productId, quantity = 1) => {
    const { data } = await API.post('/cart/add', { productId, quantity });
    setItems(data.items || []);
    setTotal(data.total || 0);
    return data;
  };

  const updateItem = async (productId, quantity) => {
    const { data } = await API.put('/cart/update', { productId, quantity });
    setItems(data.items || []);
    setTotal(data.total || 0);
  };

  const removeItem = async (productId) => {
    const { data } = await API.delete(`/cart/remove/${productId}`);
    setItems(data.items || []);
    setTotal(data.total || 0);
  };

  const clearCart = async () => {
    await API.delete('/cart/clear');
    setItems([]);
    setTotal(0);
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, total, loading, itemCount, addToCart, updateItem, removeItem, clearCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
