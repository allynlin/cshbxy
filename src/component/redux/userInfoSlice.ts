import {createSlice} from '@reduxjs/toolkit'
import {SStorage} from "../localStrong";

interface Interface {
    value: object
}

const initialState: Interface = {
    value: {} as object,
}

export const userInfoSlice = createSlice({
    name: 'userInfo',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.value = action.payload
            SStorage.set('userInfo', action.payload)
        }
    },
})

// 为每个 reducer 函数生成动作创建器（Action creators）
export const {setUser} = userInfoSlice.actions

export default userInfoSlice.reducer