import {Button, Menu} from 'antd';
import {
    BarChartOutlined,
    BarsOutlined,
    EditOutlined,
    FormOutlined,
    HomeOutlined,
    ProjectOutlined,
} from '@ant-design/icons';
import React, {useEffect, useState} from 'react';
import './playOut.scss'
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
        getItem((<Link to={'/home/employee'}>{intl.get('home')}</Link>), '/home/employee',
            <HomeOutlined/>),
        getItem(intl.get('apply'), 'apply', <EditOutlined/>, [
            getItem((
                <Link
                    to={'/home/apply/departmentChange'}>{intl.get('departmentChange')}</Link>), '/home/apply/departmentChange'),
            getItem((<Link
                to={'/home/apply/travel'}>{intl.get('travelReimburse')}</Link>), '/home/apply/travel'),
            getItem((
                <Link to={'/home/apply/leave'}>{intl.get('leave')}</Link>), '/home/apply/leave'),
            getItem((<Link
                to={'/home/apply/procurement'}>{intl.get('procurement')}</Link>), '/home/apply/procurement'),
            getItem((<Link
                to={'/home/apply/workReport'}>{intl.get('workReport')}</Link>), '/home/apply/workReport'),
        ]),
        getItem(intl.get('record'), 'record', <BarChartOutlined/>, [
            getItem((
                <Link
                    to={'/home/record/departmentChange'}>{intl.get('departmentChange')}</Link>), '/home/record/departmentChange'),
            getItem((<Link
                to={'/home/record/travel'}>{intl.get('travelReimburse')}</Link>), '/home/record/travel'),
            getItem((<Link
                to={'/home/record/leave'}>{intl.get('leave')}</Link>), '/home/record/leave'),
            getItem((
                <Link to={'/home/record/procurement'}>{intl.get('procurement')}</Link>), '/home/record/procurement'),
            getItem((<Link
                to={'/home/record/workReport'}>{intl.get('workReport')}</Link>), '/home/record/workReport'),
        ]),
        getItem((<Link to={'/home/setting'}>{intl.get('setting')}</Link>), '/home/setting',
            <FormOutlined/>)
    ];
    const department: MenuProps['items'] = [
        getItem((<Link to={'/home/department'}>{intl.get('home')}</Link>), '/home/department', <HomeOutlined/>),
        getItem(intl.get('approve'), 'approve', <ProjectOutlined/>, [
            getItem(<Link
                to={'/home/approval/departmentChange'}>{intl.get('departmentChange')}</Link>, '/home/approval/departmentChange'),
            getItem(<Link to={'/home/approval/leave'}>{intl.get('leave')}</Link>, '/home/approval/leave'),
            getItem(<Link to={'/home/approval/travel'}>{intl.get('travelReimburse')}</Link>, '/home/approval/travel'),
            getItem(<Link
                to={'/home/approval/procurement'}>{intl.get('procurement')}</Link>, '/home/approval/procurement'),
            getItem(<Link
                to={'/home/approval/workReport'}>{intl.get('workReport')}</Link>, '/home/approval/workReport'),
        ]),
        getItem(intl.get('management'), 'management', <BarsOutlined/>, [
            getItem(<Link
                to={'/home/management/departmentUser'}>{intl.get('departmentUser')}</Link>, '/home/management/departmentUser'),
        ]),
        getItem((<Link to={'/home/setting'}>{intl.get('setting')}</Link>), '/home/setting',
            <FormOutlined/>)
    ];
    const leader: MenuProps['items'] = [
        getItem((<Link to={'/home/leader'}>{intl.get('home')}</Link>), '/home/leader', <HomeOutlined/>),
        getItem(intl.get('approve'), 'approval', <ProjectOutlined/>, [
            getItem(<Link
                to={'/home/approval/departmentChange'}>{intl.get('departmentChange')}</Link>, '/home/approval/departmentChange'),
            getItem(<Link to={'/home/approval/leave'}>{intl.get('leave')}</Link>, '/home/approval/leave'),
            getItem(<Link to={'/home/approval/travel'}>{intl.get('travelReimburse')}</Link>, '/home/approval/travel'),
            getItem(<Link
                to={'/home/approval/procurement'}>{intl.get('procurement')}</Link>, '/home/approval/procurement'),
            getItem(<Link
                to={'/home/approval/workReport'}>{intl.get('workReport')}</Link>, '/home/approval/workReport'),
        ]),
        getItem((<Link to={'/home/setting'}>{intl.get('setting')}</Link>), '/home/setting',
            <FormOutlined/>)
    ];
    const adminMenu: MenuProps['items'] = [
        getItem((<Link to={'/home/leader'}>{intl.get('home')}</Link>), '/home/leader', <HomeOutlined/>),
        getItem(intl.get('management'), 'management', <BarsOutlined/>, [
            getItem(<Link
                to={'/home/management/user'}>{intl.get('userManagement')}</Link>, '/home/management/user'),
            getItem(<Link
                to={'/home/management/process'}>{intl.get('processManagement')}</Link>, '/home/management/process'),
        ]),
        getItem((<Link to={'/home/setting'}>{intl.get('setting')}</Link>), '/home/setting',
            <FormOutlined/>)
    ];
    const defaultMenu: MenuProps['items'] = [];

    const themeColor: String = useSelector((state: any) => state.themeColor.value)

    const userType = useSelector((state: any) => state.userType.value)

    const menuModeSlice = useSelector((state: any) => state.menuMode.value)

    const isLogin = useSelector((state: any) => state.isLogin.value)

    const userInfo = useSelector((state: any) => state.userInfo.value);

    // const [theme, setTheme] = useState('light');
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
                return defaultMenu
        }
    }

    const menu: MenuProps['items'] = RenderMenu()

    const RenderButton = () => {
        return (
            <Button
                type="primary"
                style={{
                    width: '100%',
                    marginTop: 16,
                    display: 'flex',
                    justifyContent: 'center',
                }}
            >
                <Link to={'/login'}>{intl.get('loginAgain')}</Link>
            </Button>
        )
    }

    return (
        isLogin ?
            (
                <div className={"playout-menu"}>
                    <Menu
                        activeKey={activeKey}
                        mode={menuModeSlice === 'inline' ? 'inline' : 'vertical'}
                        items={menu}
                        defaultSelectedKeys={['Home']}
                        theme={themeColor === 'light' ? 'light' : 'dark'}
                        style={{
                            minWidth: 0,
                            flex: 'auto',
                            width: '100%'
                        }}
                    />
                </div>
            ) :
            (
                <div className={"playout-menu"}>
                    <RenderButton/>
                </div>
            )
    )
}

export default RenderMenu;
