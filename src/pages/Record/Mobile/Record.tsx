import React, {useEffect, useState} from 'react'
import {Tabs} from 'antd-mobile'
import {Outlet, useLocation, useNavigate} from "react-router-dom";
import {useStyles} from "../../../styles/mobileStyle";

const tabs = [{
    key: 'departmentChange',
    title: '变更部门',
}, {
    key: 'travel',
    title: '差旅报销',
}, {
    key: 'leave',
    title: '请假',
}, {
    key: 'procurement',
    title: '采购',
}, {
    key: 'workReport',
    title: '工作报告',
}]

export default function Record() {

    const classes = useStyles();

    const [activeKey, setActiveKey] = useState('')

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const path = location.pathname.substring(location.pathname.lastIndexOf('/') + 1);
        setActiveKey(path)
    }, [location.pathname])

    const changeItem = (e: string) => {
        setActiveKey(e)
        navigate(`/m/record/${e}`)
    }

    return (
        <div className={classes.tabBarContainer}>
            <Tabs className={classes.tabs} activeKey={activeKey} onChange={e => changeItem(e)}>
                {tabs.map(item => (
                    <Tabs.Tab key={item.key} title={item.title}/>
                ))}
            </Tabs>
            <div className={classes.tabBarOutlet}>
                <Outlet/>
            </div>
        </div>
    )
}
