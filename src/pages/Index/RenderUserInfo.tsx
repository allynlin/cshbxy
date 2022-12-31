import {Alert, Button, Typography, App} from 'antd';
import React from 'react';
import {useNavigate} from "react-router-dom";
import intl from "react-intl-universal";
import {LStorage} from "../../component/localStrong";
import HomeDescriptions from "./HomeDescriptions";
import {useStyles} from "../../styles/webStyle";

const {Paragraph} = Typography;

const Index: React.FC = () => {

    const classes = useStyles();

    const {message} = App.useApp();

    const navigate = useNavigate();

    return (
        <div className={classes.webHomeBody}>
            {
                LStorage.get('cshbxy-oa-isShowAlert') === false ? null :
                    <Alert
                        message={intl.get('tips-1')}
                        description={
                            <>
                                <Paragraph>{intl.get('tips-2')}</Paragraph>
                                <Paragraph>{intl.get('tips-3')}</Paragraph>
                                <Paragraph>{intl.get('tips-4')}</Paragraph>
                                <Paragraph>{intl.get('tips-5')}</Paragraph>
                                <Paragraph>{intl.get('tips-6')}</Paragraph>
                                <Button
                                    type="primary"
                                    target="_blank"
                                    onClick={() => navigate('/m/home')}
                                    block
                                >{intl.get('changeToMobileTerminal')}</Button>
                            </>
                        }
                        type="info"
                        closable
                        onClose={() => {
                            message.info(intl.get('tips-7'));
                            LStorage.set('cshbxy-oa-isShowAlert', false)
                        }}
                    />
            }
            <HomeDescriptions/>
        </div>
    )
};

const RenderUserInfo = () => {
    return (
        <App>
            <Index/>
        </App>
    )
}

export default RenderUserInfo;
