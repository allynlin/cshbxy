/**
 * 根据数值返回对应的颜色
 * @return {string} 颜色
 * update 2022-10-07
 * @param text
 */

export const RenderWatermarkColor = (text: number) => {

    switch (text) {
        case 0:
            return 'rgba(0,0,0,.15)';
        case 1:
            return 'rgba(0,108,1,0.3)';
        case 2:
            return 'rgba(243,36,1,0.3)';
        default:
            return 'rgba(64,169,255,0.3)';
    }
}
