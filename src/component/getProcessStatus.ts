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
