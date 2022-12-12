import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import axios from 'axios'

const initialState={
    loading:false,
    success:false,
    error:null,
}


export const payOrder=createAsyncThunk('payment/payOrder',
async({id,paymentResult},thunkAPI)=>{
    const state=thunkAPI.getState()
    try{
        const config={
            headers:{
                'Content-type':'application/json',
                Authorization: `Bearer ${state.auth.userInfo.token}`
            }
        }
        const {data}=await axios.put(`/api/orders/${id}/pay/`,
        paymentResult,config)
        return data

    }catch(error){
        return thunkAPI.rejectWithValue(
            error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message
        )
    }
})

const PaymentSlice=createSlice({
    name:'payment',
    initialState,
    reducers:{
    },
    extraReducers:{

        [payOrder.pending]:(state,action)=>{
            state.error=null
            state.success=false
            state.loading=true
        },
        [payOrder.fulfilled]:(state,action)=>{
            state.loading=false
            state.success=true
        },
        [payOrder.pending]:(state,action)=>{
            state.loading=false
            state.error=action.payload
        },
    }
})

export default PaymentSlice.reducer