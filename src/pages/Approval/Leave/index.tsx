import React, {useEffect, useState} from 'react';
import {App, Button, Form, Input, Modal, Result, Spin, Typography} from 'antd';
import {findLeaveWaitApprovalList, resolveLeave} from "../../../component/axios/api";
import {ColumnsType} from "antd/es/table";
import {ExclamationCircleOutlined, FolderOpenOutlined, SearchOutlined} from "@ant-design/icons";
import Reject from "./Reject";
import {useStyles} from "../../../styles/webStyle";
import MoveModal from '../../../component/MoveModal';
import NormalTable from "../../../component/Table/NormalTable";
import type {DataType} from "../../../component/Table";
import {LoadingIcon} from "../../../component/Icon";

const {Title, Paragraph} = Typography;

const MyApp = () => {

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
    // 详情弹窗
    const [showModal, setShowModal] = useState<boolean>(false);
    // 锁定按钮状态
    const [lock, setLock] = useState<boolean>(false);
    // 是否为空数据
    const [isEmpty, setIsEmpty] = useState<boolean>(false);

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
        setDataSource([]);
        setShowData([]);
        setLoading(true);
        setIsQuery(true)
        setWaitTime(10)
        findLeaveWaitApprovalList().then((res: any) => {
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
                }
            });
            setDataSource(newDataSource);
            setShowData(newDataSource);
        }).finally(() => {
            setLoading(false)
        })
    }

    const showResolveConfirm = (uid: string) => {
        Modal.confirm({
            title: "确认通过审批",
            icon: <ExclamationCircleOutlined/>,
            content: "通过后不可变更，请谨慎操作",
            okText: "确认",
            okType: 'primary',
            cancelText: "取消",
            onOk() {
                setLock(true);
                resolveLeave(uid).then((res: any) => {
                    if (res.code === 200) {
                        message.success(res.msg);
                        setShowModal(false);
                        changeData();
                    }
                }).finally(() => {
                    setLock(false);
                })
            }
        });
    }

    const changeData = () => {
        const newDataSource = dataSource.filter((item: any) => item.uid !== showInfo.uid);
        if (newDataSource.length === 0) {
            setIsEmpty(true)
            setDataSource([])
            setShowData([])
            return
        }
        setDataSource(newDataSource);
        const newShowData = showData.filter((item: any) => item.uid !== showInfo.uid);
        setShowData(newShowData);
        setShowInfo({});
    }

    const onFinish = (values: any) => {
        // 如果什么内容都没有输入，那就把所有数据展示出来
        if (!values.search) {
            setShowData(dataSource);
            return
        }
        // 如果有输入内容，那将 dataSource 中的 reason 进行模糊匹配
        const newShowData = dataSource.filter((item: any) => {
            return item.releaseUid.indexOf(values.search) !== -1
        })
        setShowData(newShowData);
    };

    const columns: ColumnsType<DataType> = [{
        title: 'id',
        dataIndex: 'id',
        align: 'center',
    }, {
        title: "提交人",
        dataIndex: 'releaseUid',
        align: 'center',
    }, {
        title: "请假时间",
        dataIndex: 'start_time',
        align: 'center',
    }, {
        title: "销假时间",
        dataIndex: 'end_time',
        align: 'center',
    }, {
        title: "操作",
        dataIndex: 'operation',
        align: 'center',
        render: (text: any, item: any) => {
            return <Button
                type="primary"
                onClick={() => {
                    setShowInfo(item);
                    setShowModal(true);
                }}>
                查看
            </Button>
        }
    }];

    const RenderGetDataSourceButton = () => {
        return (
            <Button type="primary" disabled={isQuery} icon={<SearchOutlined/>}
                    onClick={getDataSource}>{isQuery ? `刷新(${waitTime})` : "刷新"}</Button>
        )
    }

    return (
        <Spin tip={RenderGetDataSourceButton()} delay={1000} indicator={<LoadingIcon/>} size="large" spinning={loading}>
            <div className={classes.contentBody}>
                <MoveModal
                    title="详情"
                    showModal={showModal}
                    getModalStatus={(e) => setShowModal(e)}
                    footer={[
                        <Reject key="reject" state={showInfo} getNewContent={(isReject: boolean) => {
                            if (isReject) {
                                setShowModal(false);
                                changeData();
                            }
                        }}/>,
                        <Button
                            key="pass"
                            type="primary"
                            disabled={lock}
                            loading={lock}
                            style={{
                                backgroundColor: "green",
                                borderColor: "green"
                            }}
                            onClick={() => showResolveConfirm(showInfo.uid)}
                        >通过</Button>,
                        <Button
                            key="link"
                            disabled={lock}
                            loading={loading}
                            onClick={() => setShowModal(false)}
                        >
                            关闭
                        </Button>,
                    ]}
                >
                    <Typography>
                        <Paragraph>提交人：{showInfo.releaseUid}</Paragraph>
                        <Paragraph>请假时间：{showInfo.start_time}</Paragraph>
                        <Paragraph>销假时间：{showInfo.end_time}</Paragraph>
                        <Paragraph>原因：{showInfo.reason}</Paragraph>
                        <Paragraph>提交时间：{showInfo.create_time}</Paragraph>
                        <Paragraph>更新时间：{showInfo.update_time}</Paragraph>
                    </Typography>
                </MoveModal>
                <div className={classes.contentHead}>
                    <Title level={2} className={classes.tit}>
                        请假审批&nbsp;&nbsp;
                        <RenderGetDataSourceButton/>
                    </Title>
                    <Form name="search" layout="inline" onFinish={onFinish}>
                        <Form.Item name="search">
                            <Input prefix={<SearchOutlined className="site-form-item-icon"/>}
                                   placeholder="搜索提交人"/>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">搜索</Button>
                        </Form.Item>
                    </Form>
                </div>
                {
                    isEmpty ? (
                        <Result
                            icon={<FolderOpenOutlined/>}
                            title="暂无数据"
                            extra={<RenderGetDataSourceButton/>}
                        />
                    ) : (
                        <NormalTable columns={columns} dataSource={showData}/>
                    )
                }
            </div>
        </Spin>
    )
};

const LeaveApproval = () => {
    return (
        <App>
            <MyApp/>
        </App>
    )
}

export default LeaveApproval;
