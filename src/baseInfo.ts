import pa from '../package.json';

// 版本号，基础 URL
export const version = pa.version;
export const BaseInfo = 'https://www.allynlin.site:8080/cshbxy';

// 文件管理
export const DownLoadURL = `${BaseInfo}/api`;

export const tableName = {
    workReport: 'WorkReport',
    departmentChange: 'ChangeDepartment',
    travel: 'Travel'
}
