import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import axios from 'axios'
import {update} from './AuthSlice'


const initialState={
    userDetails:null,
    success:false,
    loading:false,
    error:null,

    orders:[],
    loadingOrders:false,
    errorOrders:null,
}

export const updateUserProfile=createAsyncThunk('profile/updateUserProfile',
async(user,thunkAPI)=>{
    const state=thunkAPI.getState()
    try{
        const config={
            headers:{
                'Content-type':'application/json',
                Authorization: `Bearer ${state.auth.userInfo.token}`
            }
        }
        const {data}=await axios.put(`/api/users/profile/update`, user,config)
        const {name,email}=data
        thunkAPI.dispatch(update({name,email}))
        return data

    }catch(error){
        return thunkAPI.rejectWithValue(
            error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message
        )
    }
})

export const getUserDetails= createAsyncThunk('profile/getUserDetails',
async(id,thunkAPI)=>{
    const state=thunkAPI.getState()
    try{
        const config={
            headers:{
                'Content-type':'application/json',
                Authorization: `Bearer ${state.auth.userInfo.token}`
            }
        }
        const {data}=await axios.get(`/api/users/${id}`,config)
        
        return data

    }catch(error){
        return thunkAPI.rejectWithValue(
            error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message
        )
    }
})

export const listMyOrders= createAsyncThunk('profile/listMyOrders',
async(path,thunkAPI)=>{
    const state=thunkAPI.getState()
    try{
        const config={
            headers:{
                'Content-type':'application/json',
                Authorization: `Bearer ${state.auth.userInfo.token}`
            }
        }
        const {data}=await axios.get(`/api/orders/${path}/`,config)
        console.log(data)
        
        return data

    }catch(error){
        return thunkAPI.rejectWithValue(
            error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message
        )
    }
})

const ProfileSlice=createSlice({
    name:'profile',
    initialState,
    reducers:{
        profileLogout:(state,action)=>{
            state.userDetails=null
            state.error=null
            state.orders=[]
        }
    },
    extraReducers:{
        [getUserDetails.pending]:(state,action)=>{
            state.loading=true
        },
        [getUserDetails.fulfilled]:(state,action)=>{
            state.loading=false
            state.userDetails=action.payload            
        },
        [getUserDetails.rejected]:(state,action)=>{
            state.loading=false
            state.error=action.payload
        },


        [updateUserProfile.pending]:(state,action)=>{
            state.loading=true
        },
        [updateUserProfile.fulfilled]:(state,action)=>{
            state.loading=false
            state.userDetails=action.payload            
        },
        [updateUserProfile.rejected]:(state,action)=>{
            state.loading=false
            state.error=action.payload
        },
        
        [listMyOrders.pending]:(state,action)=>{
            state.loadingOrders=true
        },
        [listMyOrders.fulfilled]:(state,action)=>{
            state.loadingOrders=false
            state.success=true
            state.orders=action.payload            
        },
        [listMyOrders.rejected]:(state,action)=>{
            state.loadingOrders=false
            state.errorOrders=action.payload
        }
    }
})

export const {profileLogout}=ProfileSlice.actions
export default ProfileSlice.reducer