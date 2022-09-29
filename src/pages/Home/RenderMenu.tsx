import {Menu, MenuProps} from 'antd';
import {EditOutlined, FormOutlined, BarChartOutlined, HomeOutlined, CommentOutlined} from '@ant-design/icons';
import React from 'react';
import './index.scss'
import {Link} from 'react-router-dom';
import {useSelector} from "react-redux";

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

const teacher: MenuProps['items'] = [
    getItem((<Link to={'/home/teacher/index'}>首页</Link>), 'teacherHome', <HomeOutlined/>),
    getItem('申请', 'apply', <EditOutlined/>, [
        getItem((
            <Link to={'/home/teacher/apply/departmentChange'}>部门变更申请</Link>), 'teacherApplyDepartmentChange'),
        getItem((<Link
            to={'/home/teacher/apply/travelReimbursement'}>差旅报销申请</Link>), 'teacherApplyTravelReimbursement'),
        getItem((<Link to={'/home/teacher/apply/leave'}>请假申请</Link>), 'teacherApplyLeave'),
        getItem((<Link to={'/home/teacher/apply/procurement'}>采购申请</Link>), 'teacherApplyProcurement'),
        getItem((<Link to={'/home/teacher/apply/report'}>工作报告</Link>), 'teacherApplyReport'),
    ]),
    getItem('申请记录', 'record', <BarChartOutlined/>, [
        getItem((<Link to={'/home/teacher/record/departmentChange'}>部门变更申请记录</Link>), 'teacherRecordLeaveList'),
        getItem((<Link
            to={'/home/teacher/record/travelReimbursement'}>差旅报销申请记录</Link>), 'teacherTravelReimbursement'),
        getItem((<Link to={'/home/teacher/record/leave'}>请假申请记录</Link>), 'teacherRecordLeave'),
        getItem((<Link to={'/home/teacher/record/procurement'}>采购申请记录</Link>), 'leaveProcurement'),
        getItem((<Link to={'/home/teacher/record/report'}>工作报告记录</Link>), 'teacherRecordReport'),
    ]),
];
const department: MenuProps['items'] = [
    getItem((<Link to={'/home/department'}>首页</Link>), 'department', <HomeOutlined/>),
    getItem('申请', 'apply', <FormOutlined/>, [
        getItem((<Link to={'/home/department/Apply/notice'}>发布公告</Link>), 'notice'),
        getItem((<Link to={'/home/department/Apply/departmentChange'}>部门变更申请</Link>), 'departmentChange'),
    ]),
    getItem('审批记录', 'sub4', <BarChartOutlined/>, [
        getItem('请假记录', '9'),
        getItem('活动记录', '10')
    ]),
];
const leader: MenuProps['items'] = [
    getItem((<Link to={'/home/department'}>首页</Link>), 'home', <HomeOutlined/>),
    getItem('申请', 'apply', <FormOutlined/>, [
        getItem((<Link to={'/home/department/Apply/notice'}>发布公告</Link>), 'notice'),
        getItem((<Link to={'/home/department/Apply/departmentChange'}>部门变更申请</Link>), 'departmentChange'),
    ]),
    getItem('通知', 'notion', <CommentOutlined/>, [
        getItem((<Link to={'/notion/add'}>发布通知</Link>), 'add'),
        getItem((<Link to={'/notion/show'}>正在展示的通知</Link>), 'show'),
    ]),
    getItem('审批记录', 'sub4', <BarChartOutlined/>, [
        getItem('请假记录', '9'),
        getItem('活动记录', '10')
    ]),
];
const defaultMenu: MenuProps['items'] = [];

const RenderMenu: React.FC = () => {
    const userType = useSelector((state: {
        userType: {
            value: string
        }
    }) => state.userType.value)
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
    return (
        <Menu
            theme={"light"}
            mode="inline"
            items={menu}
            style={{minWidth: 0, flex: 'auto'}}
        />
    )
}

export default RenderMenu;