export const getProcessStatus = (status: number) => {
    switch (status) {
        case 0:
            return "wait"
        case 1:
            return "finish"
        default:
            return "error"
    }
}
