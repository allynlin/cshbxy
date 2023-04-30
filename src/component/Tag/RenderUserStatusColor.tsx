export const RenderUserStatusColor = (text: string) => {
    switch (text) {
        case '正常':
            return '#006c01';
        case '禁用':
            return '#f32401';
        default:
            return '#40a9ff';
    }
}
