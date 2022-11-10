import {Button, Menu} from 'antd';
import {
    BarChartOutlined,
    BarsOutlined,
    EditOutlined,
    FormOutlined,
    HomeOutlined,
    ProjectOutlined,
} from '@ant-design/icons';
import React from 'react';
import './playOut-light.scss'
import {Link} from 'react-router-dom';
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

    const employee: MenuProps['items'] = [
        getItem((<Link to={'/home/employee'}>{intl.get('home')}</Link>), 'Home',
            <HomeOutlined/>),
        getItem(intl.get('apply'), 'apply', <EditOutlined/>, [
            getItem((
                <Link
                    to={'/home/apply/departmentChange'}>{intl.get('departmentChange')}</Link>), 'apply_departmentChange'),
            getItem((<Link
                to={'/home/apply/travel'}>{intl.get('travelReimburse')}</Link>), 'apply_travel'),
            getItem((
                <Link to={'/home/apply/leave'}>{intl.get('leave')}</Link>), 'apply_leave'),
            getItem((<Link
                to={'/home/apply/procurement'}>{intl.get('procurement')}</Link>), 'apply_procurement'),
            getItem((<Link
                to={'/home/apply/workReport'}>{intl.get('workReport')}</Link>), 'apply_workReport'),
        ]),
        getItem(intl.get('record'), 'record', <BarChartOutlined/>, [
            getItem((
                <Link
                    to={'/home/record/departmentChange'}>{intl.get('departmentChange')}</Link>), 'record_departmentChange'),
            getItem((<Link
                to={'/home/record/travel'}>{intl.get('travelReimburse')}</Link>), 'record_travel'),
            getItem((<Link
                to={'/home/record/leave'}>{intl.get('leave')}</Link>), 'record_leave'),
            getItem((<Link to={'/home/record/procurement'}>{intl.get('procurement')}</Link>), 'record_procurement'),
            getItem((<Link
                to={'/home/record/workReport'}>{intl.get('workReport')}</Link>), 'record_workReport'),
        ]),
        getItem((<Link to={'/home/setting'}>{intl.get('setting')}</Link>), 'Setting',
            <FormOutlined/>)
    ];
    const department: MenuProps['items'] = [
        getItem((<Link to={'/home/department'}>{intl.get('home')}</Link>), 'Home', <HomeOutlined/>),
        getItem(intl.get('approve'), 'approve', <ProjectOutlined/>, [
            getItem(<Link
                to={'/home/approval/departmentChange'}>{intl.get('departmentChange')}</Link>, 'departmentChange'),
            getItem(<Link to={'/home/approval/leave'}>{intl.get('leave')}</Link>, 'leave'),
            getItem(<Link to={'/home/approval/travel'}>{intl.get('travelReimburse')}</Link>, 'travel'),
            getItem(<Link to={'/home/approval/procurement'}>{intl.get('procurement')}</Link>, 'procurement'),
            getItem(<Link to={'/home/approval/workReport'}>{intl.get('workReport')}</Link>, 'workReport'),
        ]),
        getItem((<Link to={'/home/setting'}>{intl.get('setting')}</Link>), 'Setting',
            <FormOutlined/>)
    ];
    const leader: MenuProps['items'] = [
        getItem((<Link to={'/home/leader'}>{intl.get('home')}</Link>), 'Home', <HomeOutlined/>),
        getItem(intl.get('approve'), 'approval', <ProjectOutlined/>, [
            getItem(<Link
                to={'/home/approval/departmentChange'}>{intl.get('departmentChange')}</Link>, 'changeDepartment'),
            getItem(<Link to={'/home/approval/leave'}>{intl.get('leave')}</Link>, 'leave'),
            getItem(<Link to={'/home/approval/travel'}>{intl.get('travelReimburse')}</Link>, 'travel'),
            getItem(<Link to={'/home/approval/procurement'}>{intl.get('procurement')}</Link>, 'procurement'),
            getItem(<Link to={'/home/approval/workReport'}>{intl.get('workReport')}</Link>, 'workReport'),
        ]),
        getItem((<Link to={'/home/setting'}>{intl.get('setting')}</Link>), 'Setting',
            <FormOutlined/>)
    ];
    const adminMenu: MenuProps['items'] = [
        getItem((<Link to={'/home/leader'}>{intl.get('home')}</Link>), 'Home', <HomeOutlined/>),
        getItem(intl.get('management'), 'management', <BarsOutlined/>, [
            getItem(<Link
                to={'/home/management/user'}>{intl.get('userManagement')}</Link>, 'changeDepartment'),
        ]),
        getItem((<Link to={'/home/setting'}>{intl.get('setting')}</Link>), 'Setting',
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
