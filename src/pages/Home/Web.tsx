import {SliderMenu} from "./RenderMenu";
import RenderLogOut from "./RenderLogOut";
import WebComponent from "./WebComponent";
import React from 'react';

const App: React.FC = () => {

    return (
        <WebComponent
            title="长沙星辰软件有限公司 OA 系统"
            menu={<SliderMenu/>}
            logOut={<RenderLogOut/>}
        />
    );
};

export default App;
