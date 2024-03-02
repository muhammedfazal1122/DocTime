import {createSlice} from '@reduxjs/toolkit'

const authenticationSlice  = createSlice({
    name: 'authentication_user',
    initialState:{
        name : null,
        isAuthenticated: false,
        isAdmin : false,
        is_doctor: false,
        user_id: null,
    },
    
    reducers: {
        set_authentication(state,action){
            state.name = action.payload.name
            state.isAuthenticated = action.payload.isAuthenticated
            state.isAdmin = action.payload.isAdmin
            state.is_doctor =action.payload.is_doctor
            state.user_id = action.payload.user_id

        },

    }



}) 


export const {set_Authentication} =  authenticationSlice.actions

export default authenticationSlice.reducer