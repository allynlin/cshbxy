import {configureStore} from '@reduxjs/toolkit'
import isLoginSlice from './isLoginSlice'
import userTypeSlice from './userTypeSlice'
import ServerVersionSlice from "./serverVersionSlice";
import themeSlice from "./themeSlice";

export default configureStore({
    reducer: {
        isLogin: isLoginSlice,
        userType: userTypeSlice,
        serverVersion: ServerVersionSlice,
        themeColor: themeSlice
    },
})