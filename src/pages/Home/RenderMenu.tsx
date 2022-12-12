import {Button, Menu} from 'antd';
import {
    BarChartOutlined,
    BarsOutlined,
    EditOutlined,
    FormOutlined,
    HomeOutlined,
    ProjectOutlined,
    LoginOutlined,
} from '@ant-design/icons';
import React, {useEffect, useState} from 'react';
import {Link, useLocation} from 'react-router-dom';
import {useSelector} from "react-redux";
import type {MenuProps} from 'antd/es/menu';
import intl from "react-intl-universal";

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

const RenderMenu = () => {

    const [activeKey, setActiveKey] = useState<string>('');

    const location = useLocation()

    useEffect(() => {
        setActiveKey(location.pathname)
    }, [location.pathname])

    const employee: MenuProps['items'] = [
        getItem((<Link to={'/home'}>{intl.get('home')}</Link>), '/home',
            <HomeOutlined/>),
        getItem(intl.get('apply'), 'apply', <EditOutlined/>, [
            getItem((
                <Link
                    to={'/apply/departmentChange'}>{intl.get('departmentChange')}</Link>), '/apply/departmentChange'),
            getItem((<Link
                to={'/apply/travel'}>{intl.get('travelReimburse')}</Link>), '/apply/travel'),
            getItem((
                <Link to={'/apply/leave'}>{intl.get('leave')}</Link>), '/apply/leave'),
            getItem((<Link
                to={'/apply/procurement'}>{intl.get('procurement')}</Link>), '/apply/procurement'),
            getItem((<Link
                to={'/apply/workReport'}>{intl.get('workReport')}</Link>), '/apply/workReport'),
        ]),
        getItem(intl.get('record'), 'record', <BarChartOutlined/>, [
            getItem((
                <Link
                    to={'/record/departmentChange'}>{intl.get('departmentChange')}</Link>), '/record/departmentChange'),
            getItem((<Link
                to={'/record/travel'}>{intl.get('travelReimburse')}</Link>), '/record/travel'),
            getItem((<Link
                to={'/record/leave'}>{intl.get('leave')}</Link>), '/record/leave'),
            getItem((
                <Link to={'/record/procurement'}>{intl.get('procurement')}</Link>), '/record/procurement'),
            getItem((<Link
                to={'/record/workReport'}>{intl.get('workReport')}</Link>), '/record/workReport'),
        ]),
        getItem((<Link to={'/setting'}>{intl.get('setting')}</Link>), '/setting',
            <FormOutlined/>)
    ];
    const department: MenuProps['items'] = [
        getItem((<Link to={'/home'}>{intl.get('home')}</Link>), '/home', <HomeOutlined/>),
        getItem(intl.get('approve'), 'approve', <ProjectOutlined/>, [
            getItem(<Link
                to={'/approval/departmentChange'}>{intl.get('departmentChange')}</Link>, '/approval/departmentChange'),
            getItem(<Link to={'/approval/leave'}>{intl.get('leave')}</Link>, '/approval/leave'),
            getItem(<Link to={'/approval/travel'}>{intl.get('travelReimburse')}</Link>, '/approval/travel'),
            getItem(<Link
                to={'/approval/procurement'}>{intl.get('procurement')}</Link>, '/approval/procurement'),
            getItem(<Link
                to={'/approval/workReport'}>{intl.get('workReport')}</Link>, '/approval/workReport'),
        ]),
        getItem(intl.get('management'), 'management', <BarsOutlined/>, [
            getItem(<Link
                to={'/management/departmentUser'}>{intl.get('departmentUser')}</Link>, '/management/departmentUser'),
        ]),
        getItem((<Link to={'/setting'}>{intl.get('setting')}</Link>), '/setting',
            <FormOutlined/>)
    ];
    const leader: MenuProps['items'] = [
        getItem((<Link to={'/home'}>{intl.get('home')}</Link>), '/home', <HomeOutlined/>),
        getItem(intl.get('approve'), 'approval', <ProjectOutlined/>, [
            getItem(<Link
                to={'/approval/departmentChange'}>{intl.get('departmentChange')}</Link>, '/approval/departmentChange'),
            getItem(<Link to={'/approval/leave'}>{intl.get('leave')}</Link>, '/approval/leave'),
            getItem(<Link to={'/approval/travel'}>{intl.get('travelReimburse')}</Link>, '/approval/travel'),
            getItem(<Link
                to={'/approval/procurement'}>{intl.get('procurement')}</Link>, '/approval/procurement'),
            getItem(<Link
                to={'/approval/workReport'}>{intl.get('workReport')}</Link>, '/approval/workReport'),
        ]),
        getItem((<Link to={'/setting'}>{intl.get('setting')}</Link>), '/setting',
            <FormOutlined/>)
    ];
    const adminMenu: MenuProps['items'] = [
        getItem((<Link to={'/home'}>{intl.get('home')}</Link>), '/home', <HomeOutlined/>),
        getItem(intl.get('management'), 'management', <BarsOutlined/>, [
            getItem(<Link
                to={'/management/user'}>{intl.get('userManagement')}</Link>, '/management/user'),
            getItem(<Link
                to={'/management/process'}>{intl.get('processManagement')}</Link>, '/management/process'),
        ]),
        getItem((<Link to={'/setting'}>{intl.get('setting')}</Link>), '/setting',
            <FormOutlined/>)
    ];
    const errorMenu: MenuProps['items'] = [
        getItem((<Link to={'/home'}>{intl.get('home')}</Link>), '/home', <HomeOutlined/>),
        getItem((<Link to={'/login'}>{intl.get('login')}</Link>), '/login', <LoginOutlined/>),
        getItem((<Link to={'/register'}>{intl.get('register')}</Link>), '/register', <FormOutlined/>),
        getItem((<Link to={'/setting'}>{intl.get('setting')}</Link>), '/setting',
            <FormOutlined/>)
    ];

    const userType = useSelector((state: any) => state.userType.value)

    const menuModeSlice = useSelector((state: any) => state.menuMode.value)

    const userInfo = useSelector((state: any) => state.userInfo.value);

    const RenderMenu = (): MenuProps['items'] => {
        if (userInfo.username === 'admin') {
            return adminMenu
        }
        switch (userType) {
            case 'Employee':
                return employee
            case 'Department':
                return department
            case 'Leader':
                return leader
            default:
                return errorMenu
        }
    }

    const menu: MenuProps['items'] = RenderMenu()

    return (
        <Menu
            selectedKeys={[activeKey]}
            mode={menuModeSlice === 'inline' ? 'inline' : 'vertical'}
            items={menu}
            defaultSelectedKeys={['Home']}
            style={{
                minWidth: 0,
                flex: 'auto',
                width: '100%'
            }}
        />
    )
}

export default RenderMenu;
