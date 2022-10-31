const CracoLessPlugin = require('craco-less');
const {getThemeVariables} = require('antd/dist/theme');

module.exports = {
    plugins: [
        {
            plugin: CracoLessPlugin,
            options: {
                lessLoaderOptions: {
                    lessOptions: {
                        modifyVars: getThemeVariables({
                            dark: true, // 开启暗黑模式
                        }),
                        javascriptEnabled: true,
                    },
                },
            },
        },
    ],
};
