import {createSlice} from '@reduxjs/toolkit'

const initialState: { value: string } = {
    value: '0.0.0',
}

export const serverVersionSlice = createSlice({
    name: 'serverVersion',
    initialState,
    reducers: {
        setVersion: (state, action) => {
            state.value = action.payload
        }
    },
})

// 为每个 reducer 函数生成动作创建器（Action creators）
export const {setVersion} = serverVersionSlice.actions

export default serverVersionSlice.reducer