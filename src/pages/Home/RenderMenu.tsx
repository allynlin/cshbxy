import {Button, Menu} from 'antd';
import {
    BarChartOutlined,
    EditOutlined,
    FormOutlined,
    HomeOutlined,
    ProjectOutlined,
} from '@ant-design/icons';
import React, {useEffect, useState} from 'react';
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

    const [isEnglish, setIsEnglish] = useState(true);

    const userLanguage: String = useSelector((state: {
        userLanguage: {
            value: 'Chinese' | 'English'
        }
    }) => state.userLanguage.value)

    useEffect(() => {
        setIsEnglish(userLanguage === 'English')
    }, [userLanguage])

    const teacher: MenuProps['items'] = [
        getItem((<Link to={'/home/teacher'}>{isEnglish ? 'Home' : '首页'}</Link>), 'Home',
            <HomeOutlined/>),
        getItem(intl.get('apply'), 'apply', <EditOutlined/>, [
            getItem((
                <Link
                    to={'/home/apply/departmentChange'}>{intl.get('DepartmentChange')}</Link>), 'teacherApplyDepartmentChange'),
            getItem((<Link
                to={'/home/apply/travelReimbursement'}>{intl.get('TravelReimbursement')}</Link>), 'teacherApplyTravelReimbursement'),
            getItem((
                <Link to={'/home/apply/leave'}>{intl.get('Leave')}</Link>), 'teacherApplyLeave'),
            getItem((<Link
                to={'/home/apply/procurement'}>{intl.get('Procurement')}</Link>), 'teacherApplyProcurement'),
            getItem((<Link
                to={'/home/apply/report'}>工作报告</Link>), 'teacherApplyReport'),
        ]),
        getItem(intl.get('Record'), 'record', <BarChartOutlined/>, [
            getItem((
                <Link
                    to={'/home/record/departmentChange'}>{isEnglish ? 'Travel Reimbursement Record' : '部门变更记录'}</Link>), 'teacherRecordLeaveList'),
            getItem((<Link
                to={'/home/record/travelReimbursement'}>{isEnglish ? 'Travel Reimbursement Record' : '差旅报销记录'}</Link>), 'teacherTravelReimbursement'),
            getItem((<Link
                to={'/home/record/leave'}>{isEnglish ? 'Leave Record' : '请假记录'}</Link>), 'teacherRecordLeave'),
            getItem((<Link to={'/home/record/procurement'}>采购申请记录</Link>), 'leaveProcurement'),
            getItem((<Link
                to={'/home/record/report'}>{isEnglish ? 'WorkReport Record' : '工作报告记录'}</Link>), 'teacherRecordReport'),
        ]),
        getItem((<Link to={'/home/setting'}>{isEnglish ? 'Setting' : '设置'}</Link>), 'Setting',
            <FormOutlined/>)
    ];
    const department: MenuProps['items'] = [
        getItem((<Link to={'/home/department'}>首页</Link>), 'Home', <HomeOutlined/>),
        getItem('审批', 'approval', <ProjectOutlined/>, [
            getItem(<Link to={'/home/approval/departmentChange'}>部门变更</Link>, 'changeDepartment'),
            getItem(<Link to={'/home/approval/leave'}>请假</Link>, 'leave'),
            getItem(<Link to={'/home/approval/travelReimbursement'}>差旅报销</Link>, 'travel'),
            getItem(<Link to={'/home/approval/procurement'}>采购</Link>, 'procurement'),
            getItem(<Link to={'/home/approval/workReport'}>工作报告</Link>, 'workReport'),
        ]),
        getItem((<Link to={'/home/setting'}>{isEnglish ? 'Setting' : '设置'}</Link>), 'Setting',
            <FormOutlined/>)
    ];
    const leader: MenuProps['items'] = [
        getItem((<Link to={'/home/leader'}>首页</Link>), 'Home', <HomeOutlined/>),
        getItem('审批', 'approval', <ProjectOutlined/>, [
            getItem(<Link to={'/home/approval/departmentChange'}>部门变更</Link>, 'changeDepartment'),
            getItem(<Link to={'/home/approval/leave'}>请假</Link>, 'leave'),
            getItem(<Link to={'/home/approval/travelReimbursement'}>差旅报销</Link>, 'travel'),
            getItem(<Link to={'/home/approval/procurement'}>采购</Link>, 'procurement'),
            getItem(<Link to={'/home/approval/workReport'}>工作报告</Link>, 'workReport'),
        ]),
        getItem((<Link to={'/home/setting'}>{isEnglish ? 'Setting' : '设置'}</Link>), 'Setting',
            <FormOutlined/>)
    ];
    const defaultMenu: MenuProps['items'] = [];

    const themeColor: String = useSelector((state: {
        themeColor: {
            value: 'light' | 'dark'
        }
    }) => state.themeColor.value)

    const userType = useSelector((state: {
        userType: {
            value: string
        }
    }) => state.userType.value)

    const menuModeSlice = useSelector((state: {
        menuMode: {
            value: string
        }
    }) => state.menuMode.value)

    const isLogin = useSelector((state: {
        isLogin: {
            value: boolean
        }
    }) => state.isLogin.value)

    // const [theme, setTheme] = useState('light');
    const RenderMenu = (): MenuProps['items'] => {
        switch (userType) {
            case 'teacher':
                return teacher
            case 'department':
                return department
            case 'leader':
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
                <Link to={'/login'}>重新登录</Link>
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
