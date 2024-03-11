import { configureStore } from "@reduxjs/toolkit";
import authenticationSlice from '../Redux/AuthanticationUser'
import userProfileSliceREDUCER from '../Redux/UserProfileSlice'

export default configureStore({
    reducer:{
        authentication_user:authenticationSlice,
        userProfileSlice:userProfileSliceREDUCER
    }

})