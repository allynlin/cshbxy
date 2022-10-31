import {Breadcrumb} from "antd";
import React, {useEffect, useState} from "react";
import {Link, useLocation} from "react-router-dom";
import {useSelector} from "react-redux";

const RenderBreadcrumb = () => {
    const location = useLocation();

    const [isEnglish, setIsEnglish] = useState(true);

    const userLanguage: String = useSelector((state: {
        userLanguage: {
            value: 'Chinese' | 'English'
        }
    }) => state.userLanguage.value)

    useEffect(() => {
        setIsEnglish(userLanguage === 'English')
    }, [userLanguage])

    const breadcrumbNameMap: Record<string, string> = {
        '/home': isEnglish ? 'OA' : 'OA 系统',
        '/home/teacher': isEnglish ? 'Teacher' : '教师',
        '/home/departments': isEnglish ? 'Department' : '部门',
        '/home/leader': isEnglish ? 'Leader' : '领导',
        '/home/teacher/index': isEnglish ? 'Home' : '首页',
        '/home/department/index': isEnglish ? 'Home' : '首页',
        '/home/leader/index': isEnglish ? 'Home' : '首页',
        '/home/teacher/apply': isEnglish ? 'Apply' : '申请',
        '/home/teacher/apply/departmentChange': isEnglish ? 'Departmental change' : '部门变更申请',
        '/home/teacher/apply/travelReimbursement': isEnglish ? 'Travel reimbursement' : '差旅报销申请',
        '/home/teacher/apply/leave': isEnglish ? 'Travel reimbursement' : '请假申请',
        '/home/teacher/apply/procurement': isEnglish ? 'Leave' : '采购申请',
        '/home/teacher/apply/report': isEnglish ? 'Work report' : '工作报告',
        '/home/teacher/record': isEnglish ? 'Report' : '记录',
        '/home/teacher/record/departmentChange': isEnglish ? 'Travel reimbursement' : '部门变更申请记录',
        '/home/teacher/record/travelReimbursement': isEnglish ? 'Travel reimbursement' : '差旅报销申请记录',
        '/home/teacher/record/leave': isEnglish ? 'Travel reimbursement' : '请假申请记录',
        '/home/teacher/record/procurement': isEnglish ? 'Travel reimbursement' : '采购申请记录',
        '/home/teacher/record/report': isEnglish ? 'Travel reimbursement' : '工作报告记录',
        '/home/teacher/setting': isEnglish ? 'Travel reimbursement' : '设置',
    };
    const pathSnippets = location.pathname.split('/').filter((i) => i);
    const extraBreadcrumbItems = pathSnippets.map((_, index) => {
        const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
        // '/home' 不可以点击
        if (index < 2) {
            return (
                <Breadcrumb.Item key={url}>
                    {breadcrumbNameMap[url]}
                </Breadcrumb.Item>
            )
        }
        return (
            <Breadcrumb.Item key={url}>
                <Link to={url}>{breadcrumbNameMap[url]}</Link>
            </Breadcrumb.Item>
        );
    });
    const breadcrumbItems = [
        <Breadcrumb.Item key="home">
            {/*<Link to="/home">首页</Link>*/}
        </Breadcrumb.Item>,
    ].concat(extraBreadcrumbItems);
    return (
        <Breadcrumb>{breadcrumbItems}</Breadcrumb>
    )
}


export default RenderBreadcrumb;
