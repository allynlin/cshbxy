import React from "react";
import Test from "./Test";
import {LStorage} from "../../component/localStrong";

const Teacher: React.FC = () => {
    const [count, setCount] = React.useState<number>(0);
    const [childCount, setChildCount] = React.useState<number>(0);
    return (
        <div>
            {/*<p>这是教师首页{count}</p>*/}
            <p>这是父组件{childCount}</p>
            <button onClick={() => {
                setCount(count + 1)
                LStorage.set('count', count + 1)
            }}>点击
            </button>
            {/*传递 count 给子组件*/}
            <Test msg={count} changeCount={(code: number) => setChildCount(childCount + code)}/>
        </div>
    )
}
export default Teacher;