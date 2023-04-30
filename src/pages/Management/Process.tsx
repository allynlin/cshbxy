import {Button, List, Modal, Spin, Steps, Tag, Transfer, Typography} from 'antd';
import React, {useEffect, useState} from 'react';
import {ExclamationCircleOutlined, LoadingOutlined, SearchOutlined} from "@ant-design/icons";
import {findAllProcess, findProcessUser, updateProcess} from "../../component/axios/api";

import {useStyles} from "../../styles/webStyle";
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

    const [isQuery, setIsQuery] = useState<boolean>(false);
    const [waitTime, setWaitTime] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [dataSource, setDataSource] = useState<any>([]);
    const [content, setContent] = useState<any>(null);
    const [open, setOpen] = useState(false);
    const [changeIng, setChangeIng] = useState(false);

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
                return "直属领导"
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
                    onClick={getDataSource}>{isQuery ? `刷新(${waitTime})` : "刷新"}</Button>
        )
    }

    return (
        <Spin tip={RenderGetDataSourceButton()} delay={1000} indicator={antIcon} size="large" spinning={loading}>
            <div className={classes.contentBody}>
                <div className={classes.contentHead}>
                    <Title level={2} className={classes.tit}>
                        流程管理&nbsp;&nbsp;
                        {RenderGetDataSourceButton()}
                    </Title>
                </div>
                <MoveModal
                    title="修改流程"
                    showModal={open}
                    getModalStatus={(e) => setOpen(e)}
                    okText="确定"
                    cancelText="取消"
                    onCancel={() => setOpen(false)}
                    footer={[
                        <Button type="default">取消</Button>,
                        <Button type="primary" loading={changeIng} onClick={() => {
                            // 将 targetKeys 拼接成字符串,以 || 分割
                            const process = targetKeys.join('||');
                            Modal.confirm({
                                title: "确认修改流程吗",
                                icon: <ExclamationCircleOutlined/>,
                                content: "修改成功后所有新的提交申请都会按照新的流程进行审批",
                                onOk() {
                                    setChangeIng(true)
                                    updateProcess(content.uid, process).then(res => {
                                        Modal.success({
                                            title: "成功",
                                            content: "修改流程成功"
                                        })
                                        getDataSource();
                                        setOpen(false);
                                    }).finally(() => {
                                        setChangeIng(false)
                                    })
                                }
                            });
                        }}>确定</Button>
                    ]}
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
                                        }}>修改流程</Button>
                                ]}
                            >
                                <List.Item.Meta
                                    title={<Tag>{item.name}&nbsp;审批流程</Tag>}
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
