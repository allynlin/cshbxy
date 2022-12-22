import React, {useState} from 'react';
import {Button, Tour} from 'antd';
import type {TourProps} from 'antd';
import intl from "react-intl-universal";
import {LStorage} from "../../component/localStrong";

const App: React.FC = () => {

    const [open, setOpen] = useState<boolean>(false);

    const steps: TourProps['steps'] = [{
        title: intl.get('tour-title-1'),
        description: intl.get('tour-1'),
    }, {
        title: intl.get('tour-title-2'),
        description: intl.get('tour-2'),
    }, {
        title: intl.get('tour-title-3'),
        description: intl.get('tour-3'),
    }, {
        title: intl.get('tour-title-4'),
        description: intl.get('tour-4'),
    }];

    return (
        LStorage.get('cshbxy-oa-isShowTour') === false ? null : <>
            <Button type="primary"
                    onClick={() => setOpen(true)}>{intl.get('beginTour')}</Button>
            <Tour open={open} onClose={() => setOpen(false)} steps={steps} onFinish={() => {
                LStorage.set('cshbxy-oa-isShowTour', false)
            }}/>
        </>
    );
};

export default App;
