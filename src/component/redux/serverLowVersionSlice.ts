import {createSlice} from '@reduxjs/toolkit'

const initialState: { value: string } = {
    value: '0.0.0',
}

export const serverVersionSlice = createSlice({
    name: 'serverLowVersion',
    initialState,
    reducers: {
        setLowVersion: (state, action) => {
            state.value = action.payload
        }
    },
})

// 为每个 reducer 函数生成动作创建器（Action creators）
export const {setLowVersion} = serverVersionSlice.actions

export default serverVersionSlice.reducer
