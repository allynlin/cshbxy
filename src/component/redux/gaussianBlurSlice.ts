import {createSlice} from '@reduxjs/toolkit'
import {LStorage} from "../localStrong";

const initialState: { value: boolean } = {
    value: true,
}

export const gaussianBlurSlice = createSlice({
    name: 'gaussianBlur',
    initialState,
    reducers: {
        open: state => {
            state.value = true
            document.documentElement.setAttribute(
                'data-gaussianBlur',
                'true'
            )
            LStorage.set('cshbxy-oa-gaussianBlur', true)
        },
        close: state => {
            state.value = false
            document.documentElement.setAttribute(
                'data-gaussianBlur',
                'false'
            )
            LStorage.set('cshbxy-oa-gaussianBlur', false)
        }
    },
})

// 为每个 reducer 函数生成动作创建器（Action creators）
export const {open, close} = gaussianBlurSlice.actions

export default gaussianBlurSlice.reducer
