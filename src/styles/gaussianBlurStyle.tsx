import {createUseStyles} from "react-jss";
import {useSelector} from "react-redux";

export const useGaussianBlurStyles = () => {
    const userToken = useSelector((state: any) => state.userToken.value)

    const backDropFilter = `blur(${userToken.gaussianBlur}px) saturate(180%) !important`
    const borderBox = `border-box !important`
    const backgroundColorLight4 = `rgba(240,240,240,0.4) !important`
    const backgroundColorDark2 = `rgba(20,20,20,0.2) !important`

    const style = createUseStyles({
        gaussianBlurTooltip: {
            boxSizing: borderBox,
            // 下一级 div 中 class 为 ant-modal-content 的元素的背景色
            "& .ant-tooltip-inner": {
                backdropFilter: backDropFilter,
                "[data-prefers-color-scheme='light'] &": {
                    backgroundColor: "rgba(0,0,0,0.5) !important",
                },
                "[data-prefers-color-scheme='dark'] &": {
                    backgroundColor: "rgba(0,0,0,0.7) !important",
                }
            }
        },
        gaussianBlurPopconfirm: {
            boxSizing: borderBox,
            // 下一级 div 中 class 为 ant-modal-content 的元素的背景色
            "& .ant-popover-inner": {
                backdropFilter: backDropFilter,
                "[data-prefers-color-scheme='light'] &": {
                    backgroundColor: backgroundColorLight4,
                },
                "[data-prefers-color-scheme='dark'] &": {
                    backgroundColor: "rgba(0,0,0,0.7) !important",
                }
            }
        },
        gaussianBlurModalMethod: {
            boxSizing: borderBox,
            // 下一级 div 中 class 为 ant-modal-content 的元素的背景色
            "& .ant-modal-content": {
                backdropFilter: backDropFilter,
                "[data-prefers-color-scheme='light'] &": {
                    backgroundColor: backgroundColorLight4,
                },
                "[data-prefers-color-scheme='dark'] &": {
                    backgroundColor: "rgba(0,0,0,0.5) !important",
                }
            }
        },
        gaussianBlurModal: {
            boxSizing: borderBox,
            // 下一级 div 中 class 为 ant-modal-content 的元素的背景色
            "& .ant-modal-content": {
                backdropFilter: backDropFilter,
                "[data-prefers-color-scheme='light'] &": {
                    backgroundColor: backgroundColorLight4,
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
            backdropFilter: backDropFilter,
            "[data-prefers-color-scheme='light'] &": {
                background: backgroundColorLight4,
            },
            "[data-prefers-color-scheme='dark'] &": {
                background: backgroundColorDark2,
            },
            "& ul.ant-menu-vertical": {
                "[data-prefers-color-scheme='light'] &": {
                    background: backgroundColorLight4,
                },
                "[data-prefers-color-scheme='dark'] &": {
                    background: backgroundColorDark2,
                },
            }
        },
        datePicker: {
            boxSizing: borderBox,
            "& .ant-picker-panel-container": {
                backdropFilter: backDropFilter,
                "[data-prefers-color-scheme='light'] &": {
                    background: backgroundColorLight4,
                },
                "[data-prefers-color-scheme='dark'] &": {
                    background: backgroundColorDark2,
                }
            }
        }
    });
    return style();
}
