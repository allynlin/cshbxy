import React, {useEffect, useState} from 'react';
import VirtualTable from "../../component/virtualTable/VirtualTable";
import {Button, message, Skeleton, Typography, Form, Input, Modal, Tag, Popconfirm, Steps, Space} from 'antd';
import {deleteLeave, findLeaveList, findLeaveProcess, refreshLeave} from "../../component/axios/api";
import {ColumnsType} from "antd/es/table";
import intl from "react-intl-universal";
import {RenderStatusTag} from "../../component/Tag/RenderStatusTag";
import {RenderStatusColor} from "../../component/Tag/RenderStatusColor";
import './record.scss';
import {SearchOutlined} from "@ant-design/icons";
import {red, green} from "../../baseInfo";

const {Title} = Typography;
const {Step} = Steps;

interface DataType {
    key: React.Key;
    dataIndex: string;
    align: 'left' | 'right' | 'center';
}

const App: React.FC = () => {

    // 全局数据防抖
    const [isQuery, setIsQuery] = useState<boolean>(false);
    const [waitTime, setWaitTime] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    // 全局数据
    const [dataSource, setDataSource] = useState<any>([]);
    // 筛选后的数据
    const [showData, setShowData] = useState([]);
    // 当前展示数据
    const [showInfo, setShowInfo] = useState<any>({});
    // 审批流程
    const [processList, setProcessList] = useState<any>([]);
    // 刷新当前审批项按钮防抖
    const [isRefresh, setIsRefresh] = useState<boolean>(false);
    const [isRefreshWaitTime, setIsRefreshWaitTime] = useState<number>(0);
    const [showContent, setShowContent] = useState<boolean>(true);
    // 详情弹窗
    const [showModal, setShowModal] = useState<boolean>(false);
    // 审批流程
    const [processLoading, setProcessLoading] = useState<boolean>(true);
    // 删除确认框
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    // 虚拟列表的宽度和高度
    const [width, setWidth] = useState<number>(0);
    const [height, setHeight] = useState<number>(0);

    useEffect(() => {
        // 获取页面宽度
        const width = document.body.clientWidth;
        // 获取页面高度
        const height = document.body.clientHeight;
        // 虚拟列表的宽度计算：页面宽度 - 左侧导航栏宽度（200）- 右侧边距（20） - 表格左右边距（20）
        const tableWidth = width - 200 - 40;
        // 虚拟列表高度计算：液面高度 - 页面顶部（10%，最小50px） - 页面底部（5%，最小20px） - 表格上下边距（20）
        const bottomHeight = height * 0.05 >= 20 ? height * 0.05 : 20;
        const topHeight = height * 0.1 >= 50 ? height * 0.1 : 50;
        const tableHeight = height - bottomHeight - topHeight - 100 - 43;
        setWidth(tableWidth);
        setHeight(tableHeight);
    }, [])

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
        const timer = setTimeout(() => {
            if (isRefreshWaitTime > 1) {
                setIsRefresh(true)
                setIsRefreshWaitTime(e => e - 1)
            } else {
                setIsRefresh(false)
            }
        }, 1000)
        return () => {
            clearTimeout(timer)
        }
    }, [isRefreshWaitTime])

    const refresh = (uid: string) => {
        setIsRefresh(true)
        setIsRefreshWaitTime(5)
        setShowContent(true)
        refreshLeave(uid).then(res => {
            message.success(res.msg)
            let newContent = {
                key: showInfo.key,
                id: showInfo.id,
                ...res.body
            }
            const newDataSource = dataSource.map((item: any) => {
                if (item.key === showInfo.key) {
                    return newContent
                }
                return item
            })
            setShowInfo(newContent)
            setDataSource(newDataSource)
            setShowContent(false)
        })
    }

    const getProcess = (uid: string) => {
        setProcessLoading(true)
        findLeaveProcess(uid).then((res: any) => {
            setProcessList(res.body);
        }).catch(err => {
            message.error(err.message)
        }).finally(() => {
            setProcessLoading(false)
            setShowContent(false)
        })
    }

    useEffect(() => {
        getDataSource();
    }, [])

    // 获取所有数据
    const getDataSource = () => {
        setDataSource([]);
        setShowData([]);
        setLoading(true);
        setIsQuery(true)
        setWaitTime(10)
        findLeaveList().then(res => {
            if (res.code === 200) {
                const newDataSource = res.body.map((item: any, index: number) => {
                    return {
                        ...item,
                        id: index + 1,
                        key: item.uid,
                        tag: RenderStatusTag(item.status, intl.get('leaveApply')),
                        operation: <Button
                            type="primary"
                            style={{
                                backgroundColor: RenderStatusColor(item.status),
                                borderColor: RenderStatusColor(item.status)
                            }}
                            onClick={() => {
                                setShowInfo(item);
                                getProcess(item.uid);
                                setShowModal(true);
                            }}>
                            {intl.get('check')}
                        </Button>
                    }
                });
                setDataSource(newDataSource);
                setShowData(newDataSource);
            } else {
                message.warning(res.msg);
                setDataSource([])
            }
        }).finally(() => {
            setLoading(false)
        })
    }

    const onFinish = (values: any) => {
        // 如果什么内容都没有输入，那就把所有数据展示出来
        if (!values.search) {
            setShowData(dataSource);
            return
        }
        // 如果有输入内容，那将 dataSource 中的 reason 进行模糊匹配
        const newShowData = dataSource.filter((item: any) => {
            return item.reason.indexOf(values.search) !== -1
        })
        setShowData(newShowData);
    };

    // 删除当前项
    const deleteItem = (uid: string) => {
        setConfirmLoading(true);
        setOpen(false)
        deleteLeave(uid).then((res: any) => {
            if (res.code === 200) {
                message.success(res.msg);
                const newDataSource = dataSource.filter((item: any) => item.uid !== uid);
                setDataSource(newDataSource);
                const newShowData = showData.filter((item: any) => item.uid !== uid);
                setShowData(newShowData);
            } else {
                message.error(res.msg);
            }
        }).finally(() => {
            setConfirmLoading(false);
            setShowModal(false);
        })
    }
    const columns: ColumnsType<DataType> = [{
        title: 'id',
        dataIndex: 'id',
        align: 'center',
    }, {
        title: intl.get('startTime'),
        dataIndex: 'start_time',
        align: 'center',
    }, {
        title: intl.get('endTime'),
        dataIndex: 'end_time',
        align: 'center',
    }, {
        title: intl.get('status'),
        dataIndex: 'tag',
        align: 'center',
    }, {
        title: intl.get('operate'),
        dataIndex: 'operation',
        align: 'center',
    }];

    return (
        <div className={'record-body'}>
            <Modal
                title="请假详情"
                onCancel={() => setShowModal(false)}
                open={showModal}
                footer={[
                    showInfo.status === 0 ?
                        <Popconfirm
                            title={intl.get('deleteConfirm')}
                            open={open}
                            onConfirm={() => deleteItem(showInfo.uid)}
                            onCancel={() => setOpen(false)}
                        >
                            <Button loading={confirmLoading} type="primary" danger key="delete"
                                    onClick={() => setOpen(true)}>
                                删除
                            </Button>
                        </Popconfirm> : null,
                    <Button
                        key="refresh"
                        type="primary"
                        loading={isRefresh}
                        onClick={() => {
                            getProcess(showInfo.uid)
                            refresh(showInfo.uid)
                        }}
                        disabled={isRefresh}>
                        {isRefresh ? `${intl.get('refreshProcessList')}(${isRefreshWaitTime})` : intl.get('refreshProcessList')}
                    </Button>,
                    <Button
                        key="link"
                        type="primary"
                        loading={loading}
                        onClick={() => setShowModal(false)}
                        style={{
                            backgroundColor: green,
                            borderColor: green
                        }}
                    >
                        关闭
                    </Button>,
                ]}
            >
                {showContent ? (<Skeleton/>) : (
                    <>
                        <p>{intl.get('startTime')}：{showInfo.start_time}</p>
                        <p>{intl.get('endTime')}：{showInfo.end_time}</p>
                        <p>{intl.get('reason')}：{showInfo.reason}</p>
                        {showInfo.reject_reason ?
                            <>
                                {intl.get('rejectReason')}：
                                <Tag color={red}>{showInfo.reject_reason}</Tag>
                            </> : null}
                        <p>{intl.get('createTime')}：{showInfo.create_time}</p>
                        <p>{intl.get('updateTime')}：{showInfo.update_time}</p>
                        <div>{intl.get('approveProcess')}：</div>
                        {
                            processLoading ? (
                                    <Space style={{flexDirection: 'column', marginTop: 16}}>
                                        <Skeleton.Input active={true} block={false}/>
                                        <Skeleton.Input active={true} block={false}/>
                                        <Skeleton.Input active={true} block={false}/>
                                        <Skeleton.Input active={true} block={false}/>
                                    </Space>) :
                                <div style={{marginTop: 16}}>
                                    <Steps
                                        style={{
                                            marginTop: 16
                                        }}
                                        direction="vertical"
                                        size="small"
                                        current={showInfo.count}
                                        status={showInfo.status === 0 ? 'process' : showInfo.status === 1 ? 'finish' : 'error'}
                                    >
                                        {
                                            processList.map((item: string, index: number) => {
                                                return (
                                                    <Step
                                                        key={index}
                                                        title={item}
                                                    />
                                                )
                                            })
                                        }
                                    </Steps>
                                </div>
                        }
                    </>
                )}
            </Modal>
            <div className="record-head">
                <Title level={2} className={'tit'}>
                    {intl.get('leave') + ' ' + intl.get('record')}&nbsp;&nbsp;
                    <Button type="primary" disabled={isQuery} icon={<SearchOutlined/>}
                            onClick={getDataSource}>{isQuery ? `${intl.get('refresh')}(${waitTime})` : intl.get('refresh')}</Button>
                </Title>
                <Form name="search" layout="inline" onFinish={onFinish}>
                    <Form.Item name="search">
                        <Input prefix={<SearchOutlined className="site-form-item-icon"/>}
                               placeholder="搜索原因"/>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">Search</Button>
                    </Form.Item>
                </Form>
            </div>
            <div className="skeleton-loading" style={{display: loading ? 'block' : 'none'}}>
                <div className="skeleton-thead"/>
                <div className="skeleton-tbody">
                    <Skeleton.Button block active className={'skeleton-tr'}/>
                    <Skeleton.Button block active className={'skeleton-tr'}/>
                    <Skeleton.Button block active className={'skeleton-tr'}/>
                    <Skeleton.Button block active className={'skeleton-tr'}/>
                    <Skeleton.Button block active className={'skeleton-tr'}/>
                </div>
            </div>
            <VirtualTable columns={columns} dataSource={showData} scroll={{y: height, x: width}}/>
        </div>
    )
};

export default App;
