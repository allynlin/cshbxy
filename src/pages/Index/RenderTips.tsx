import React from 'react';
import {Button, Modal, Result, Typography} from 'antd';
import intl from "react-intl-universal";
import {ExclamationCircleOutlined} from '@ant-design/icons';

const {Paragraph, Text} = Typography;
const RenderTips: React.FC = () => {

    return (
        <Result title={intl.get('tips')}>
            <div className="desc" style={{borderRadius: 16}}>
                <Paragraph>
                    <Text
                        strong
                        style={{
                            fontSize: 16,
                        }}
                    >
                        {intl.get('tips-1')}
                    </Text>
                </Paragraph>
                <Paragraph>{intl.get('tips-2')}</Paragraph>
                <Paragraph>{intl.get('tips-3')}</Paragraph>
                <Paragraph>{intl.get('tips-4')}</Paragraph>
                <Paragraph>{intl.get('tips-5')}</Paragraph>
                <Paragraph>{intl.get('tips-6')}</Paragraph>
                <Button
                    type="primary"
                    target="_blank"
                    onClick={() => window.location.replace('https://cshbxy-mobile.netlify.app/')}
                    block
                >{intl.get('changeToMobileTerminal')}</Button>
            </div>
        </Result>
    )
}

export default RenderTips;
