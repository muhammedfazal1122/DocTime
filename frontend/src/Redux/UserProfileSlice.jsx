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
        }
    }
});

export const { set_profile } = userProfileSlice.actions; 

export default userProfileSlice.reducer; 
