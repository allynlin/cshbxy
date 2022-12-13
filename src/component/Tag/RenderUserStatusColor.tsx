/**
 * 根据数值返回对应的颜色
 * @return {string} 颜色
 * update 2022-10-07
 * @param text
 */

export const RenderUserStatusColor = (text: string) => {

    switch (text) {
        case 'Normal':
        case '正常':
            return '#006c01';
        case 'Disabled':
        case '禁用':
            return '#f32401';
        default:
            return '#40a9ff';
    }
}
