import React from 'react';
import {useNavigate} from "react-router-dom";
import {Button, NoticeBar, Result} from "antd-mobile";
import {LStorage} from "../../component/localStrong";
import MobileHomeDescriptions from "./MobileHomeDescriptions";
import {useSelector} from "react-redux";
import {useStyles} from "../../styles/mobileStyle";

const Index: React.FC = () => {

    const classes = useStyles();

    const isLogin = useSelector((state: any) => state.isLogin.value)

    const navigate = useNavigate();

    return (
        <div className={classes.mobileIndex}>
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
            {isLogin ? <MobileHomeDescriptions/> : <Result
                status='info'
                title='请先登录'
                description='登录后即可查看用户信息'
            />}
        </div>
    )
};

export default Index;
