// Redux store configuration
import { configureStore } from "@reduxjs/toolkit";
import authenticationSlice from '../Redux/AuthanticationUser';
import userProfileSlice from '../Redux/UserProfileSlice';

export default configureStore({
    reducer:{
        authentication_user: authenticationSlice,
        user_profile: userProfileSlice  // Make sure the reducer name matches the one used in useSelector
    }
});
