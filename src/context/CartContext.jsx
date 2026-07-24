import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      if (!savedCart) return [];
      const parsed = JSON.parse(savedCart);
      if (!Array.isArray(parsed)) return [];
      // Filter out stale mock dummy items with non-MongoDB IDs
      return parsed.filter(item => {
        const gameId = String(item?.game?.id || item?.game?._id || '');
        const packageId = String(item?.packageItem?.id || item?.packageItem?._id || '');
        return gameId.length >= 12 && packageId.length >= 12;
      });
    } catch (e) {
      return [];
    }
  });
  
  const [coupon, setCoupon] = useState(() => {
    const savedCoupon = localStorage.getItem('coupon');
    return savedCoupon ? JSON.parse(savedCoupon) : null;
  });

  const [discount, setDiscount] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [totalKhr, setTotalKhr] = useState(0);

  const exchangeRate = 4100; // 1 USD = 4100 KHR

  // Save cart to localStorage and calculate totals
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
    
    // Calculate subtotal
    const calculatedSubtotal = cartItems.reduce((acc, item) => {
      const price = parseFloat(item.packageItem.price_usd);
      return acc + price * item.qty;
    }, 0);
    
    setSubtotal(calculatedSubtotal);

    // Calculate discount
    let calculatedDiscount = 0;
    if (coupon && calculatedSubtotal >= parseFloat(coupon.min_spend || 0)) {
      if (coupon.type === 'percentage') {
        calculatedDiscount = (calculatedSubtotal * parseFloat(coupon.value)) / 100;
        if (coupon.max_discount && calculatedDiscount > parseFloat(coupon.max_discount)) {
          calculatedDiscount = parseFloat(coupon.max_discount);
        }
      } else if (coupon.type === 'fixed') {
        calculatedDiscount = parseFloat(coupon.value);
      }
    }
    
    // Safety check (discount cannot exceed subtotal)
    if (calculatedDiscount > calculatedSubtotal) {
      calculatedDiscount = calculatedSubtotal;
    }

    setDiscount(calculatedDiscount);
    const calculatedTotal = calculatedSubtotal - calculatedDiscount;
    setTotal(calculatedTotal);
    setTotalKhr(Math.round(calculatedTotal * exchangeRate));
  }, [cartItems, coupon]);

  const addToCart = (game, packageItem, playerId, serverId = '', qty = 1) => {
    setCartItems((prevItems) => {
      // Find if item already exists with SAME package AND player info
      const existingItemIndex = prevItems.findIndex(
        (item) =>
          item.packageItem.id === packageItem.id &&
          item.playerId === playerId &&
          item.serverId === serverId
      );

      if (existingItemIndex > -1) {
        const newItems = [...prevItems];
        newItems[existingItemIndex].qty += qty;
        return newItems;
      }

      return [...prevItems, { game, packageItem, playerId, serverId, qty }];
    });
  };

  const removeFromCart = (packageId, playerId, serverId = '') => {
    setCartItems((prevItems) =>
      prevItems.filter(
        (item) =>
          !(item.packageItem.id === packageId && item.playerId === playerId && item.serverId === serverId)
      )
    );
  };

  const updateCartQuantity = (packageId, playerId, serverId = '', qty) => {
    if (qty <= 0) {
      removeFromCart(packageId, playerId, serverId);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.packageItem.id === packageId && item.playerId === playerId && item.serverId === serverId
          ? { ...item, qty }
          : item
      )
    );
  };

  const applyCouponCode = async (code) => {
    try {
      const res = await api.post('/coupons/validate', { code, subtotal });
      const couponData = res.data.data;
      setCoupon(couponData);
      localStorage.setItem('coupon', JSON.stringify(couponData));
      return { success: true, message: 'Coupon applied successfully!' };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Invalid or expired coupon.'
      };
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
    localStorage.removeItem('coupon');
  };

  const clearCart = () => {
    setCartItems([]);
    setCoupon(null);
    localStorage.removeItem('cart');
    localStorage.removeItem('coupon');
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        coupon,
        subtotal,
        discount,
        total,
        totalKhr,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        applyCoupon: applyCouponCode,
        removeCoupon,
        clearCart,
        exchangeRate
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
