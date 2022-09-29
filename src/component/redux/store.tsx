import { configureStore } from '@reduxjs/toolkit'
import isLoginSlice from './isLoginSlice'
import userTypeSlice from './userTypeSlice'

export default configureStore({
    reducer: {
        isLogin: isLoginSlice,
        userType: userTypeSlice,
    },
})