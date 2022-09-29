import {Breadcrumb} from "antd";
import React from "react";
import {Link, useLocation} from "react-router-dom";

const RenderBreadcrumb = () => {
    const location = useLocation();
    const breadcrumbNameMap: Record<string, string> = {
        '/home': 'OA 系统',
        '/home/teacher': '教师',
        '/home/departments': '部门',
        '/home/leader': '领导',
        '/home/teacher/index': '首页',
        '/home/department/index': '首页',
        '/home/leader/index': '首页',
        '/home/teacher/apply': '申请',
        '/home/teacher/apply/departmentChange': '部门变更申请',
        '/home/teacher/apply/travelReimbursement': '差旅报销申请',
        '/home/teacher/apply/leave': '请假申请',
        '/home/teacher/apply/procurement': '采购申请',
        '/home/teacher/apply/report': '工作报告',
        '/home/teacher/record/departmentChange': '部门变更申请记录',
        '/home/teacher/record/travelReimbursement': '差旅报销申请记录',
        '/home/teacher/record/leave': '请假申请记录',
        '/home/teacher/record/procurement': '采购申请记录',
        '/home/teacher/record/report': '工作报告记录',
    };
    const pathSnippets = location.pathname.split('/').filter((i) => i);
    const extraBreadcrumbItems = pathSnippets.map((_, index) => {
        const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
        // '/home' 不可以点击
        if (index < 4) {
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