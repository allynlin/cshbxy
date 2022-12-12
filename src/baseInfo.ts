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

// 色彩
export const red = '#f32401';
export const green = '#006c01';
export const yellow = '#ff8d00';
export const blue = '#40a9ff';
export const purple = '#9254de';
export const orange5 = '#ffa940';
export const lime7 = '#7cb305';

export const greenButton = {
    backgroundColor: green,
    borderColor: green,
}

export const redButton = {
    backgroundColor: red,
    borderColor: red,
}

export const yellowButton = {
    backgroundColor: yellow,
    borderColor: yellow,
}
