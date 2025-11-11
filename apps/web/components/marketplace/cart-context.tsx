"use client";

import {
  createContext,
  useContext,
  useMemo,
  useReducer,
  PropsWithChildren
} from "react";

type CartItem = {
  id: string;
  type: "package" | "item";
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string | null;
};

type CartAction =
  | { type: "add"; payload: Omit<CartItem, "quantity"> & { quantity?: number } }
  | { type: "remove"; payload: { id: string; type: CartItem["type"] } }
  | { type: "set-quantity"; payload: { id: string; type: CartItem["type"]; quantity: number } }
  | { type: "clear" };

function cartReducer(state: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case "add": {
      const existing = state.find(
        (item) => item.id === action.payload.id && item.type === action.payload.type
      );
      if (existing) {
        return state.map((item) =>
          item.id === action.payload.id && item.type === action.payload.type
            ? { ...item, quantity: item.quantity + (action.payload.quantity ?? 1) }
            : item
        );
      }
      return [
        ...state,
        {
          ...action.payload,
          quantity: action.payload.quantity ?? 1
        }
      ];
    }
    case "set-quantity": {
      return state.map((item) =>
        item.id === action.payload.id && item.type === action.payload.type
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
    }
    case "remove": {
      return state.filter(
        (item) => !(item.id === action.payload.id && item.type === action.payload.type)
      );
    }
    case "clear":
      return [];
    default:
      return state;
  }
}

type CartContextValue = {
  items: CartItem[];
  total: number;
  actions: {
    add: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
    remove: (id: string, type: CartItem["type"]) => void;
    setQuantity: (id: string, type: CartItem["type"], quantity: number) => void;
    clear: () => void;
  };
};

const CartContext = createContext<CartContextValue | null>(null);

export function MarketplaceCartProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer(cartReducer, []);

  const value = useMemo<CartContextValue>(
    () => ({
      items: state,
      total: state.reduce((acc, item) => acc + item.quantity * item.price, 0),
      actions: {
        add: (item) => dispatch({ type: "add", payload: item }),
        remove: (id, type) => dispatch({ type: "remove", payload: { id, type } }),
        setQuantity: (id, type, quantity) =>
          dispatch({ type: "set-quantity", payload: { id, type, quantity } }),
        clear: () => dispatch({ type: "clear" })
      }
    }),
    [state]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useMarketplaceCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useMarketplaceCart must be used within MarketplaceCartProvider");
  }
  return context;
}

