import {createSlice} from '@reduxjs/toolkit'

const initialState: { value: 'Chinese' | 'English' } = {
    value: 'English',
}

export const userLanguageSlice = createSlice({
    name: 'userLanguage',
    initialState,
    reducers: {
        Chinese: state => {
            state.value = "Chinese"
        },
        English: state => {
            state.value = "English"
        }
    },
})

// 为每个 reducer 函数生成动作创建器（Action creators）
export const {Chinese, English} = userLanguageSlice.actions

export default userLanguageSlice.reducer
