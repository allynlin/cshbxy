import {createSlice} from '@reduxjs/toolkit'
import {LStorage} from "../localStrong";

const initialState: { value: string } = {
    value: LStorage.get('cshbxy-oa-serverLowVersion') || '0.0.0',
}

export const serverVersionSlice = createSlice({
    name: 'serverLowVersion',
    initialState,
    reducers: {
        setLowVersion: (state, action) => {
            state.value = action.payload
            LStorage.set('cshbxy-oa-serverLowVersion', action.payload)
        }
    },
})

// 为每个 reducer 函数生成动作创建器（Action creators）
export const {setLowVersion} = serverVersionSlice.actions

export default serverVersionSlice.reducer
