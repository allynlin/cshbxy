import React from 'react';
import {HeaderMenu, SliderMenu} from "./RenderMenu";
import {version} from "../../baseInfo";
import RenderLogOut from "./RenderLogOut";
import WebComponent from "./WebComponent";

const App: React.FC = () => {

    return (
        <WebComponent
            title="长沙星辰软件有限公司 OA 系统"
            copy={`长沙星辰软件有限公司 OA &copy; 2022-2023 Created by allynlin Version：${version}`}
            menu={<SliderMenu/>}
            headMenu={<HeaderMenu/>}
            logOut={<RenderLogOut/>}
        />
    );
};

export default App;
