import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {useSelector} from "react-redux";
import {AppOutline, FillinOutline, HistogramOutline, SetOutline, TeamOutline, UserOutline} from "antd-mobile-icons";
import {TabBar} from "antd-mobile";


const Home = () => {

    const [activeKey, setActiveKey] = useState('')

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // 截取字符串 第一个 / 到第二个 / 之前的字符串
        const string = location.pathname.substring(2);
        // 获取第一个 / 之后的字符串
        const path1 = string.substring(location.pathname.indexOf('/') + 1);
        // 获取第一个 / 的位置
        const index = path1.indexOf('/');
        if (index === -1) {
            setActiveKey(path1)
            return
        }
        // 截取第一个 / 之后的字符串 第一个 / 到第二个 / 之前的字符串
        const path = path1.substring(0, index);
        setActiveKey(path)
    }, [location.pathname])

    const userType = useSelector((state: any) => state.userType.value)
    const userInfo = useSelector((state: any) => state.userInfo.value);

    const getTabs = () => {
        if (userInfo.username === 'admin') {
            return adminTabs;
        }
        switch (userType) {
            case 'Employee':
                return employeeTabs;
            case 'Department':
                return departmentTabs;
            case 'Leader':
                return leaderTabs;
        }
        return errorTabs;
    }

    const employeeTabs = [
        {
            key: 'home',
            title: '首页',
            icon: <AppOutline/>,
        }, {
            key: 'record',
            title: '记录',
            icon: <HistogramOutline/>,
        }, {
            key: 'setting',
            title: '设置',
            icon: <SetOutline/>,
        },
    ]

    const departmentTabs = [
        {
            key: 'home',
            title: '首页',
            icon: <AppOutline/>,
        }, {
            key: 'approval',
            title: '审批',
            icon: <FillinOutline/>,
        }, {
            key: 'departmentUser',
            title: '部门用户',
            icon: <TeamOutline/>,
        }, {
            key: 'setting',
            title: '设置',
            icon: <SetOutline/>,
        },
    ]

    const leaderTabs = [
        {
            key: 'home',
            title: '首页',
            icon: <AppOutline/>,
        }, {
            key: 'approval',
            title: '审批',
            icon: <FillinOutline/>,
        }, {
            key: 'setting',
            title: '设置',
            icon: <SetOutline/>,
        },
    ]

    const adminTabs = [
        {
            key: 'home',
            title: '首页',
            icon: <AppOutline/>,
        }, {
            key: 'userManagement',
            title: '用户管理',
            icon: <TeamOutline/>,
        }, {
            key: 'setting',
            title: '设置',
            icon: <SetOutline/>,
        },
    ]

    const errorTabs = [{
        key: 'home',
        title: '首页',
        icon: <AppOutline/>,
    }, {
        key: 'login',
        title: '去登陆',
        icon: <UserOutline/>,
    }, {
        key: 'setting',
        title: '设置',
        icon: <SetOutline/>,
    }]

    const changeTabBar = (e: string) => {
        setActiveKey(e);
        if (location.pathname !== `/${e}`) {
            navigate(`/m/${e}`);
        }
    }

    const showTabs = getTabs();


    return (
        <TabBar activeKey={activeKey} onChange={e => changeTabBar(e)}>
            {showTabs.map(item => (
                <TabBar.Item key={item.key} icon={item.icon} title={item.title}/>
            ))}
        </TabBar>
    )
}

export default Home;
