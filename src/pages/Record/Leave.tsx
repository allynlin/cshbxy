import React, {useEffect, useState, useRef} from 'react';
import domtoimage from 'dom-to-image';
import VirtualTable from "../../component/VirtualTable";
import {
    Card,
    Button,
    Form,
    Input,
    Modal,
    Popconfirm,
    Skeleton,
    Space,
    Steps,
    Tag,
    Typography,
    Watermark,
    App,
    Result
} from 'antd';
import {deleteLeave, findLeaveList, findLeaveProcess, refreshLeave} from "../../component/axios/api";
import {ColumnsType} from "antd/es/table";
import intl from "react-intl-universal";
import {RenderStatusTag} from "../../component/Tag/RenderStatusTag";
import {FolderOpenOutlined, SearchOutlined} from "@ant-design/icons";
import {useSelector} from "react-redux";
import {RenderWatermarkColor} from "../../component/Tag/RenderWatermarkColor";
import {useStyles} from "../../styles/webStyle";
import {getProcessStatus} from '../../component/getProcessStatus';
import {RenderVirtualTableSkeleton} from "../../component/RenderVirtualTableSkeleton";

const {Title, Paragraph} = Typography;
const {Meta} = Card;

interface DataType {
    key: React.Key;
    dataIndex: string;
    align: 'left' | 'right' | 'center';
}

const MyApp: React.FC = () => {

    const classes = useStyles();

    const {message} = App.useApp();

    const ref = useRef<any>(null);

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
    // 生成图片模式
    const [showImage, setShowImage] = useState<boolean>(false);
    // 是否为空数据
    const [isEmpty, setIsEmpty] = useState<boolean>(false);

    const tableSize = useSelector((state: any) => state.tableSize.value)
    const userToken = useSelector((state: any) => state.userToken.value)
    const userInfo = useSelector((state: any) => state.userInfo.value)

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
        refreshLeave(uid).then(res => {
            message.open({
                key,
                type: 'success',
                content: res.msg
            })
            let newContent = {
                key: res.body.uid,
                id: showInfo.id,
                tag: RenderStatusTag(res.body),
                operation: <Button
                    type="primary"
                    onClick={() => {
                        setShowInfo({...res.body, id: showInfo.id})
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
        findLeaveProcess(uid).then((res: any) => {
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
        setIsEmpty(false)
        setLoading(true);
        setIsQuery(true)
        setWaitTime(10)
        findLeaveList().then(res => {
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
                    tag: RenderStatusTag(item),
                    operation: <Button
                        type="primary"
                        onClick={() => {
                            setShowInfo({...item, id: index + 1});
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
            return item.reason.indexOf(values.search) !== -1
        })
        setShowData(newShowData);
    };

    // 删除当前项
    const deleteItem = (uid: string) => {
        setConfirmLoading(true);
        setOpen(false)
        deleteLeave(uid).then((res: any) => {
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

    const savePic = () => {
        setTimeout(() => {
            domtoimage.toPng(ref.current).then((dataUrl) => {
                const downloadLink = document.createElement('a');
                downloadLink.href = dataUrl;
                downloadLink.download = 'my-image.jpg';
                downloadLink.click();
            }).catch((error) => {
                message.error(intl.get('sysError'));
                console.error('oops, something went wrong!', error);
            }).finally(() => {
                setShowImage(false)
                setLoading(false)
                setIsRefresh(false)
            })
        }, 1000)
    }

    const getStatus = (status: number) => {
        switch (status) {
            case 0:
                return intl.get('underApprove')
            case 1:
                return intl.get('passApprove')
            case 2:
                return intl.get('rejectApprove')
            default:
                return intl.get('errorApprove')
        }
    }

    const RenderGetDataSourceButton = () => {
        return (
            <Button type="primary" disabled={isQuery} icon={<SearchOutlined/>}
                    onClick={getDataSource}>{isQuery ? `${intl.get('refresh')}(${waitTime})` : intl.get('refresh')}</Button>
        )
    }

    return (
        <div className={classes.contentBody}>
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
                            refresh(showInfo.uid)
                        }}
                        disabled={isRefresh}>
                        {isRefresh ? `${intl.get('refreshProcessList')}(${isRefreshWaitTime})` : intl.get('refreshProcessList')}
                    </Button>,
                    <Button
                        key="save"
                        type="primary"
                        loading={loading}
                        onClick={() => {
                            setLoading(true)
                            setIsRefresh(true)
                            setShowImage(true)
                            savePic()
                        }}
                    >
                        {intl.get('savePicture')}
                    </Button>,
                    <Button
                        key="link"
                        loading={loading}
                        onClick={() => setShowModal(false)}
                    >
                        {intl.get('close')}
                    </Button>
                ]}
            >
                {

                    showImage ?
                        <div ref={ref} style={{
                            padding: showImage ? 16 : 0
                        }}>
                            <Card>
                                <Watermark
                                    content={["OA", userInfo.realeName, getStatus(showInfo.status)]}
                                    gap={[70, 70]}
                                    font={{
                                        color: RenderWatermarkColor(showInfo.status),
                                    }}
                                >
                                    <Title level={2} className={classes.tit}>
                                        {intl.get('leave') + ' ' + intl.get('record')}
                                    </Title>
                                    {showContent ? (<Skeleton active/>) : (
                                        <>
                                            <p>UID：{showInfo.uid}</p>
                                            <p>{intl.get('startTime')}：{showInfo.start_time}</p>
                                            <p>{intl.get('endTime')}：{showInfo.end_time}</p>
                                            <p>{intl.get('reason')}：{showInfo.reason}</p>
                                            {showInfo.reject_reason ?
                                                <p>
                                                    {intl.get('rejectReason')}：
                                                    <Tag color={userToken.colorError}>{showInfo.reject_reason}</Tag>
                                                </p> : null}
                                            <p>{intl.get('createTime')}：{showInfo.create_time}</p>
                                            <p>{intl.get('updateTime')}：{showInfo.update_time}</p>
                                            <div>{intl.get('approveProcess')}：</div>
                                            {processLoading ? (
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
                                                </div>}
                                        </>
                                    )}
                                </Watermark>
                                <Meta title={userInfo.realeName + ' ' + userInfo.uid} description={
                                    <>
                                        <Tag>{userInfo.departmentUid}</Tag>
                                        <Tag>{userInfo.gender}</Tag>
                                        <Tag>{userInfo.email}</Tag>
                                        <Tag>{userInfo.tel}</Tag>
                                    </>
                                }/>
                            </Card>
                        </div> :
                        <>
                            {showContent ? (<Skeleton active/>) : (
                                <Typography>
                                    <Paragraph>{intl.get('startTime')}：{showInfo.start_time}</Paragraph>
                                    <Paragraph>{intl.get('endTime')}：{showInfo.end_time}</Paragraph>
                                    <Paragraph>{intl.get('reason')}：{showInfo.reason}</Paragraph>
                                    {showInfo.reject_reason ?
                                        <Paragraph>
                                            {intl.get('rejectReason')}：
                                            <Tag color={userToken.colorError}>{showInfo.reject_reason}</Tag>
                                        </Paragraph> : null}
                                    <Paragraph>{intl.get('createTime')}：{showInfo.create_time}</Paragraph>
                                    <Paragraph>{intl.get('updateTime')}：{showInfo.update_time}</Paragraph>
                                    <Paragraph>{intl.get('approveProcess')}：</Paragraph>
                                    {processLoading ? (
                                            <Space style={{flexDirection: 'column'}}>
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
                                        </div>}
                                </Typography>
                            )}
                        </>
                }
            </Modal>
            <div className={classes.contentHead}>
                <Title level={2} className={classes.tit}>
                    {intl.get('leave') + ' ' + intl.get('record')}&nbsp;&nbsp;
                    <RenderGetDataSourceButton/>
                </Title>
                <Form name="search" layout="inline" onFinish={onFinish}>
                    <Form.Item name="search">
                        <Input prefix={<SearchOutlined className="site-form-item-icon"/>}
                               placeholder={intl.get('search') + ' ' + intl.get('reason')}/>
                    </Form.Item>
                    <Form.Item>
                        <Button disabled={isEmpty} type="primary" htmlType="submit">Search</Button>
                    </Form.Item>
                </Form>
            </div>
            <div className={classes.skeletonLoading} style={{display: loading ? 'block' : 'none'}}>
                <RenderVirtualTableSkeleton/>
            </div>
            {
                isEmpty ? (
                    <Result
                        icon={<FolderOpenOutlined/>}
                        title={intl.get('noData')}
                        extra={<RenderGetDataSourceButton/>}
                    />
                ) : (
                    <VirtualTable columns={columns} dataSource={showData}
                                  scroll={{y: tableSize.tableHeight, x: tableSize.tableWidth}}/>
                )
            }
        </div>
    )
};

const LeaveRecord = () => {
    return (
        <App>
            <MyApp/>
        </App>
    )
}

export default LeaveRecord;
