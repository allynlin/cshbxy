import React, { useEffect, useState } from 'react';
import VirtualTable from "../../component/VirtualTable";
import { App, Button, Card, Form, Input, Popconfirm, Result, Skeleton, Space, Spin, Steps, Tag, Typography } from 'antd';
import {
    deleteTravelReimbursementApply,
    findTravelProcess,
    findTravelReimbursementApplyList,
    findUploadFilesByUid,
    refreshTravel
} from "../../component/axios/api";
import { ColumnsType } from "antd/es/table";
import intl from "react-intl-universal";
import { RenderStatus } from "../../component/Tag/RenderStatus";
import { FileTextOutlined, FolderOpenOutlined, SearchOutlined } from "@ant-design/icons";
import { DownLoadURL, tableName } from "../../baseInfo";
import { useSelector } from "react-redux";
import { useStyles } from "../../styles/webStyle";
import { getProcessStatus } from '../../component/getProcessStatus';
import { RenderVirtualTableSkeleton } from "../../component/RenderVirtualTableSkeleton";
import { RenderStatusTag } from "../../component/Tag/RenderStatusTag";
import MoveModal from "../../component/MoveModal";

const { Title, Paragraph } = Typography;

interface DataType {
    key: React.Key;
    dataIndex: string;
    align: 'left' | 'right' | 'center';
}

const MyApp: React.FC = () => {

    const classes = useStyles();

    const { message } = App.useApp();

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
    // 是否为空数据
    const [isEmpty, setIsEmpty] = useState<boolean>(false);

    const tableSize = useSelector((state: any) => state.tableSize.value);
    const userToken = useSelector((state: any) => state.userToken.value);

    const key = "refresh"
    const getFile = "getFile"

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
        refreshTravel(uid).then(res => {
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
                        setShowInfo({ ...res.body, id: showInfo.id, statusTag: RenderStatusTag(res.body) });
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
        findTravelProcess(uid).then((res: any) => {
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

    const getFiles = (uid: string) => {
        message.open({
            key: getFile,
            type: 'loading',
            content: intl.get("gettingFileList"),
            duration: 0,
        })
        setFileLoading(true)
        findFiles(uid)
    }

    const findFiles = (uid: string) => {
        findUploadFilesByUid(uid, tableName.travel).then((res: any) => {
            setFileLoading(false)
            if (res.code !== 200) {
                message.open({
                    key: getFile,
                    type: 'error',
                    content: res.msg,
                })
            }
            setFileList(res.body);
            message.open({
                key: getFile,
                type: 'success',
                content: res.msg,
            })
        }).catch(() => {
            message.open({
                key: getFile,
                type: 'loading',
                content: intl.get('tryingAgain'),
                duration: 0,
            })
            findFiles(uid)
        })
    }

    useEffect(() => {
        getDataSource();
    }, [])

    // 获取所有数据
    const getDataSource = () => {
        setIsEmpty(false)
        setLoading(true);
        setIsQuery(true)
        setWaitTime(10)
        findTravelReimbursementApplyList().then((res: any) => {
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
                            setShowInfo({ ...item, id: index + 1, statusTag: RenderStatusTag(item) });
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
            return item.destination.indexOf(values.search) !== -1
        })
        setShowData(newShowData);
    };

    // 删除当前项
    const deleteItem = (uid: string) => {
        setConfirmLoading(true);
        setOpen(false)
        deleteTravelReimbursementApply(uid).then((res: any) => {
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
        title: intl.get('destination'),
        dataIndex: 'destination',
        align: 'center',
    }, {
        title: intl.get('cost'),
        dataIndex: 'expenses',
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
            <Button type="primary" disabled={isQuery} icon={<SearchOutlined />}
                onClick={getDataSource}>{isQuery ? `${intl.get('refresh')}(${waitTime})` : intl.get('refresh')}</Button>
        )
    }

    return (
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
                showModal={showModal}
                getModalStatus={(e) => setShowModal(e)}
            >
                {showContent ? (<Skeleton active />) : (
                    <Typography>
                        <Paragraph>{intl.get('status')}：{showInfo.statusTag}</Paragraph>
                        <Paragraph>{intl.get('destination')}：{showInfo.destination}</Paragraph>
                        <Paragraph>{intl.get('cost')}：{showInfo.expenses}</Paragraph>
                        <Paragraph>{intl.get('reason')}：</Paragraph>
                        <div className={classes.outPutHtml}
                            dangerouslySetInnerHTML={{ __html: showInfo.reason }} />
                        {showInfo.reject_reason ?
                            <Paragraph>
                                {intl.get('rejectReason')}：
                                <Tag color={userToken.colorError}>{showInfo.reject_reason}</Tag>
                            </Paragraph> : null}
                        <Paragraph>{intl.get('createTime')}：{showInfo.create_time}</Paragraph>
                        <Paragraph>{intl.get('updateTime')}：{showInfo.update_time}</Paragraph>
                        <Paragraph>{intl.get('file')}：</Paragraph>
                        {
                            fileLoading ? (
                                <div className={classes.skeletonFile}>
                                    <Skeleton.Node active>
                                        <FileTextOutlined className={classes.skeletonFiles} />
                                    </Skeleton.Node>
                                </div>
                            ) :
                                // 如果 fileList 不为空则渲染
                                fileList.length > 0 ? (
                                    <>
                                        <div className={classes.showFile}>
                                            {fileList.map((item: any, index: number) => {
                                                return (
                                                    <Card size="small" className={classes.fileItem} hoverable
                                                        key={index}
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
                        <Paragraph>{intl.get('approveProcess')}：</Paragraph>
                        {
                            processLoading ? (
                                <Space style={{ flexDirection: 'column', marginTop: 16 }}>
                                    <Skeleton.Input active={true} block={false} />
                                    <Skeleton.Input active={true} block={false} />
                                    <Skeleton.Input active={true} block={false} />
                                    <Skeleton.Input active={true} block={false} />
                                </Space>) :
                                <div style={{ marginTop: 16 }}>
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
                    {intl.get('travelReimburse') + ' ' + intl.get('record')}&nbsp;&nbsp;
                    <RenderGetDataSourceButton />
                </Title>
                <Form name="search" layout="inline" onFinish={onFinish}>
                    <Form.Item name="search">
                        <Input prefix={<SearchOutlined className="site-form-item-icon" />}
                            placeholder={intl.get('search') + ' ' + intl.get('department')} />
                    </Form.Item>
                    <Form.Item>
                        <Button disabled={isEmpty} type="primary" htmlType="submit">Search</Button>
                    </Form.Item>
                </Form>
            </div>
            <div className={classes.skeletonLoading} style={{ display: loading ? 'block' : 'none' }}>
                <RenderVirtualTableSkeleton />
            </div>
            {
                loading ? <Skeleton active /> :
                    isEmpty ? (
                        <Result
                            icon={<FolderOpenOutlined />}
                            title={intl.get('noData')}
                            extra={<RenderGetDataSourceButton />}
                        />
                    ) : (
                        <VirtualTable columns={columns} dataSource={showData}
                            scroll={{ y: tableSize.tableHeight, x: tableSize.tableWidth }} />
                    )
            }
        </div>
    )
};

const TravelRecord = () => {
    return (
        <App>
            <MyApp />
        </App>
    )
}

export default TravelRecord;
