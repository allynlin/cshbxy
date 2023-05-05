import {Menu} from 'antd';
import {
    BarChartOutlined,
    EditOutlined,
    FormOutlined,
    HomeOutlined,
    Loading3QuartersOutlined,
    LoginOutlined,
    ProjectOutlined,
    TeamOutlined,
} from '@ant-design/icons';
import React, {useEffect, useState} from 'react';
import {Link, useLocation} from 'react-router-dom';
import {useSelector} from "react-redux";
import type {MenuProps} from 'antd/es/menu';

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
    type?: 'group',
): MenuItem {
    return {
        key,
        icon,
        children,
        label,
        type,
    } as MenuItem;
}

export const SliderMenu: React.FC = () => {

    const [activeKey, setActiveKey] = useState<string>('');

    const location = useLocation()

    const userType = useSelector((state: any) => state.userType.value)
    const userInfo = useSelector((state: any) => state.userInfo.value);
    const isLogin = useSelector((state: any) => state.isLogin.value)

    useEffect(() => {
        setActiveKey(location.pathname)
    }, [location.pathname])

    const employee: MenuProps['items'] = [
        getItem((<Link
            to={'/home'}>首页</Link>), '/home', <HomeOutlined/>),
        getItem("申请", 'apply', <EditOutlined/>, [
            getItem((
                <Link
                    to={'departmentChange-apply'}>部门变更</Link>), '/departmentChange-apply'),
            getItem((<Link
                to={'/travel-apply'}>差旅报销</Link>), '/travel-apply'),
            getItem((
                <Link
                    to={'/leave-apply'}>请假</Link>), '/leave-apply'),
            getItem((<Link
                to={'/procurement-apply'}>采购</Link>), '/procurement-apply'),
            getItem((<Link
                to={'/workReport-apply'}>工作报告</Link>), '/workReport-apply'),
        ]),
        getItem("申请记录", 'record',
            <BarChartOutlined/>, [
                getItem((
                    <Link
                        to={'/departmentChange-Record'}>部门变更</Link>), '/departmentChange-Record'),
                getItem((<Link
                    to={'/travel-Record'}>差旅报销</Link>), '/travel-Record'),
                getItem((<Link
                    to={'/leave-Record'}>请假</Link>), '/leave-Record'),
                getItem((
                    <Link
                        to={'/procurement-Record'}>采购</Link>), '/procurement-Record'),
                getItem((<Link
                    to={'/workReport-Record'}>工作报告</Link>), '/workReport-Record'),
            ]),
    ];
    const department: MenuProps['items'] = [
        getItem((<Link
            to={'/home'}>首页</Link>), '/home', <HomeOutlined/>),
        getItem((<Link
                to={'/departmentRegister'}>添加用户</Link>), '/departmentRegister',
            <FormOutlined/>),
        getItem(<Link
                to={'/departmentUser-management'}>用户管理</Link>, '/departmentUser-management',
            <TeamOutlined/>),
    ];
    const leader: MenuProps['items'] = [
        getItem((<Link
            to={'/home'}>首页</Link>), '/home', <HomeOutlined/>),
        getItem("审批", 'approve',
            <ProjectOutlined/>, [
                getItem(<Link
                    to={'/departmentChange-approval'}>部门变更</Link>, '/departmentChange-approval'),
                getItem(<Link to={'/leave-approval'}>请假</Link>, '/leave-approval'),
                getItem(<Link to={'/travel-approval'}>差旅报销</Link>, '/travel-approval'),
                getItem(<Link
                    to={'/procurement-approval'}>采购</Link>, '/procurement-approval'),
                getItem(<Link
                    to={'/workReport-approval'}>工作报告</Link>, '/workReport-approval'),
            ]),
    ];
    const adminMenu: MenuProps['items'] = [
        getItem((<Link
            to={'/home'}>首页</Link>), '/home', <HomeOutlined/>),
        getItem(<Link
                to={'/user-management'}>用户管理</Link>, '/user-management',
            <TeamOutlined/>),
        getItem((<Link
                to={'/register'}>添加部门/领导</Link>), '/register',
            <FormOutlined/>),
        getItem(<Link
                to={'/process-management'}>流程管理</Link>, '/process-management',
            <Loading3QuartersOutlined/>),
    ];
    const errorMenu: MenuProps['items'] = [
        getItem((<Link
                to={'/login'}>登录</Link>), '/login',
            <LoginOutlined/>)
    ];

    const getMenu = () => {
        if (!isLogin) {
            return errorMenu
        }
        if (userInfo.username === 'admin') {
            return adminMenu;
        }
        switch (userType) {
            case 'Employee':
                return employee;
            case 'Department':
                return department;
            case 'Leader':
                return leader;
            default:
                return errorMenu;
        }
    }

    return (
        <Menu
            selectedKeys={[activeKey]}
            mode='inline'
            items={getMenu()}
        />
    )
}