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
            document.documentElement.setAttribute(
                'data-scheme',
                'light'
            )
            document.documentElement.setAttribute(
                'data-prefers-color-scheme',
                'light'
            )
            document.documentElement.setAttribute(
                'theme-mode',
                'light'
            )
        },
        dark: state => {
            state.value = 'dark'
            document.documentElement.setAttribute(
                'data-scheme',
                'dark'
            )
            document.documentElement.setAttribute(
                'data-prefers-color-scheme',
                'dark'
            )
            document.documentElement.setAttribute(
                'theme-mode',
                'dark'
            )
        }
    },
})

// 为每个 reducer 函数生成动作创建器（Action creators）
export const {light, dark} = themeSlice.actions

export default themeSlice.reducer
