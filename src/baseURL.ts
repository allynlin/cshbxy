// export const BaseURL= 'http://localhost:8080/cshbxy';
// export const BaseURL= 'http://localhost:8086/cshbxy';
export const BaseURL = 'https://www.allynlin.site:8080/cshbxy';

export const winto=(url:string)=>{
    window.location.replace(`${process.env.PUBLIC_URL}${url}`)
}