import {createSlice} from '@reduxjs/toolkit'
import {LStorage} from "../localStrong";

interface Interface {
    value: {
        tableType: 'virtual' | 'pagination' | 'normal';
        defaultPageSize: number;
    }
}

const initialState: Interface = {
    value: {
        tableType: 'virtual',
        defaultPageSize: 10,
    },
}

export const userTableSlice = createSlice({
    name: 'userTable',
    initialState,
    reducers: {
        setTable: (state, action) => {
            state.value = action.payload;
            LStorage.set('cshbxy-oa-userTable', action.payload);
        }
    },
})

// 为每个 reducer 函数生成动作创建器（Action creators）
export const {setTable} = userTableSlice.actions

export default userTableSlice.reducer
