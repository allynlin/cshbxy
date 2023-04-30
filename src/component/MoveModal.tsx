import React, {useEffect, useState} from 'react';
import {Modal} from 'antd';


interface Iprops {
    /** 标题 */
    title: React.ReactNode;
    /** 是否显示模态框 */
    showModal: boolean;
    /** 获取模态框显示状态 */
    getModalStatus: (status: boolean) => void;
    /** 模态框页脚 */
    footer?: React.ReactNode;
    /** 模态框内部内容 */
    children?: React.ReactNode;
    /** 点击模态框确认状态时的回调 */
    onOk?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    /** 点击模态框右上角叉、取消按钮、Props.maskClosable 值为 true 时的遮罩层或键盘按下 Esc 时的回调 */
    onCancel?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    /** 默认确认按钮的文字 */
    okText?: string;
    /** 默认取消按钮的文字 */
    cancelText?: string;
}

const MoveModal: React.FC<Iprops> = (props) => {

    // 详情弹窗
    const [showModal, setShowModal] = useState<boolean>(false);

    useEffect(() => {
        setShowModal(props.showModal)
    }, [props.showModal])

    useEffect(() => {
        if (!showModal) {
            props.getModalStatus(false)
        }
    }, [showModal])

    return (
        <Modal
            title={props.title}
            onCancel={() => setShowModal(false)}
            okText={props.okText}
            cancelText={props.cancelText}
            open={showModal}
            footer={[
                props.footer
            ]}
        >
            {props.children}
        </Modal>
    )
};

export default MoveModal;
