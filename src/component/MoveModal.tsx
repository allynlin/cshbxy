import React, {useRef, useState, useEffect} from 'react';
import {Modal} from 'antd';
import {useSelector} from "react-redux";
import {useGaussianBlurStyles} from "../styles/gaussianBlurStyle";
import Draggable, {DraggableData, DraggableEvent} from "react-draggable";
import {renderFooter} from 'antd/es/modal/PurePanel';


interface Iprops {
    title: React.ReactNode;
    showModal: boolean;
    getModalStatus: (status: boolean) => void;
    footer?: React.ReactNode;
    children?: React.ReactNode;
    onOk?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    /** 点击模态框右上角叉、取消按钮、Props.maskClosable 值为 true 时的遮罩层或键盘按下 Esc 时的回调 */
    onCancel?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    okText?: string;
    cancelText?: string;
}

const MoveModal: React.FC<Iprops> = (props) => {

    const gaussianBlurClasses = useGaussianBlurStyles();

    // 详情弹窗
    const [showModal, setShowModal] = useState<boolean>(false);
    // 可移动 modal
    const [disabled, setDisabled] = useState(false);
    const [bounds, setBounds] = useState({left: 0, top: 0, bottom: 0, right: 0});
    const draggleRef = useRef<HTMLDivElement>(null);

    const gaussianBlur = useSelector((state: any) => state.gaussianBlur.value)

    useEffect(() => {
        setShowModal(props.showModal)
    }, [props.showModal])

    useEffect(() => {
        if (!showModal) {
            props.getModalStatus(false)
        }
    }, [showModal])

    const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
        const {onCancel} = props;
        onCancel?.(e);
    };

    const handleOk = (e: React.MouseEvent<HTMLButtonElement>) => {
        const {onOk} = props;
        onOk?.(e);
    };

    const onStart = (_event: DraggableEvent, uiData: DraggableData) => {
        const {clientWidth, clientHeight} = window.document.documentElement;
        const targetRect = draggleRef.current?.getBoundingClientRect();
        if (!targetRect) {
            return;
        }
        setBounds({
            left: -targetRect.left + uiData.x,
            right: clientWidth - (targetRect.right - uiData.x),
            top: -targetRect.top + uiData.y,
            bottom: clientHeight - (targetRect.bottom - uiData.y),
        });
    };

    return (
        <Modal
            title={
                <div
                    style={{
                        width: '100%',
                        cursor: 'move',
                    }}
                    onMouseOver={() => {
                        if (disabled) {
                            setDisabled(false);
                        }
                    }}
                    onMouseOut={() => {
                        setDisabled(true);
                    }}
                >
                    {props.title}
                </div>
            }
            onCancel={() => setShowModal(false)}
            okText={props.okText}
            cancelText={props.cancelText}
            open={showModal}
            className={gaussianBlur ? gaussianBlurClasses.gaussianBlurModal : ''}
            mask={!gaussianBlur}
            modalRender={(modal) => (
                <Draggable
                    disabled={disabled}
                    bounds={bounds}
                    onStart={(event: any, uiData: any) => onStart(event, uiData)}
                >
                    <div ref={draggleRef}>{modal}</div>
                </Draggable>
            )}
            footer={renderFooter({
                ...props,
                onOk: handleOk,
                onCancel: handleCancel,
            })}
        >
            {props.children}
        </Modal>
    )
};

export default MoveModal;
