import { createSlice } from '@reduxjs/toolkit';

const authenticationSlice = createSlice({
  name: 'authentication_user',
  initialState: {
    name: null,
    isAuthenticated: false,
    isAdmin: false,
    is_doctor: false,
    user_id: null,
  },
  reducers: {
    set_authentication(state, action) {
      state.name = action.payload.name;
      state.isAuthenticated = action.payload.isAuthenticated;
      state.isAdmin = action.payload.isAdmin;
      state.is_doctor = action.payload.is_doctor;
      state.user_id = action.payload.user_id;
      
      // Save data to local storage
      localStorage.setItem('authenticationData', JSON.stringify(state));
    },
  },
});

export const { set_authentication } = authenticationSlice.actions;

// Load initial state from local storage if available
const initialState = localStorage.getItem('authenticationData') 
  ? JSON.parse(localStorage.getItem('authenticationData'))
  : {
      name: null,
      isAuthenticated: false,
      isAdmin: false,
      is_doctor: false,
      user_id: null,
    };

export default authenticationSlice.reducer;
