import {createSlice} from '@reduxjs/toolkit'
import setCookie from "../setCookie";

const initialState: { value: 'Chinese' | 'English' } = {
    value: 'Chinese',
}

export const userLanguageSlice = createSlice({
    name: 'userLanguage',
    initialState,
    reducers: {
        Chinese: state => {
            state.value = "Chinese"
            setCookie({name: "cshbxy-oa-language", value: "zh"})
        },
        English: state => {
            state.value = "English"
            setCookie({name: "cshbxy-oa-language", value: "en_US"})
        }
    },
})

// 为每个 reducer 函数生成动作创建器（Action creators）
export const {Chinese, English} = userLanguageSlice.actions

export default userLanguageSlice.reducer
