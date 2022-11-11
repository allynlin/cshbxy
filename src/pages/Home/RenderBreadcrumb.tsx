import {Breadcrumb} from "antd";
import React from "react";
import {Link, useLocation} from "react-router-dom";
import intl from "react-intl-universal";

const RenderBreadcrumb = () => {
    const location = useLocation();

    const breadcrumbNameMap: Record<string, string> = {
        '/home': intl.get('sysName'),
        '/home/employee': intl.get('employee'),
        '/home/department': intl.get('department'),
        '/home/leader': intl.get('leader'),
        '/home/setting': intl.get('setting'),
        '/home/success': intl.get('success'),
        '/home/apply': intl.get('apply'),
        '/home/apply/departmentChange': intl.get('departmentChange'),
        '/home/apply/travel': intl.get('travelReimburse'),
        '/home/apply/leave': intl.get('leave'),
        '/home/apply/procurement': intl.get('procurement'),
        '/home/apply/workReport': intl.get('workReport'),
        '/home/record': intl.get('record'),
        '/home/record/departmentChange': intl.get('departmentChange'),
        '/home/record/travel': intl.get('travelReimburse'),
        '/home/record/leave': intl.get('leave'),
        '/home/record/procurement': intl.get('procurement'),
        '/home/record/workReport': intl.get('workReport'),
        '/home/approval': intl.get('approve'),
        '/home/approval/departmentChange': intl.get('departmentChange'),
        '/home/approval/leave': intl.get('leave'),
        '/home/approval/travel': intl.get('travelReimburse'),
        '/home/approval/procurement': intl.get('procurement'),
        '/home/approval/workReport': intl.get('workReport'),
        '/home/management': intl.get('management'),
        '/home/management/user': intl.get('userManagement'),
        '/home/management/departmentUser': intl.get('departmentUser'),
        '/home/management/process': intl.get('processManagement'),
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
