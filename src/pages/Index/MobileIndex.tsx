import React from 'react';
import {useNavigate} from "react-router-dom";
import {Button, NoticeBar} from "antd-mobile";
import {LStorage} from "../../component/localStrong";
import HomeDescriptions from "./HomeDescriptions";

const Index: React.FC = () => {

    const navigate = useNavigate();

    return (
        <>
            {
                LStorage.get('cshbxy-oa-mobileHomeAlert') === false ? null : <>
                    <NoticeBar content='移动端部分功能受限无法使用，如您需要使用全部功能，请前往 Web 端' color='info'/>
                    <Button
                        style={{marginTop: 16}}
                        block
                        color='primary'
                        onClick={() => {
                            LStorage.set('cshbxy-oa-mobileHomeAlert', false)
                            navigate('/home')
                        }}
                    >
                        前往 Web 端
                    </Button>
                </>
            }
            <HomeDescriptions/>
        </>
    )
};

export default Index;
