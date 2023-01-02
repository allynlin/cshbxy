import {Button, List, Modal, Skeleton, Steps, Tag, Transfer, Typography} from 'antd';
import React, {useEffect, useState, useRef} from 'react';
import intl from "react-intl-universal";
import {ExclamationCircleOutlined, SearchOutlined} from "@ant-design/icons";
import {findAllProcess, findProcessUser, updateProcess} from "../../component/axios/api";
import {useSelector} from "react-redux";
import Draggable, {DraggableData, DraggableEvent} from "react-draggable";

import {useStyles} from "../../styles/webStyle";
import {useGaussianBlurStyles} from "../../styles/gaussianBlurStyle";

const {Title} = Typography;

interface RecordType {
    key: string;
    title: string;
    description: string;
    chosen: boolean;
}

const ProcessManagement = () => {

    const classes = useStyles();
    const gaussianBlurClasses = useGaussianBlurStyles();

    const [isQuery, setIsQuery] = useState<boolean>(false);
    const [waitTime, setWaitTime] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [dataSource, setDataSource] = useState<any>([]);
    const [content, setContent] = useState<any>(null);
    const [open, setOpen] = useState(false);
    // 可移动 modal
    const [disabled, setDisabled] = useState(false);
    const [bounds, setBounds] = useState({left: 0, top: 0, bottom: 0, right: 0});
    const draggleRef = useRef<HTMLDivElement>(null);

    const tableSize = useSelector((state: any) => state.tableSize.value);
    const gaussianBlur = useSelector((state: any) => state.gaussianBlur.value);

    useEffect(() => {
        getProcessPerson();
    }, [content])

    const getProcessPerson = () => {
        findProcessUser().then(res => {
            const data = res.body.map((item: any, index: number) => {
                return {
                    key: item.uid,
                    title: item.realeName,
                    description: item.realeName,
                    chosen: false
                }
            })
            setMockData(data)
        })
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            if (waitTime > 1) {
                setIsQuery(true)
                setWaitTime(e => e - 1)
                setIsQuery(true)
            } else {
                setIsQuery(false)
            }
        }, 1000)
        return () => {
            clearTimeout(timer)
        }
    }, [waitTime])

    useEffect(() => {
        getDataSource();
    }, [])

    // 获取所有数据
    const getDataSource = () => {
        setLoading(true);
        setIsQuery(true)
        setWaitTime(10)
        findAllProcess().then(res => {
            const data = res.body.map((item: any, index: number) => {
                return {
                    ...item,
                    key: item.uid,
                    name: item.realeName,
                    process: item.process,
                    chosen: false
                }
            })
            setDataSource(data)
        }).finally(() => {
            setLoading(false)
        })
    }

    const RenderSteps = (process: string) => {

        // 将 process 按照 || 分割成数组
        const processArray: string[] = process.split('||');

        const newArray = processArray.map((item, index) => {
            return {
                title: item,
            }
        })

        return (
            <Steps
                progressDot
                status="wait"
                current={newArray.length}
                items={newArray}
            />
        )
    }

    const [mockData, setMockData] = useState<RecordType[]>([]);
    const [targetKeys, setTargetKeys] = useState<string[]>([]);

    const filterOption = (inputValue: string, option: RecordType) =>
        option.description.indexOf(inputValue) > -1;

    const handleChange = (newTargetKeys: string[]) => {
        setTargetKeys(newTargetKeys);
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
        <div className={classes.contentBody}>
            <div className={classes.contentHead}>
                <Title level={2} className={classes.tit}>
                    {intl.get('processManagement')}&nbsp;&nbsp;
                    <Button type="primary" disabled={isQuery} icon={<SearchOutlined/>}
                            onClick={getDataSource}>{isQuery ? `${intl.get('refresh')}(${waitTime})` : intl.get('refresh')}</Button>
                </Title>
            </div>
            <Modal
                open={open}
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
                        {intl.get('changeProcess')}
                    </div>
                }
                okText={intl.get('ok')}
                cancelText={intl.get('cancel')}
                onCancel={() => setOpen(false)}
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
                onOk={() => {
                    console.log(targetKeys)
                    // 将 targetKeys 拼接成字符串,以 || 分割
                    const process = targetKeys.join('||');
                    Modal.confirm({
                        title: intl.get('confirmChangeProcess'),
                        icon: <ExclamationCircleOutlined/>,
                        content: intl.get('confirmChangeProcessNotice'),
                        onOk() {
                            updateProcess(content.uid, process).then(res => {
                                Modal.success({
                                    title: intl.get('success'),
                                    content: intl.get('changeProcessSuccess')
                                })
                                getDataSource();
                                setOpen(false);
                            })
                        }
                    });
                }}
            >
                <Transfer
                    dataSource={mockData}
                    showSearch
                    filterOption={filterOption}
                    targetKeys={targetKeys}
                    onChange={handleChange}
                    render={item => item.title}
                />
            </Modal>
            <>
                {loading ? <Skeleton active paragraph={{rows: 10}}/> : <List
                    itemLayout="horizontal"
                    dataSource={dataSource}
                    style={{width: tableSize.tableWidth - 100, height: tableSize.tableHeight}}
                    renderItem={(item: any) => (
                        <List.Item
                            actions={[
                                <Button
                                    key={'changeProcess'}
                                    type={'primary'}
                                    onClick={() => {
                                        setContent(item)
                                        setOpen(true)
                                        const processArray: string[] = item.process.split('||');
                                        const targetKeys: string[] = [];
                                        processArray.forEach((item: string) => {
                                            // 在 mockData 中找到对应的 key
                                            const key = mockData.find((mockItem: any) => mockItem.key === item)?.key;
                                            if (key) {
                                                targetKeys.push(key)
                                            }
                                        })
                                        setTargetKeys(targetKeys)
                                    }}>{intl.get('changeProcess')}</Button>
                            ]}
                        >
                            <List.Item.Meta
                                title={<Tag>{item.name}&nbsp;{intl.get('approveProcess')}</Tag>}
                                description={RenderSteps(item.processRealName)}
                            />
                        </List.Item>
                    )}
                />}
            </>
        </div>
    )
};

export default ProcessManagement;
