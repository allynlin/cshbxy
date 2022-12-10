import {createSlice} from '@reduxjs/toolkit'

interface Interface {
    value: object
}

const initialState: Interface = {
    value: {} as object,
}

export const userTokenSlice = createSlice({
    name: 'userToken',
    initialState,
    reducers: {
        setToken: (state, action) => {
            state.value = action.payload
        }
    },
})

// 为每个 reducer 函数生成动作创建器（Action creators）
export const {setToken} = userTokenSlice.actions

export default userTokenSlice.reducer
