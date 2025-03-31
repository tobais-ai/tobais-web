import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { ServiceType, Project } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";

// Define bill item interface for both services and projects
export interface BillItem {
  id: number;
  type: 'service' | 'project' | 'subscription';
  name: string;
  description: string;
  price: number;
  periodText?: string; // For subscriptions
}

interface CartContextType {
  items: BillItem[];
  addItem: (item: BillItem) => void;
  removeItem: (id: number, type: 'service' | 'project' | 'subscription') => void;
  clearCart: () => void;
  totalAmount: number;
  totalItems: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<BillItem[]>([]);
  
  // Calculate totals
  const totalAmount = items.reduce((total, item) => total + item.price, 0);
  const totalItems = items.length;
  
  // Load cart from localStorage on mount and when user changes
  useEffect(() => {
    if (user) {
      const savedCart = localStorage.getItem(`cart-${user.id}`);
      if (savedCart) {
        try {
          setItems(JSON.parse(savedCart));
        } catch (e) {
          console.error("Failed to parse saved cart:", e);
          localStorage.removeItem(`cart-${user.id}`);
        }
      }
    } else {
      // Clear cart if not logged in
      setItems([]);
    }
  }, [user]);
  
  // Save cart to localStorage when it changes
  useEffect(() => {
    if (user && items.length > 0) {
      localStorage.setItem(`cart-${user.id}`, JSON.stringify(items));
    } else if (user) {
      localStorage.removeItem(`cart-${user.id}`);
    }
  }, [items, user]);
  
  const addItem = (item: BillItem) => {
    // Check if item is already in cart
    const exists = items.some(
      existingItem => existingItem.id === item.id && existingItem.type === item.type
    );
    
    if (!exists) {
      setItems(prevItems => [...prevItems, item]);
    }
  };
  
  const removeItem = (id: number, type: 'service' | 'project' | 'subscription') => {
    setItems(prevItems => 
      prevItems.filter(item => !(item.id === id && item.type === type))
    );
  };
  
  const clearCart = () => {
    setItems([]);
  };
  
  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      clearCart,
      totalAmount,
      totalItems
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}