import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    token: null
}

export const tokenSlice = createSlice({
    name:"token",
    initialState,
    reducers:{
        setCurrentToken:(state,action)=>{
            state.token = action.payload
        }
    }
})

export const {setCurrentToken} = tokenSlice.actions;

export default tokenSlice.reducer;