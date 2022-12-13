/**
 * 根据数值返回对应的颜色
 * @return {string} 颜色
 * update 2022-10-07
 * @param text
 */

export const RenderStatusColor = (text: number) => {

    switch (text) {
        case 0:
            return '#ff8d00';
        case 1:
            return '#006c01';
        case 2:
            return '#f32401';
        default:
            return '#40a9ff';
    }
}
