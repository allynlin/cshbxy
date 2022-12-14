import {createSlice} from '@reduxjs/toolkit'
import setCookie from "../cookie/setCookie";

const initialState: { value: 'light' | 'dark' | 'sys' } = {
    value: 'sys',
}

export const sysColorSlice = createSlice({
    name: 'sysColor',
    initialState,
    reducers: {
        lightTheme: state => {
            state.value = 'light'
            setCookie({name: 'cshbxy-oa-sysColor', value: 'light'})
        },
        darkTheme: state => {
            state.value = 'dark'
            setCookie({name: 'cshbxy-oa-sysColor', value: 'dark'})
        },
        sysTheme: state => {
            state.value = 'sys'
            setCookie({name: 'cshbxy-oa-sysColor', value: 'sys'})
        }
    },
})

// 为每个 reducer 函数生成动作创建器（Action creators）
export const {lightTheme, darkTheme, sysTheme} = sysColorSlice.actions

export default sysColorSlice.reducer
