import {createSlice} from '@reduxjs/toolkit'
import {LStorage} from "../localStrong";

const initialState: { value: 'vertical' | 'inline' } = {
    value: 'inline',
}

export const menuModeSlice = createSlice({
    name: 'menuMode',
    initialState,
    reducers: {
        inline: state => {
            state.value = "inline"
            LStorage.set('cshbxy-oa-menuMode', 'inline')
        },
        vertical: state => {
            state.value = "vertical"
            LStorage.set('cshbxy-oa-menuMode', 'vertical')
        }
    },
})

// 为每个 reducer 函数生成动作创建器（Action creators）
export const {inline, vertical} = menuModeSlice.actions

export default menuModeSlice.reducer
