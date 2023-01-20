import {configureStore} from '@reduxjs/toolkit'
import isLoginSlice from './isLoginSlice'
import userTypeSlice from './userTypeSlice'
import themeSlice from "./themeSlice";
import menuModeSlice from "./menuModeSlice";
import sysColorSlice from "./sysColorSlice";
import userInfoSlice from "./userInfoSlice";
import userLanguageSlice from "./userLanguageSlice";
import userTokenSlice from "./userTokenSlice";
import tableSizeSlice from "./tableSizeSlice";
import gaussianBlurSlice from "./gaussianBlurSlice";
import userTableSlice from "./userTableSlice";

export default configureStore({
    reducer: {
        isLogin: isLoginSlice,
        userType: userTypeSlice,
        themeColor: themeSlice,
        sysColor: sysColorSlice,
        menuMode: menuModeSlice,
        userInfo: userInfoSlice,
        userLanguage: userLanguageSlice,
        userToken: userTokenSlice,
        tableSize: tableSizeSlice,
        gaussianBlur: gaussianBlurSlice,
        userTable: userTableSlice
    },
})
