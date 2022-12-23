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
    const [menuList, setMenuList] = useState<MenuItem[]>([]);

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
                    to={'departmentChange-apply'}>{intl.get('departmentChange')}</Link>), '/departmentChange-apply'),
            getItem((<Link
                to={'/travel-apply'}>{intl.get('travelReimburse')}</Link>), '/travel-apply'),
            getItem((
                <Link to={'/leave-apply'}>{intl.get('leave')}</Link>), '/leave-apply'),
            getItem((<Link
                to={'/procurement-apply'}>{intl.get('procurement')}</Link>), '/procurement-apply'),
            getItem((<Link
                to={'/workReport-apply'}>{intl.get('workReport')}</Link>), '/workReport-apply'),
        ]),
        getItem(intl.get('record'), 'record', <BarChartOutlined/>, [
            getItem((
                <Link
                    to={'/departmentChange-record'}>{intl.get('departmentChange')}</Link>), '/departmentChange-record'),
            getItem((<Link
                to={'/travel-record'}>{intl.get('travelReimburse')}</Link>), '/travel-record'),
            getItem((<Link
                to={'/leave-record'}>{intl.get('leave')}</Link>), '/leave-record'),
            getItem((
                <Link to={'/procurement-record'}>{intl.get('procurement')}</Link>), '/procurement-record'),
            getItem((<Link
                to={'/workReport-record'}>{intl.get('workReport')}</Link>), '/workReport-record'),
        ]),
        getItem((<Link to={'/setting'}>{intl.get('setting')}</Link>), '/setting',
            <FormOutlined/>)
    ];
    const department: MenuProps['items'] = [
        getItem((<Link to={'/home'}>{intl.get('home')}</Link>), '/home', <HomeOutlined/>),
        // getItem(intl.get('approve'), 'approve', <ProjectOutlined/>, [
        //     getItem(<Link
        //         to={'/departmentChange-approval'}>{intl.get('departmentChange')}</Link>, '/departmentChange-approval'),
        //     getItem(<Link to={'/leave-approval'}>{intl.get('leave')}</Link>, '/leave-approval'),
        //     getItem(<Link to={'/travel-approval'}>{intl.get('travelReimburse')}</Link>, '/travel-approval'),
        //     getItem(<Link
        //         to={'/procurement-approval'}>{intl.get('procurement')}</Link>, '/procurement-approval'),
        //     getItem(<Link
        //         to={'/workReport-approval'}>{intl.get('workReport')}</Link>, '/workReport-approval'),
        // ]),
        getItem(<Link
                to={'/departmentUser-management'}>{intl.get('departmentUser')}</Link>, '/departmentUser-management',
            <TeamOutlined/>),
        getItem((<Link to={'/setting'}>{intl.get('setting')}</Link>), '/setting',
            <FormOutlined/>)
    ];
    const leader: MenuProps['items'] = [
        getItem((<Link to={'/home'}>{intl.get('home')}</Link>), '/home', <HomeOutlined/>),
        getItem(intl.get('approve'), 'approve', <ProjectOutlined/>, [
            getItem(<Link
                to={'/departmentChange-approval'}>{intl.get('departmentChange')}</Link>, '/departmentChange-approval'),
            getItem(<Link to={'/leave-approval'}>{intl.get('leave')}</Link>, '/leave-approval'),
            getItem(<Link to={'/travel-approval'}>{intl.get('travelReimburse')}</Link>, '/travel-approval'),
            getItem(<Link
                to={'/procurement-approval'}>{intl.get('procurement')}</Link>, '/procurement-approval'),
            getItem(<Link
                to={'/workReport-approval'}>{intl.get('workReport')}</Link>, '/workReport-approval'),
        ]),
        getItem((<Link to={'/setting'}>{intl.get('setting')}</Link>), '/setting',
            <FormOutlined/>)
    ];
    const adminMenu: MenuProps['items'] = [
        getItem((<Link to={'/home'}>{intl.get('home')}</Link>), '/home', <HomeOutlined/>),
        getItem(<Link
            to={'/user-management'}>{intl.get('userManagement')}</Link>, '/user-management', <TeamOutlined/>),
        getItem(<Link
                to={'/process-management'}>{intl.get('processManagement')}</Link>, '/process-management',
            <Loading3QuartersOutlined/>),
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
    const userLanguage = useSelector((state: any) => state.userLanguage.value);
    const isLogin = useSelector((state: any) => state.isLogin.value)

    useEffect(() => {
        if (!isLogin) {
            setMenuList(errorMenu)
            return;
        }
        if (userInfo.username === 'admin') {
            setMenuList(adminMenu);
            return
        }
        switch (userType) {
            case 'Employee':
                setMenuList(employee)
                break;
            case 'Department':
                setMenuList(department)
                break;
            case 'Leader':
                setMenuList(leader)
                break;
            default:
                setMenuList(errorMenu)
        }
    }, [userLanguage])

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
            mode={menuModeSlice === 'inline' ? 'inline' : 'vertical'}
            items={getMenu()}
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
