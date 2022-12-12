import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import axios from 'axios'


const initialState={
    product:{},
    loading:true,
    loadingReviews:false,
    success:"",
    errorMessage:"",
    reviewsErrorMessage:""
}

export const listProductDetails=createAsyncThunk('products/listProductDetails'
, async(id,thunkAPI)=>{
    try{
    const {data}=await axios.get(`/api/products/${id}`)
    return data
    }catch(error){
    return thunkAPI.rejectWithValue(
        error.response && error.response.data.detail
        ? error.response.data.detail
        : error.message
    )
    }
})

export const createProductReview=createAsyncThunk("products/createProductReview",
async({id,review},thunkAPI)=>{
    const state=thunkAPI.getState()
    try{
        const config={
            headers:{
                'Content-type':'application/json',
                Authorization: `Bearer ${state.auth.userInfo.token}`
            }
        }
        const {data}=await axios.post(`/api/products/${id}/reviews/`, 
        review,config)
        return data

    }catch(error){
        return thunkAPI.rejectWithValue(
            error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message
        )
    }
})


const ProductDetailSlice = createSlice({
    name: "productDetail",
    initialState,
  
    extraReducers:{
        [listProductDetails.pending]:(state)=>{
            state.loading=true
            state.errorMessage=""
        },
        [listProductDetails.fulfilled]:(state,action)=>{
            state.loading=false
            state.product=action.payload
        },
        [listProductDetails.rejected]:(state,action)=>{
            state.loading=false
            state.errorMessage=action.payload
        },
        
        [createProductReview.pending]:(state)=>{
            state.loadingReviews=true
            state.reviewsErrorMessage=""
        },
        [createProductReview.fulfilled]:(state,action)=>{
            state.loadingReviews=false
            state.product.reviews.push(action.payload)
        },
        [createProductReview.rejected]:(state,action)=>{
            state.loadingReviews=false
            state.reviewsErrorMessage=action.payload
        },
    }
  
  });


export default ProductDetailSlice.reducer


