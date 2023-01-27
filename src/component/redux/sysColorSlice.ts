import {createSlice} from '@reduxjs/toolkit'
import {LStorage} from "../localStrong";

const initialState: { value: 'light' | 'dark' | 'sys' } = {
    value: 'sys',
}

export const sysColorSlice = createSlice({
    name: 'sysColor',
    initialState,
    reducers: {
        lightTheme: state => {
            state.value = 'light'
        },
        darkTheme: state => {
            state.value = 'dark'
        },
        sysTheme: state => {
            state.value = 'sys'
        }
    },
})

// 为每个 reducer 函数生成动作创建器（Action creators）
export const {lightTheme, darkTheme, sysTheme} = sysColorSlice.actions

export default sysColorSlice.reducer
