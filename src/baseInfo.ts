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

export const controls = ['undo', 'redo', 'separator', 'font-family', 'font-size', 'line-height', 'letter-spacing', 'separator', 'text-color', 'bold', 'italic', 'underline', 'strike-through', 'separator', 'superscript', 'subscript', 'remove-styles', 'emoji', 'separator', 'text-indent', 'text-align', 'separator', 'headings', 'list-ol', 'list-ul', 'blockquote', 'code', 'separator', 'link', 'hr', 'separator', 'clear', 'fullscreen'];
