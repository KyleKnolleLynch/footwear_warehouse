import { createContext, useReducer } from 'react'

export const CartContext = createContext()

const initialState = {
  cart: { cartItems: [] },
}

export const cartReducer = (state, action) => {
  switch (action.type) {
    case 'CART_ADD_ITEM': {
      const newItem = action.payload
      const existItem = state.cart.cartItems.find(
        item => item.slug === newItem.slug
      )
      const cartItems = existItem
        ? state.cart.cartItems.map(item =>
            item.name === existItem.name ? newItem : item
          )
        : [...state.cart.cartItems, newItem]
        return { ...state, cart: { ...state.cart, cartItems } }
    }
    default: 
    return state
  }
}

export const CartContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState)
    return (
        <CartContext.Provider value={{ ...state, dispatch }}>
          {children}
        </CartContext.Provider>
    )
}
