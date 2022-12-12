import {configureStore} from '@reduxjs/toolkit'
import isLoginSlice from './isLoginSlice'
import userTypeSlice from './userTypeSlice'
import ServerVersionSlice from "./serverVersionSlice";
import themeSlice from "./themeSlice";
import menuModeSlice from "./menuModeSlice";
import sysColorSlice from "./sysColorSlice";
import userInfoSlice from "./userInfoSlice";
import userLanguageSlice from "./userLanguageSlice";
import ServerLowVersionSlice from "./serverLowVersionSlice";
import userTokenSlice from "./userTokenSlice";
import tableSizeSlice from "./tableSizeSlice";

export default configureStore({
    reducer: {
        isLogin: isLoginSlice,
        userType: userTypeSlice,
        serverVersion: ServerVersionSlice,
        serverLowVersion: ServerLowVersionSlice,
        themeColor: themeSlice,
        sysColor: sysColorSlice,
        menuMode: menuModeSlice,
        userInfo: userInfoSlice,
        userLanguage: userLanguageSlice,
        userToken: userTokenSlice,
        tableSize: tableSizeSlice
    },
})
