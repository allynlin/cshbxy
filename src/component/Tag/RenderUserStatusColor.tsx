/**
 * 根据数值返回对应的颜色
 * @param {number} status 状态。0：待审核，1：审核通过，2：审核不通过
 * @return {string} 颜色
 * update 2022-10-07
 */
import {blue, green, red} from "../../baseInfo";

export const RenderUserStatusColor = (text: string) => {
    switch (text) {
        case 'Normal':
        case '正常':
            return green;
        case 'Disabled':
        case '禁用':
            return red;
        default:
            return blue;
    }
}
