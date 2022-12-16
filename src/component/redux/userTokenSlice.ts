import {createSlice} from '@reduxjs/toolkit'
import {LStorage} from "../localStrong";

interface Interface {
    value: object
}

const initialState: Interface = {
    value: {
        colorPrimary: '#1677ff',
        borderRadius: 6,
    },
}

export const userTokenSlice = createSlice({
    name: 'userToken',
    initialState,
    reducers: {
        setToken: (state, action) => {
            state.value = action.payload;
            LStorage.set('cshbxy-oa-userToken', action.payload);
        }
    },
})

// 为每个 reducer 函数生成动作创建器（Action creators）
export const {setToken} = userTokenSlice.actions

export default userTokenSlice.reducer
