import {Alert, Button, notification, Typography} from 'antd';
import React from 'react';
import {useNavigate} from "react-router-dom";
import './index.scss'
import intl from "react-intl-universal";
import {LStorage} from "../../component/localStrong";
import HomeDescriptions from "./HomeDescriptions";

const {Paragraph} = Typography;

const Employee: React.FC = () => {

    const [api, contextHolder] = notification.useNotification();

    const navigate = useNavigate();

    return (
        <div className={'index-body'}>
            {contextHolder}
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
                            api.info({
                                message: intl.get('tips-7'),
                            })
                            LStorage.set('cshbxy-oa-isShowAlert', false)
                        }}
                    />
            }
            <HomeDescriptions/>
        </div>
    )
};

export default Employee;
