import {Button, List, Modal, Skeleton, Spin, Steps, Tag, Transfer, Typography} from 'antd';
import React, {useEffect, useState} from 'react';
import intl from "react-intl-universal";
import {ExclamationCircleOutlined, LoadingOutlined, SearchOutlined} from "@ant-design/icons";
import {findAllProcess, findProcessUser, updateProcess} from "../../component/axios/api";
import {useSelector} from "react-redux";

import {useStyles} from "../../styles/webStyle";
import {useGaussianBlurStyles} from "../../styles/gaussianBlurStyle";
import MoveModal from "../../component/MoveModal";

const {Title} = Typography;

interface RecordType {
    key: string;
    title: string;
    description: string;
    chosen: boolean;
}

const antIcon = <LoadingOutlined style={{fontSize: 24}} spin/>;

const ProcessManagement = () => {

    const classes = useStyles();
    const gaussianBlurClasses = useGaussianBlurStyles();

    const [isQuery, setIsQuery] = useState<boolean>(false);
    const [waitTime, setWaitTime] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [dataSource, setDataSource] = useState<any>([]);
    const [content, setContent] = useState<any>(null);
    const [open, setOpen] = useState(false);

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
            data.push({
                key: 'nowDepartment',
                title: '当前部门直属领导',
                description: '当前部门直属领导',
                chosen: false
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
        console.log(processArray)

        // 过滤 processArray，将其中的 nowDepartment 改为当前部门直属领导
        const processArrayFilter = processArray.map((item: string) => {
            if (item === 'nowDepartment') {
                return intl.get('directLeadership')
            } else {
                return item
            }
        })

        const newArray = processArrayFilter.map((item) => {
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

    const RenderGetDataSourceButton = () => {
        return (
            <Button type="primary" disabled={isQuery} icon={<SearchOutlined/>}
                    onClick={getDataSource}>{isQuery ? `${intl.get('refresh')}(${waitTime})` : intl.get('refresh')}</Button>
        )
    }

    return (
        <Spin tip={RenderGetDataSourceButton()} delay={1000} indicator={antIcon} size="large" spinning={loading}>
            <div className={classes.contentBody}>
                <div className={classes.contentHead}>
                    <Title level={2} className={classes.tit}>
                        {intl.get('processManagement')}&nbsp;&nbsp;
                        {RenderGetDataSourceButton()}
                    </Title>
                </div>
                <MoveModal
                    title={intl.get('changeProcess')}
                    showModal={open}
                    getModalStatus={(e) => setOpen(e)}
                    okText={intl.get('ok')}
                    cancelText={intl.get('cancel')}
                    onCancel={() => setOpen(false)}
                    onOk={() => {
                        console.log(targetKeys)
                        // 将 targetKeys 拼接成字符串,以 || 分割
                        const process = targetKeys.join('||');
                        Modal.confirm({
                            title: intl.get('confirmChangeProcess'),
                            icon: <ExclamationCircleOutlined/>,
                            content: intl.get('confirmChangeProcessNotice'),
                            className: gaussianBlur ? gaussianBlurClasses.gaussianBlurModal : '',
                            mask: !gaussianBlur,
                            onOk() {
                                updateProcess(content.uid, process).then(res => {
                                    Modal.success({
                                        title: intl.get('success'),
                                        content: intl.get('changeProcessSuccess'),
                                        className: gaussianBlur ? gaussianBlurClasses.gaussianBlurModal : '',
                                        mask: !gaussianBlur,
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
                </MoveModal>
                <>
                    <List
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
                    />
                </>
            </div>
        </Spin>
    )
};

export default ProcessManagement;
