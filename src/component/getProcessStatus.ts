/**
 * 根据流程中的数字，返回对应的状态
 * @author allynlin <allynlin@outlook.com>
 * @param {number} status 流程中的数字
 * @returns {string} 返回对应的状态
 * @example getProcessStatus(0) // process
 * @version 1.0.0
 */
export const getProcessStatus = (status: number) => {
    switch (status) {
        case 0:
            return "process";
        case 1:
            return "finish"
        default:
            return "error"
    }
}
