import {configureStore} from '@reduxjs/toolkit'
import productReducer from './features/ProductSlice'
import ProductDetailReducer from './features/ProductDetailSlice'
import cartReducer from './features/CartSlice'
import authReducer from './features/AuthSlice'
import profileReducer from './features/ProfileSlice'
import orderReducer from './features/OrderSlice'
import PaymentReducer from './features/PaymentSlice'

export const store = configureStore({
  reducer: {
    products: productReducer,
    productDetails: ProductDetailReducer,
    cart:cartReducer,
    auth:authReducer,
    profile:profileReducer,
    order:orderReducer,
    payment:PaymentReducer
  },
});

