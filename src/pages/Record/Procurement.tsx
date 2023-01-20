import React, {useEffect, useState} from 'react';
import VirtualTable from "../../component/VirtualTable";
import {App, Button, Form, Input, Popconfirm, Result, Skeleton, Space, Spin, Steps, Table, Tag, Typography} from 'antd';
import {
    deleteProcurement,
    findProcurementList,
    findProcurementProcess,
    refreshProcurement
} from "../../component/axios/api";
import {ColumnsType} from "antd/es/table";
import intl from "react-intl-universal";
import {RenderStatus} from "../../component/Tag/RenderStatus";
import {FolderOpenOutlined, LoadingOutlined, SearchOutlined} from "@ant-design/icons";
import {useSelector} from "react-redux";
import {useStyles} from "../../styles/webStyle";
import {getProcessStatus} from '../../component/getProcessStatus';
import {RenderStatusTag} from "../../component/Tag/RenderStatusTag";
import MoveModal from "../../component/MoveModal";

const {Title, Paragraph} = Typography;

interface DataType {
    key: React.Key;
    dataIndex: string;
    align: 'left' | 'right' | 'center';
}

const antIcon = <LoadingOutlined style={{fontSize: 24}} spin/>;

const MyApp: React.FC = () => {

    const classes = useStyles();

    const {message} = App.useApp();

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
    // 审批流程
    const [processLoading, setProcessLoading] = useState<boolean>(true);
    // 删除确认框
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    // 是否为空数据
    const [isEmpty, setIsEmpty] = useState<boolean>(false);

    const tableSize = useSelector((state: any) => state.tableSize.value);
    const userToken = useSelector((state: any) => state.userToken.value);
    const userTable = useSelector((state: any) => state.userTable.value)

    const key = "refresh"

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
        message.open({
            key,
            type: 'loading',
            content: intl.get("refreshing"),
            duration: 0,
        })
        setIsRefresh(true)
        setIsRefreshWaitTime(5)
        setShowContent(true)
        refreshProcurement(uid).then(res => {
            message.open({
                key,
                type: 'success',
                content: res.msg
            })
            let newContent = {
                key: res.body.uid,
                id: showInfo.id,
                tag: RenderStatus(res.body),
                statusTag: RenderStatusTag(res.body),
                operation: <Button
                    type="primary"
                    onClick={() => {
                        setShowInfo({...res.body, id: showInfo.id, statusTag: RenderStatusTag(res.body)})
                        getProcess(res.body.uid);
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
        }).catch(() => {
            message.open({
                key,
                type: 'error',
                content: intl.get('refreshingFailed')
            })
        })
    }

    const getProcess = (uid: string) => {
        setProcessLoading(true)
        findProcurementProcess(uid).then((res: any) => {
            const newProcessList = res.body.map((item: any, index: number) => {
                return {
                    title: item
                }
            })
            setProcessList(newProcessList)
        }).catch(err => {
            message.error(err.message)
        }).finally(() => {
            setProcessLoading(false)
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
        findProcurementList().then(res => {
            if (res.code === 300) {
                setIsEmpty(true)
                setDataSource([])
                setShowData([])
                return
            }
            if (res.code !== 200) {
                message.error(res.msg)
                setIsEmpty(true)
                return
            }
            const newDataSource = res.body.map((item: any, index: number) => {
                return {
                    ...item,
                    id: index + 1,
                    key: item.uid,
                    tag: RenderStatus(item),
                    statusTag: RenderStatusTag(item),
                    operation: <Button
                        type="primary"
                        onClick={() => {
                            setShowInfo({...item, id: index + 1, statusTag: RenderStatusTag(item)});
                            getProcess(item.uid);
                            setShowModal(true);
                            setShowContent(false);
                        }}>
                        {intl.get('check')}
                    </Button>
                }
            });
            setDataSource(newDataSource);
            setShowData(newDataSource);
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
            return item.items.indexOf(values.search) !== -1
        })
        setShowData(newShowData);
    };

    // 删除当前项
    const deleteItem = (uid: string) => {
        setConfirmLoading(true);
        setOpen(false)
        deleteProcurement(uid).then((res: any) => {
            if (res.code !== 200) {
                message.error(res.msg)
                return
            }
            message.success(res.msg);
            const newDataSource = dataSource.filter((item: any) => item.uid !== uid);
            if (newDataSource.length === 0) {
                setIsEmpty(true)
                setDataSource([])
                setShowData([])
                return
            }
            setDataSource(newDataSource);
            const newShowData = showData.filter((item: any) => item.uid !== uid);
            setShowData(newShowData);
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
        title: intl.get('procurementPrice'),
        dataIndex: 'price',
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

    const RenderGetDataSourceButton = () => {
        return (
            <Button type="primary" disabled={isQuery} icon={<SearchOutlined/>}
                    onClick={getDataSource}>{isQuery ? `${intl.get('refresh')}(${waitTime})` : intl.get('refresh')}</Button>
        )
    }

    return (
        <Spin tip={RenderGetDataSourceButton()} delay={1000} indicator={antIcon} size="large" spinning={loading}>
            <div className={classes.contentBody}>
                <MoveModal
                    title={intl.get('details')}
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
                    showModal={showModal}
                    getModalStatus={(e) => setShowModal(e)}
                >
                    {showContent ? (<Skeleton active/>) : (
                        <Typography>
                            <Paragraph>{intl.get('status')}：{showInfo.statusTag}</Paragraph>
                            <Paragraph>{intl.get('procurementItem')}：</Paragraph>
                            <div className={classes.outPutHtml}
                                 dangerouslySetInnerHTML={{__html: showInfo.items}}/>
                            <Paragraph>{intl.get('procurementPrice')}：{showInfo.price} ￥</Paragraph>
                            <Paragraph>{intl.get('reason')}：</Paragraph>
                            <div className={classes.outPutHtml}
                                 dangerouslySetInnerHTML={{__html: showInfo.reason}}/>
                            {showInfo.reject_reason ?
                                <Paragraph>
                                    {intl.get('rejectReason')}：
                                    <Tag color={userToken.colorError}>{showInfo.reject_reason}</Tag>
                                </Paragraph> : null}
                            <Paragraph>{intl.get('createTime')}：{showInfo.create_time}</Paragraph>
                            <Paragraph>{intl.get('updateTime')}：{showInfo.update_time}</Paragraph>
                            <Paragraph>{intl.get('approveProcess')}：</Paragraph>
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
                                            direction="vertical"
                                            progressDot
                                            current={showInfo.count}
                                            status={getProcessStatus(showInfo.status)}
                                            size="small"
                                            items={processList}
                                        />
                                    </div>
                            }
                        </Typography>
                    )}
                </MoveModal>
                <div className={classes.contentHead}>
                    <Title level={2} className={classes.tit}>
                        {intl.get('procurement') + ' ' + intl.get('record')}&nbsp;&nbsp;
                        <RenderGetDataSourceButton/>
                    </Title>
                    <Form name="search" layout="inline" onFinish={onFinish}>
                        <Form.Item name="search">
                            <Input prefix={<SearchOutlined className="site-form-item-icon"/>}
                                   placeholder={intl.get('search') + ' ' + intl.get('procurementItem')}/>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">Search</Button>
                        </Form.Item>
                    </Form>
                </div>
                {
                    isEmpty ? (
                        <Result
                            icon={<FolderOpenOutlined/>}
                            title={intl.get('noData')}
                            extra={<RenderGetDataSourceButton/>}
                        />
                    ) : (
                        userTable.tableType === "virtual" ?
                            <VirtualTable columns={columns} dataSource={showData}
                                          scroll={{y: tableSize.tableHeight, x: tableSize.tableWidth}}/> :
                            <Table
                                columns={columns}
                                dataSource={showData}
                                scroll={{y: tableSize.tableHeight, x: tableSize.tableWidth}}
                                // @ts-ignore
                                pagination={
                                    userTable.tableType === "normal" ? {
                                        position: ["none"]
                                    } : {
                                        // 是否展示 pageSize 切换器
                                        showSizeChanger: true,
                                        // 默认的每页条数
                                        defaultPageSize: userTable.defaultPageSize,
                                        // 指定每页可以显示多少条
                                        pageSizeOptions: ['10', '20', '30', '40', '50', '100', '200', '500', '1000'],
                                    }
                                }
                            />
                    )
                }
            </div>
        </Spin>
    )
};

const ProcurementRecord = () => {
    return (
        <App>
            <MyApp/>
        </App>
    )
}

export default ProcurementRecord;
