import {App, Modal, Radio, Progress} from 'antd';
import React, {memo, useRef, useState, useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {close, open} from "../../component/redux/gaussianBlurSlice";
import intl from "react-intl-universal";
import Draggable, {DraggableData, DraggableEvent} from "react-draggable";
import {useGaussianBlurStyles} from "../../styles/gaussianBlurStyle";

const GaussianBlur = memo(() => {

    const dispatch = useDispatch();

    const {message} = App.useApp();

    const gaussianBlur = useSelector((state: any) => state.gaussianBlur.value)

    const gaussianBlurStylesClasses = useGaussianBlurStyles();

    const key = "changeGaussianBlur";

    const [openModal, setOpenModal] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [percent, setPercent] = useState<number>(0);
    const [waitTime, setWaitTime] = useState<number>(0);
    const [bounds, setBounds] = useState({left: 0, top: 0, bottom: 0, right: 0});
    const draggleRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (percent < 100) {
                // 生成一个 1-waitTime 的随机数
                const random = Math.random() * (waitTime - 1) + 1;
                // 对结果取 2 位小数
                const result = (percent + random).toFixed(2);
                setPercent(Number(result));
            } else {
                dispatch(open())
                message.open({
                    key,
                    type: "info",
                    content: intl.get('getGaussianBlurMessage'),
                })
                setTimeout(() => {
                    changeSuccess()
                }, 1000)
            }
        }, 500)
        return () => {
            clearTimeout(timer)
        }
    }, [percent])

    const showModal = () => {
        setOpenModal(true);
        // 获取一个 3-10 之间的随机数
        const random = Math.floor(Math.random() * (10 - 3 + 1) + 3);
        // 将这个转换成 ms 后除以 500
        const waitTime = random * 1000 / 500;
        setWaitTime(waitTime);
    };

    const handleOk = () => {
        setOpenModal(false);
        setPercent(0);
        setWaitTime(0);
        message.open({
            key,
            type: "info",
            content: intl.get("cancelGaussianBlurMessage"),
        })
    };

    const changeSuccess = () => {
        setWaitTime(0);
        setPercent(0);
        setOpenModal(false);
    }

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

    const handleChange = (value: string) => {
        switch (value) {
            case "true":
                showModal();
                break;
            case "false":
                dispatch(close())
                message.open({
                    key,
                    type: "info",
                    content: intl.get('getSolidColorMessage'),
                })
                break;
            default:
                dispatch(open())
        }
    }

    return (
        <>
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
                        {intl.get('changeToGaussianBluring')}
                    </div>
                }
                mask={false}
                className={gaussianBlur ? gaussianBlurStylesClasses.gaussianBlurModal : ""}
                closable={false}
                open={openModal}
                onOk={handleOk}
                okText={intl.get('cancel')}
                cancelButtonProps={{style: {display: "none"}}}
                modalRender={(modal) => (
                    <Draggable
                        disabled={disabled}
                        bounds={bounds}
                        onStart={(event: any, uiData: any) => onStart(event, uiData)}
                    >
                        <div ref={draggleRef}>{modal}</div>
                    </Draggable>
                )}
            >
                <p>{intl.get('changeToGaussianBlurNotice')}</p>
                <Progress percent={percent}/>
            </Modal>
            <Radio.Group onChange={(e: any) => handleChange(e.target.value)} value={gaussianBlur ? "true" : "false"}
                         buttonStyle="solid">
                <Radio.Button value={"true"}>{intl.get('gaussianBlur')}</Radio.Button>
                <Radio.Button value={"false"}>{intl.get('solidColor')}</Radio.Button>
            </Radio.Group>
        </>
    );
});

const GaussianBlurSetting = () => {
    return (
        <App>
            <GaussianBlur/>
        </App>
    )
}

export default GaussianBlurSetting;
