import {createUseStyles} from "react-jss";

export const useGaussianBlurStyles = createUseStyles({
    gaussianBlurTooltip: {
        boxSizing: 'border-box !important',
        // 下一级 div 中 class 为 ant-modal-content 的元素的背景色
        "& .ant-tooltip-inner": {
            backdropFilter: 'blur(20px) saturate(180%) !important',
            "[data-prefers-color-scheme='light'] &": {
                backgroundColor: "rgba(0,0,0,0.5) !important",
            },
            "[data-prefers-color-scheme='dark'] &": {
                backgroundColor: "rgba(0,0,0,0.7) !important",
            }
        }
    },
    gaussianBlurPopconfirm: {
        boxSizing: 'border-box !important',
        // 下一级 div 中 class 为 ant-modal-content 的元素的背景色
        "& .ant-popover-inner": {
            backdropFilter: 'blur(20px) saturate(180%) !important',
            "[data-prefers-color-scheme='light'] &": {
                backgroundColor: "rgba(240,240,240,0.5) !important",
            },
            "[data-prefers-color-scheme='dark'] &": {
                backgroundColor: "rgba(0,0,0,0.7) !important",
            }
        }
    },
    gaussianBlurModalMethod: {
        boxSizing: 'border-box !important',
        // 下一级 div 中 class 为 ant-modal-content 的元素的背景色
        "& .ant-modal-content": {
            backdropFilter: 'blur(20px) saturate(180%) !important',
            "[data-prefers-color-scheme='light'] &": {
                backgroundColor: "rgba(240,240,240,0.5) !important",
            },
            "[data-prefers-color-scheme='dark'] &": {
                backgroundColor: "rgba(0,0,0,0.5) !important",
            }
        }
    },
    gaussianBlurModal: {
        boxSizing: 'border-box !important',
        // 下一级 div 中 class 为 ant-modal-content 的元素的背景色
        "& .ant-modal-content": {
            backdropFilter: 'blur(20px) saturate(180%) !important',
            "[data-prefers-color-scheme='light'] &": {
                backgroundColor: "rgba(240,240,240,0.2) !important",
            },
            "[data-prefers-color-scheme='dark'] &": {
                backgroundColor: "rgba(0,0,0,0.4) !important",
            }
        },
        "& .ant-modal-header": {
            backgroundColor: "transparent !important"
        }
    },
    gaussianBlurMenu: {
        backdropFilter: "blur(20px) saturate(180%) !important",
        "[data-prefers-color-scheme='light'] &": {
            background: "rgba(240,240,240,0.4) !important",
        },
        "[data-prefers-color-scheme='dark'] &": {
            background: "rgba(20,20,20,0.2) !important",
        },
        "& ul.ant-menu-vertical": {
            "[data-prefers-color-scheme='light'] &": {
                background: "rgba(240,240,240,0.4) !important",
            },
            "[data-prefers-color-scheme='dark'] &": {
                background: "rgba(20,20,20,0.2) !important",
            },
        }
    },
    testOrange: {
        backgroundColor: "orange !important"
    }
})
