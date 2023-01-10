import {createSlice} from '@reduxjs/toolkit'

const initialState: { value: boolean } = {
    value: false,
}

export const isRenderWeb = createSlice({
    name: 'isRenderWeb',
    initialState,
    reducers: {
        render: state => {
            state.value = true
        },
        noRender: state => {
            state.value = false
        }
    },
})

// 为每个 reducer 函数生成动作创建器（Action creators）
export const {render, noRender} = isRenderWeb.actions

export default isRenderWeb.reducer
