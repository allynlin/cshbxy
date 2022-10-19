import {configureStore} from '@reduxjs/toolkit'
import isLoginSlice from './isLoginSlice'
import userTypeSlice from './userTypeSlice'
import ServerVersionSlice from "./serverVersionSlice";
import themeSlice from "./themeSlice";
import menuModeSlice from "./menuModeSlice";
import sysColorSlice from "./sysColorSlice";
import userInfoSlice from "./userInfoSlice";
import userLanguageSlice from "./userLanguageSlice";

export default configureStore({
    reducer: {
        isLogin: isLoginSlice,
        userType: userTypeSlice,
        serverVersion: ServerVersionSlice,
        themeColor: themeSlice,
        sysColor: sysColorSlice,
        menuMode: menuModeSlice,
        userInfo: userInfoSlice,
        userLanguage: userLanguageSlice,
    },
})
