import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import axios from 'axios'


const initialState={
    products:[],
    topProducts:[],
    loading:true,
    errorMessage:'',
    CarouselLoading:true,
    CarouselErrorMessage:'',
}

export const getProductList=createAsyncThunk('products/getProductList'
, async(keyword="",thunkAPI)=>{
    try{
    const {data}=await axios.get(`/api/products/${keyword}`)
    return data
    }catch(error){
    return thunkAPI.rejectWithValue(
        error.response && error.response.data.detail
        ? error.response.data.detail
        : error.message
    )
    }
})

export const getTopProductList=createAsyncThunk('products/getTopProductList'
, async(name,thunkAPI)=>{
    try{
    const {data}=await axios.get(`/api/products/top/`)
    return data
    }catch(error){
    return thunkAPI.rejectWithValue(
        error.response && error.response.data.detail
        ? error.response.data.detail
        : error.message
    )
    }
})



const ProductSlice = createSlice({
  name: "products",
  initialState,

  extraReducers:{
    //products list--------------------------

    [getProductList.pending]:(state)=>{
        state.loading=true
        state.errorMessage=""
    },
    [getProductList.fulfilled]:(state,action)=>{
        state.loading=false
        state.products=action.payload
    },
    [getProductList.rejected]:(state,action)=>{
        state.loading=false
        state.errorMessage=action.payload
    },
    
    [getTopProductList.pending]:(state)=>{
        state.CarouselLoading=true
        state.CarouselErrorMessage=""
    },
    [getTopProductList.fulfilled]:(state,action)=>{
        state.CarouselLoading=false
        state.topProducts=action.payload
    },
    [getTopProductList.rejected]:(state,action)=>{
        state.CarouselLoading=false
        state.CarouselErrorMessage=action.payload
    },
  }

});


export default ProductSlice.reducer

