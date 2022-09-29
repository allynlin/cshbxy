import {createSlice} from '@reduxjs/toolkit'

const initialState: { value: boolean } = {
    value: false,
}

export const isLoginSlice = createSlice({
    name: 'isLogin',
    initialState,
    reducers: {
        login: state => {
            state.value = true
        },
        logout: state => {
            state.value = false
        }
    },
})

// 为每个 reducer 函数生成动作创建器（Action creators）
export const {login, logout} = isLoginSlice.actions

export default isLoginSlice.reducer