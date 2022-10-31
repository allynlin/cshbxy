/**
 * 根据数值返回对应的颜色
 * @param {number} status 状态。0：待审核，1：审核通过，2：审核不通过
 * @return {string} 颜色
 * update 2022-10-07
 */
import {blue, green, red, yellow} from "../../baseInfo";

export const RenderStatusColor = (text: number) => {
    switch (text) {
        case 0:
            return yellow;
        case 1:
            return green;
        case 2:
            return red;
        default:
            return blue;
    }
}
