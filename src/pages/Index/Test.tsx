import React from "react";
import {LStorage} from "../../component/localStrong";


const Test: React.FC<{ msg: any, changeCount: Function }> = (props) => {
    return (
        <div>
            <div>这是子组件{props.msg}</div>
            <button onClick={() => {
                props.changeCount(1)
                console.log(LStorage.get('count'))
            }}>点击
            </button>
        </div>
    )
}
export default Test;