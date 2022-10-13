import {Tabs} from 'antd';
import React from 'react';

const onChange = (key: string) => {
    console.log(key);
};

const App: React.FC = () => (
    <Tabs
        defaultActiveKey="1"
        onChange={onChange}
        style={{
            padding: 16
        }}
        items={[
            {
                label: `Tab 1`,
                key: '1',
                children: `Content of Tab Pane 1`,
            },
            {
                label: `Tab 2`,
                key: '2',
                children: `Content of Tab Pane 2`,
            },
            {
                label: `Tab 3`,
                key: '3',
                children: `Content of Tab Pane 3`,
            },
        ]}
    />
);

export default App;