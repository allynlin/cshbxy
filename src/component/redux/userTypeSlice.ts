import {createSlice} from '@reduxjs/toolkit'

const initialState: { value: String } = {
    value: "all",
}

export const userTypeSlice = createSlice({
    name: 'userType',
    initialState,
    reducers: {
        Employee: state => {
            state.value = "Employee"
        },
        Department: state => {
            state.value = "Department"
        },
        Leader: state => {
            state.value = "Leader"
        },
        all: state => {
            state.value = "all"
        }
    },
})

// 为每个 reducer 函数生成动作创建器（Action creators）
export const {Employee, Department, Leader, all} = userTypeSlice.actions

export default userTypeSlice.reducer
