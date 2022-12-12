import React, {useEffect, useState} from 'react';
import VirtualTable from "../../component/virtualTable/VirtualTable";
import {Button, Card, Form, Input, message, Modal, Popconfirm, Skeleton, Space, Steps, Tag, Typography} from 'antd';
import {
    deleteWorkReport,
    findUploadFilesByUid,
    findWorkReportByTeacherProcess,
    findWorkReportList,
    refreshWorkReport
} from "../../component/axios/api";
import {ColumnsType} from "antd/es/table";
import intl from "react-intl-universal";
import {RenderStatusTag} from "../../component/Tag/RenderStatusTag";
import {RenderStatusColor} from "../../component/Tag/RenderStatusColor";
import '../../App.scss';
import {FileTextOutlined, SearchOutlined} from "@ant-design/icons";
import {DownLoadURL, red, tableName} from "../../baseInfo";
import {useSelector} from "react-redux";

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
    const [showData, setShowData] = useState<any>([]);
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
    // 关联文件
    const [fileLoading, setFileLoading] = useState<boolean>(true);
    const [fileList, setFileList] = useState<any>([]);
    // 审批流程
    const [processLoading, setProcessLoading] = useState<boolean>(true);
    // 删除确认框
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);

    const tableSize = useSelector((state: any) => state.tableSize.value);

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
        refreshWorkReport(uid).then(res => {
            message.success(res.msg)
            let newContent = {
                key: res.body.uid,
                id: showInfo.id,
                tag: RenderStatusTag(res.body.status, intl.get('travelReimburseApply')),
                operation: <Button
                    type="primary"
                    style={{
                        backgroundColor: RenderStatusColor(res.body.status),
                        borderColor: RenderStatusColor(res.body.status)
                    }}
                    onClick={() => {
                        setShowInfo({...res.body, id: showInfo.id});
                        getProcess(res.body.uid);
                        getFiles(res.body.uid);
                        setShowModal(true);
                        setShowContent(false);
                    }}>
                    {intl.get('check')}
                </Button>,
                ...res.body
            }
            const newDataSource = dataSource.map((item: any) => {
                if (item.key === newContent.key) {
                    return newContent
                }
                return item
            })
            const newShowData = showData.map((item: any) => {
                if (item.key === newContent.key) {
                    return newContent
                }
                return item
            })
            setShowInfo(newContent)
            setDataSource(newDataSource)
            setShowData(newShowData)
            setShowContent(false)
        })
    }

    const getProcess = (uid: string) => {
        setProcessLoading(true)
        findWorkReportByTeacherProcess(uid).then((res: any) => {
            setProcessList(res.body);
        }).catch(err => {
            message.error(err.message)
        }).finally(() => {
            setProcessLoading(false)
        })
    }

    const getFiles = (uid: string) => {
        let msg: any;
        setFileLoading(true)
        const hide = setTimeout(() => msg = message.loading(intl.get('gettingFileList'), 0), 500);
        findUploadFilesByUid(uid, tableName.workReport).then((res: any) => {
            setFileList(res.body);
        }).finally(() => {
            clearTimeout(hide)
            msg && msg();
            setFileLoading(false)
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
        findWorkReportList().then((res: any) => {
            if (res.code === 200) {
                const newDataSource = res.body.map((item: any, index: number) => {
                    return {
                        ...item,
                        id: index + 1,
                        key: item.uid,
                        tag: RenderStatusTag(item.status, intl.get('travelReimburseApply')),
                        operation: <Button
                            type="primary"
                            style={{
                                backgroundColor: RenderStatusColor(item.status),
                                borderColor: RenderStatusColor(item.status)
                            }}
                            onClick={() => {
                                setShowInfo({...item, id: index + 1});
                                getProcess(item.uid);
                                getFiles(item.uid);
                                setShowModal(true);
                                setShowContent(false);
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
        // 如果有输入内容，那将 dataSource 中的 destination 进行模糊匹配
        const newShowData = dataSource.filter((item: any) => {
            return item.create_time.indexOf(values.search) !== -1
        })
        setShowData(newShowData);
    };

    // 删除当前项
    const deleteItem = (uid: string) => {
        setConfirmLoading(true);
        setOpen(false)
        deleteWorkReport(uid, tableName.workReport).then((res: any) => {
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
        title: intl.get('createTime'),
        dataIndex: 'create_time',
        align: 'center',
    }, {
        title: intl.get('updateTime'),
        dataIndex: 'update_time',
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
                title={intl.get('details')}
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
                                {intl.get('delete')}
                            </Button>
                        </Popconfirm> : null,
                    <Button
                        key="refresh"
                        type="primary"
                        loading={isRefresh}
                        onClick={() => {
                            getProcess(showInfo.uid)
                            getFiles(showInfo.uid)
                            refresh(showInfo.uid)
                        }}
                        disabled={isRefresh}>
                        {isRefresh ? `${intl.get('refreshProcessList')}(${isRefreshWaitTime})` : intl.get('refreshProcessList')}
                    </Button>,
                    <Button
                        key="link"
                        loading={loading}
                        onClick={() => setShowModal(false)}
                    >
                        {intl.get('close')}
                    </Button>,
                ]}
            >
                {showContent ? (<Skeleton active/>) : (
                    <>
                        <p>{intl.get('destination')}：{showInfo.destination}</p>
                        <p>{intl.get('cost')}：{showInfo.expenses}</p>
                        <p>{intl.get('reason')}：{showInfo.reason}</p>
                        {showInfo.reject_reason ?
                            <>
                                {intl.get('rejectReason')}：
                                <Tag color={red}>{showInfo.reject_reason}</Tag>
                            </> : null}
                        <p>{intl.get('createTime')}：{showInfo.create_time}</p>
                        <p>{intl.get('updateTime')}：{showInfo.update_time}</p>
                        <p>{intl.get('file')}：</p>
                        {
                            fileLoading ? (
                                    <div className="skeleton-file">
                                        <Skeleton.Node active>
                                            <FileTextOutlined className={'skeleton-files'}/>
                                        </Skeleton.Node>
                                    </div>
                                ) :
                                // 如果 fileList 不为空则渲染
                                fileList.length > 0 ? (
                                    <>
                                        <div className="showFile">
                                            {fileList.map((item: any, index: number) => {
                                                return (
                                                    <Card size="small" className="file-item" hoverable key={index}
                                                          title={intl.get('file') + (index + 1)}
                                                          bordered={false}>
                                                        <Typography.Paragraph ellipsis>
                                                            <a href={`${DownLoadURL}/downloadFile?filename=${item.fileName}`}
                                                               target="_self">{item.oldFileName}</a>
                                                        </Typography.Paragraph>
                                                    </Card>
                                                )
                                            })}
                                        </div>
                                    </>
                                ) : null
                        }
                        <p>{intl.get('approveProcess')}：</p>
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
                    {intl.get('workReport') + ' ' + intl.get('record')}&nbsp;&nbsp;
                    <Button type="primary" disabled={isQuery} icon={<SearchOutlined/>}
                            onClick={getDataSource}>{isQuery ? `${intl.get('refresh')}(${waitTime})` : intl.get('refresh')}</Button>
                </Title>
                <Form name="search" layout="inline" onFinish={onFinish}>
                    <Form.Item name="search">
                        <Input prefix={<SearchOutlined className="site-form-item-icon"/>}
                               placeholder={intl.get('search') + ' ' + intl.get('createTime')}/>
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
            <VirtualTable columns={columns} dataSource={showData}
                          scroll={{y: tableSize.tableHeight, x: tableSize.tableWidth}}/>
        </div>
    )
};

export default App;
