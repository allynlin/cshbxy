import {createSlice} from '@reduxjs/toolkit'

const initialState: { value: 'light' | 'dark' } = {
    value: 'light',
}

export const themeSlice = createSlice({
    name: 'themeColor',
    initialState,
    reducers: {
        light: state => {
            state.value = 'light'
            document.body.className = 'light'
        },
        dark: state => {
            state.value = 'dark'
            document.body.className = 'dark'
        }
    },
})

// 为每个 reducer 函数生成动作创建器（Action creators）
export const {light, dark} = themeSlice.actions

export default themeSlice.reducer
