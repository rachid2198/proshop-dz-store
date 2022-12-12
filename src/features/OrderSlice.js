import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import axios from 'axios'

const initialState={
    loading:true,
    success:false,
    order:null,
    error:null,
    orderDetails:null
}

export const createOrder=createAsyncThunk("order/createOrder",
async(order,thunkAPI)=>{
    const state=thunkAPI.getState()
    try{
        const config={
            headers:{
                'Content-type':'application/json',
                Authorization: `Bearer ${state.auth.userInfo.token}`
            }
        }
        const {data}=await axios.post(`/api/orders/add/`, order,config)
        return data

    }catch(error){
        return thunkAPI.rejectWithValue(
            error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message
        )
    }
})


export const getOrderDetails=createAsyncThunk('order/getOrderDetails',
async(id,thunkAPI)=>{
    const state=thunkAPI.getState()
    try{
        const config={
            headers:{
                'Content-type':'application/json',
                Authorization: `Bearer ${state.auth.userInfo.token}`
            }
        }
        const {data}=await axios.get(`/api/orders/${id}/`,config)
        return data

    }catch(error){
        return thunkAPI.rejectWithValue(
            error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message
        )
    }
})


const OrderSlice=createSlice({
    name:'order',
    initialState,
    reducers:{
        clearOrder:(state,action)=>{
            state.success=false
            state.order=null
            state.error=null
        }
    },
    extraReducers:{
        [createOrder.pending]:(state,action)=>{
            state.loading=true
        },
        [createOrder.fulfilled]:(state,action)=>{
            state.loading=false
            state.order=action.payload
            state.success=true
        },
        [createOrder.pending]:(state,action)=>{
            state.loading=false
            state.success=false
            state.error=action.payload
        },


        [getOrderDetails.pending]:(state,action)=>{
            state.loading=true
        },
        [getOrderDetails.fulfilled]:(state,action)=>{
            state.orderDetails=action.payload
            state.loading=false
        },
        [getOrderDetails.pending]:(state,action)=>{
            state.loading=false
            state.error=action.payload
        },

    }
})

export const {clearOrder}=OrderSlice.actions
export default OrderSlice.reducer