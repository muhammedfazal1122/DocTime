import { createSlice } from "@reduxjs/toolkit";

const userProfileSlice = createSlice({
    name: 'user_profile',
    initialState: {
        user_id: null,
        name: null,
        profile_pic: null
    },
    reducers: {
        set_profile(state, action) {
            state.name = action.payload.name;
            state.profile_pic = action.payload.profile_pic;
            state.user_id = action.payload.user_id;
            // Save data to local storage
            localStorage.setItem('userProfile', JSON.stringify(state));
        }
    }
});

export const { set_profile } = userProfileSlice.actions; 

// Load initial state from local storage if available
const initialState = localStorage.getItem('userProfile') 
    ? JSON.parse(localStorage.getItem('userProfile'))
    : { user_id: null, name: null, profile_pic: null };

export default userProfileSlice.reducer;
