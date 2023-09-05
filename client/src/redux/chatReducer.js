import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    current: null
}

export const chatSlice = createSlice({
    name:'chat',
    initialState,
    reducers:{
        setCurrentChat:(state,action)=>{
            state.current = action.payload
        }
    }
})

export const {setCurrentChat} = chatSlice.actions;

export default chatSlice.reducer;