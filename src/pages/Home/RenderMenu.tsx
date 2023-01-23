import {Menu} from 'antd';
import {
    BarChartOutlined,
    EditOutlined,
    FormOutlined,
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
import {useGaussianBlurStyles} from "../../styles/gaussianBlurStyle";

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
    label: React.ReactNode,
    key: React.Key,
    popupClassName?: string,
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
        popupClassName,
    } as MenuItem;
}

export const SliderMenu: React.FC = () => {

    const [activeKey, setActiveKey] = useState<string>('');

    const location = useLocation()

    const userType = useSelector((state: any) => state.userType.value)
    const menuModeSlice = useSelector((state: any) => state.menuMode.value)
    const userInfo = useSelector((state: any) => state.userInfo.value);
    const isLogin = useSelector((state: any) => state.isLogin.value)
    const gaussianBlur = useSelector((state: any) => state.gaussianBlur.value)

    const gaussianBlurStyles = useGaussianBlurStyles();

    useEffect(() => {
        setActiveKey(location.pathname)
    }, [location.pathname])

    const employee: MenuProps['items'] = [
        getItem(intl.get('apply'), 'apply', gaussianBlur ? gaussianBlurStyles.gaussianBlurMenu : '', <EditOutlined/>, [
            getItem((
                <Link
                    to={'departmentChange-apply'}>{intl.get('departmentChange')}</Link>), '/departmentChange-apply'),
            getItem((<Link
                to={'/travel-apply'}>{intl.get('travelReimburse')}</Link>), '/travel-apply'),
            getItem((
                <Link
                    to={'/leave-apply'}>{intl.get('leave')}</Link>), '/leave-apply'),
            getItem((<Link
                to={'/procurement-apply'}>{intl.get('procurement')}</Link>), '/procurement-apply'),
            getItem((<Link
                to={'/workReport-apply'}>{intl.get('workReport')}</Link>), '/workReport-apply'),
        ]),
        getItem(intl.get('record'), 'record', gaussianBlur ? gaussianBlurStyles.gaussianBlurMenu : '',
            <BarChartOutlined/>, [
                getItem((
                    <Link
                        to={'/departmentChange-Record'}>{intl.get('departmentChange')}</Link>), '/departmentChange-Record'),
                getItem((<Link
                    to={'/travel-Record'}>{intl.get('travelReimburse')}</Link>), '/travel-Record'),
                getItem((<Link
                    to={'/leave-Record'}>{intl.get('leave')}</Link>), '/leave-Record'),
                getItem((
                    <Link
                        to={'/procurement-Record'}>{intl.get('procurement')}</Link>), '/procurement-Record'),
                getItem((<Link
                    to={'/workReport-Record'}>{intl.get('workReport')}</Link>), '/workReport-Record'),
            ]),
    ];
    const department: MenuProps['items'] = [
        getItem((<Link
                to={'/departmentRegister'}>{intl.get('register')}</Link>), '/departmentRegister', gaussianBlur ? gaussianBlurStyles.gaussianBlurMenu : '',
            <FormOutlined/>),
        getItem(<Link
                to={'/departmentUser-management'}>{intl.get('departmentUser')}</Link>, '/departmentUser-management', gaussianBlur ? gaussianBlurStyles.gaussianBlurMenu : '',
            <TeamOutlined/>),
    ];
    const leader: MenuProps['items'] = [
        getItem(intl.get('approve'), 'approve', gaussianBlur ? gaussianBlurStyles.gaussianBlurMenu : '',
            <ProjectOutlined/>, [
                getItem(<Link
                    to={'/departmentChange-approval'}>{intl.get('departmentChange')}</Link>, '/departmentChange-approval'),
                getItem(<Link to={'/leave-approval'}>{intl.get('leave')}</Link>, '/leave-approval'),
                getItem(<Link to={'/travel-approval'}>{intl.get('travelReimburse')}</Link>, '/travel-approval'),
                getItem(<Link
                    to={'/procurement-approval'}>{intl.get('procurement')}</Link>, '/procurement-approval'),
                getItem(<Link
                    to={'/workReport-approval'}>{intl.get('workReport')}</Link>, '/workReport-approval'),
            ]),
    ];
    const adminMenu: MenuProps['items'] = [
        getItem(<Link
                to={'/user-management'}>{intl.get('userManagement')}</Link>, '/user-management', gaussianBlur ? gaussianBlurStyles.gaussianBlurMenu : '',
            <TeamOutlined/>),
        getItem((<Link
                to={'/register'}>{intl.get('addDepartment')}</Link>), '/register', gaussianBlur ? gaussianBlurStyles.gaussianBlurMenu : '',
            <FormOutlined/>),
        getItem(<Link
                to={'/process-management'}>{intl.get('processManagement')}</Link>, '/process-management', gaussianBlur ? gaussianBlurStyles.gaussianBlurMenu : '',
            <Loading3QuartersOutlined/>),
    ];
    const errorMenu: MenuProps['items'] = [
        getItem((<Link
                to={'/login'}>{intl.get('login')}</Link>), '/login', gaussianBlur ? gaussianBlurStyles.gaussianBlurMenu : '',
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
            mode={menuModeSlice === 'inline' ? 'inline' : 'vertical'}
            items={getMenu()}
        />
    )
}

export const HeaderMenu: React.FC = () => {

    const [activeKey, setActiveKey] = useState<string>('');

    const location = useLocation()

    useEffect(() => {
        setActiveKey(location.pathname)
    }, [location.pathname])

    const items: MenuProps['items'] = [
        getItem((<Link
            to={'/home'}>{intl.get('home')}</Link>), '/home'),
        getItem(intl.get('setting'), 'setting', '', '', [
            getItem((<Link
                to={'/setting'}>{intl.get('setting')}</Link>), '/setting'),
            getItem((<Link
                to={'/token'}>{intl.get('tokenSetting')}</Link>), '/token')
        ]),

    ];

    return (
        <Menu
            selectedKeys={[activeKey]}
            mode="horizontal"
            items={items}
        />
    )

}
