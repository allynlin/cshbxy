import pa from '../package.json';

export const version = pa.version;

// export const BaseInfo = 'http://localhost:8080/cshbxy';
// export const BaseInfo = 'http://localhost:8086/cshbxy';
export const BaseInfo = 'https://www.allynlin.site:8080/cshbxy';

export const DownLoadURL = `${BaseInfo}/api`;

export const winTo = (url: string) => {
    window.location.href = `${process.env.PUBLIC_URL}${url}`
}

export const winRe = (url: string) => {
    window.location.replace(`${process.env.PUBLIC_URL}${url}`)
}