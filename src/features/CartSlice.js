import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import axios from 'axios'

const cartItemsFomStorage= localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')):[] 

const shippingAddressFomStorage= localStorage.getItem('shippingAddress') ? JSON.parse(localStorage.getItem('shippingAddress'))
:{"address":"","country":"","postalCode":"","city":""}

const paymentMethodFomStorage= localStorage.getItem('paymentMethod') ? JSON.parse(localStorage.getItem('paymentMethod')):null

const initialState={
    cartItems:cartItemsFomStorage,
    shippingAddress: shippingAddressFomStorage,
    paymentMethod:paymentMethodFomStorage,  
}

export const addToCart=createAsyncThunk('cart/addToCart'
, async(payload)=>{
    const {id,qty}=payload
    const {data}=await axios.get(`/api/products/${id}`)
    return {
        product:data._id,
        name:data.name,
        image:data.image,
        price:data.price,
        countInStock: data.countInStock,
        qty
    }
})

const CartSlice = createSlice({
    name: "cart",
    initialState,
    reducers:{
        removeFromCart:(state,action)=>{
            const id=action.payload
            state.cartItems=state.cartItems.filter((item)=>{
                return item.product!==id
            })
            localStorage.setItem('cartItems',JSON.stringify(state.cartItems))
        },
        saveShippingAddress:(state,action)=>{
            state.shippingAddress=action.payload
            localStorage.setItem('shippingAddress',JSON.stringify(action.payload))
        },
        savePaymentMethod:(state,action)=>{
            state.paymentMethod=action.payload
            localStorage.setItem('paymentMethod',JSON.stringify(action.payload))
        },
        clearCart:(state,action)=>{
            state.cartItems=[]
            localStorage.removeItem('cartItems')
        }
    },
    extraReducers:{
        [addToCart.fulfilled]:(state,action)=>{
            const item= action.payload
            const existItem=state.cartItems.find(i=>i.product===item.product)
            

            if(existItem){
                state.cartItems=state.cartItems.map((i)=>{
                    if(i.product===item.product){
                        return item
                    }
                    return i
                })
            }else{
                state.cartItems=[...state.cartItems,item]
            }

            localStorage.setItem('cartItems',JSON.stringify(state.cartItems))  
        },
    }
})

export const {clearCart,removeFromCart,saveShippingAddress,savePaymentMethod}=CartSlice.actions
export default CartSlice.reducer
