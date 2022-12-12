import {createSlice} from '@reduxjs/toolkit'

interface Interface {
    value: {
        width: number,
        height: number
    }
}

const initialState: Interface = {
    value: {
        width: 0,
        height: 0
    }
}

export const tableSizeSlice = createSlice({
    name: 'tableSize',
    initialState,
    reducers: {
        setTableSize: (state, action) => {
            state.value = action.payload
        }
    },
})

// 为每个 reducer 函数生成动作创建器（Action creators）
export const {setTableSize} = tableSizeSlice.actions

export default tableSizeSlice.reducer
