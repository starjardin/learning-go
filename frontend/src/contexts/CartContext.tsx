import React, { createContext, useContext, useCallback } from 'react';
import { 
  useGetCartQuery, 
  useAddToCartMutation, 
  useUpdateCartItemQuantityMutation, 
  useRemoveFromCartMutation, 
  useClearCartMutation,
  useGetCartItemCountQuery
} from '../apollo/generated/graphql';

interface CartContextType {
  cart: {
    items: Array<{
      id: string;
      user_id: number;
      product_id: number;
      quantity: number;
      product: {
        id: string;
        name: string;
        price: number;
        image_link: string;
        available_stocks: number;
      };
    }>;
    total_items: number;
    total_price: number;
  } | null;
  loading: boolean;
  error: Error | null;
  cartItemCount: number;
  addToCart: (productId: string, quantity: number) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refetchCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: cartData, loading: cartLoading, error: cartError, refetch: refetchCart } = useGetCartQuery({
    fetchPolicy: 'cache-and-network',
  });
  
  const { data: countData, refetch: refetchCount } = useGetCartItemCountQuery({
    fetchPolicy: 'cache-and-network',
  });

  const [addToCartMutation] = useAddToCartMutation();
  const [updateQuantityMutation] = useUpdateCartItemQuantityMutation();
  const [removeFromCartMutation] = useRemoveFromCartMutation();
  const [clearCartMutation] = useClearCartMutation();

  const addToCart = useCallback(async (productId: string, quantity: number) => {
    await addToCartMutation({
      variables: { productId, quantity },
    });
    refetchCart();
    refetchCount();
  }, [addToCartMutation, refetchCart, refetchCount]);

  const updateQuantity = useCallback(async (productId: string, quantity: number) => {
    await updateQuantityMutation({
      variables: { productId, quantity },
    });
    refetchCart();
    refetchCount();
  }, [updateQuantityMutation, refetchCart, refetchCount]);

  const removeFromCart = useCallback(async (productId: string) => {
    await removeFromCartMutation({
      variables: { productId },
    });
    refetchCart();
    refetchCount();
  }, [removeFromCartMutation, refetchCart, refetchCount]);

  const clearCart = useCallback(async () => {
    await clearCartMutation();
    refetchCart();
    refetchCount();
  }, [clearCartMutation, refetchCart, refetchCount]);

  const value: CartContextType = {
    cart: cartData?.getCart ?? null,
    loading: cartLoading,
    error: cartError ?? null,
    cartItemCount: countData?.getCartItemCount ?? 0,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    refetchCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
