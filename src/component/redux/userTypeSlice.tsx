import {createSlice} from '@reduxjs/toolkit'

const initialState: { value: String } = {
    value: "all",
}

export const userTypeSlice = createSlice({
    name: 'userType',
    initialState,
    reducers: {
        teacher: state => {
            state.value = "teacher"
        },
        department: state => {
            state.value = "department"
        },
        leader: state => {
            state.value = "leader"
        },
        all: state => {
            state.value = "all"
        }
    },
})

// 为每个 reducer 函数生成动作创建器（Action creators）
export const {teacher, department, leader, all} = userTypeSlice.actions

export default userTypeSlice.reducer