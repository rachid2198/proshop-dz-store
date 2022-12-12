import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import axios from 'axios'

const userInfoFomStorage= localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')):null 

const initialState={
    userInfo:userInfoFomStorage,
    loading:false,
    error:null
}


export const register=createAsyncThunk('auth/login'
, async({name,email,password},thunkAPI)=>{
    try{
    const config={
        headers:{
            'Content-type':'application/json'
        }
    }
    await axios.post('/api/users/register',{
        'name':name, 'email':email,'password':password,
    },config)

    const {data}=await axios.post('/api/users/login',{
        'username':email,'password':password,
    },config)

    return data

    }catch(error){
    return thunkAPI.rejectWithValue(
        error.response && error.response.data.detail
        ? error.response.data.detail
        : error.message
    )
    }
})


export const login=createAsyncThunk('auth/login'
, async({email,password},thunkAPI)=>{
    try{
    const config={
        headers:{
            'Content-type':'application/json'
        }
    }
    const {data}=await axios.post('/api/users/login',{
        'username':email,'password':password,
    },config)

    return data

    }catch(error){
    return thunkAPI.rejectWithValue(
        error.response && error.response.data.detail
        ? error.response.data.detail
        : error.message
    )
    }
})


const AuthSlice=createSlice({
    name:"auth",
    initialState,
    reducers:{
        update:(state,action)=>{
            const {name,email}=action.payload
            state.userInfo.name=name
            state.userInfo.email=email
            localStorage.setItem('userInfo',JSON.stringify(state.userInfo))
        },
        logout:(state,action)=>{
            localStorage.removeItem('userInfo')
            state.userInfo=null
            state.loading=false
            state.error=null
        }
    },
    extraReducers:{
        [login.pending]:(state,action)=>{
            state.loading=true
        },
        [login.fulfilled]:(state,action)=>{
            state.loading=false
            state.userInfo=action.payload
            localStorage.setItem('userInfo',JSON.stringify(action.payload))
        },
        [login.rejected]:(state,action)=>{
            state.loading=false
            state.error=action.payload
        },

        [register.pending]:(state,action)=>{
            state.loading=true
        },
        [register.fulfilled]:(state,action)=>{
            state.loading=false
            state.userInfo=action.payload
            localStorage.setItem('userInfo',JSON.stringify(action.payload))
        },
        [register.rejected]:(state,action)=>{
            state.loading=false
            state.error=action.payload
        }
    }
})

export const {logout,update}=AuthSlice.actions
export default AuthSlice.reducer