import { configureStore } from "@reduxjs/toolkit";
import authenticationSlice from '../Redux/AuthanticationUser'

export default configureStore({
    reducer:{
        authentication_user:authenticationSlice
    }

})