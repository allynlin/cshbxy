import {createSlice} from '@reduxjs/toolkit'
import {LStorage} from "../localStrong";
import intl from "react-intl-universal";

const initialState: { value: 'Chinese' | 'English' } = {
    value: 'English',
}

export const userLanguageSlice = createSlice({
    name: 'userLanguage',
    initialState,
    reducers: {
        Chinese: state => {
            state.value = "Chinese"
            LStorage.set('userLanguage', 'Chinese')
        },
        English: state => {
            state.value = "English"
            LStorage.set('userLanguage', 'English')
        }
    },
})

// 为每个 reducer 函数生成动作创建器（Action creators）
export const {Chinese, English} = userLanguageSlice.actions

export default userLanguageSlice.reducer
