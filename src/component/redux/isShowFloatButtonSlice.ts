import {createSlice} from '@reduxjs/toolkit'
import {LStorage} from "../localStrong";

const initialState: { value: boolean } = {
    value: false,
}

export const isShowFloatButtonSlice = createSlice({
    name: 'isShowFloatButton',
    initialState,
    reducers: {
        show: state => {
            state.value = true
            LStorage.set('cshbxy-oa-isShowFloatButton', true)
        },
        hide: state => {
            state.value = false
            LStorage.set('cshbxy-oa-isShowFloatButton', false)
        }
    },
})

// 为每个 reducer 函数生成动作创建器（Action creators）
export const {show, hide} = isShowFloatButtonSlice.actions

export default isShowFloatButtonSlice.reducer