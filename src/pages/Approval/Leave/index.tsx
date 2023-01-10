import React, {useEffect, useState} from 'react';
import VirtualTable from "../../../component/VirtualTable";
import {App, Button, Form, Input, Modal, Result, Typography} from 'antd';
import {findLeaveWaitApprovalList, resolveLeave} from "../../../component/axios/api";
import {ColumnsType} from "antd/es/table";
import intl from "react-intl-universal";
import {ExclamationCircleOutlined, FolderOpenOutlined, SearchOutlined} from "@ant-design/icons";
import {useSelector} from "react-redux";
import Reject from "./Reject";
import {useStyles} from "../../../styles/webStyle";
import {RenderVirtualTableSkeleton} from "../../../component/RenderVirtualTableSkeleton";
import {useGaussianBlurStyles} from "../../../styles/gaussianBlurStyle";
import MoveModal from '../../../component/MoveModal';

const {Title, Paragraph} = Typography;

interface DataType {
    key: React.Key;
    dataIndex: string;
    align: 'left' | 'right' | 'center';
}

const MyApp = () => {

    const classes = useStyles();
    const gaussianBlurClasses = useGaussianBlurStyles();

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

    const tableSize = useSelector((state: any) => state.tableSize.value)
    const userToken = useSelector((state: any) => state.userToken.value)
    const gaussianBlur = useSelector((state: any) => state.gaussianBlur.value)

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
                    operation: <Button
                        type="primary"
                        onClick={() => {
                            setShowInfo({...item, id: index + 1});
                            setShowModal(true);
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

    const showResolveConfirm = (uid: string) => {
        Modal.confirm({
            title: intl.get('confirmPassApprove'),
            icon: <ExclamationCircleOutlined/>,
            content: intl.get('afterPassCannotChange'),
            okText: intl.get('ok'),
            mask: !gaussianBlur,
            className: gaussianBlur ? gaussianBlurClasses.gaussianBlurModalMethod : '',
            okButtonProps: {
                style: {
                    backgroundColor: userToken.colorSuccess,
                    borderColor: userToken.colorSuccess,
                }
            },
            okType: 'primary',
            cancelText: intl.get('cancel'),
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
        title: intl.get('submitPerson'),
        dataIndex: 'releaseUid',
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
        <div className={classes.contentBody}>
            <MoveModal
                title={intl.get('details')}
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
                            backgroundColor: userToken.colorSuccess,
                            borderColor: userToken.colorSuccess
                        }}
                        onClick={() => showResolveConfirm(showInfo.uid)}
                    >{intl.get('pass')}</Button>,
                    <Button
                        key="link"
                        disabled={lock}
                        loading={loading}
                        onClick={() => setShowModal(false)}
                    >
                        {intl.get('close')}
                    </Button>,
                ]}
            >
                <Typography>
                    <Paragraph>{intl.get('submitPerson')}：{showInfo.releaseUid}</Paragraph>
                    <Paragraph>{intl.get('startTime')}：{showInfo.start_time}</Paragraph>
                    <Paragraph>{intl.get('endTime')}：{showInfo.end_time}</Paragraph>
                    <Paragraph>{intl.get('reason')}：</Paragraph>
                    <div className={classes.outPutHtml}
                         dangerouslySetInnerHTML={{__html: showInfo.reason}}/>
                    <Paragraph>{intl.get('createTime')}：{showInfo.create_time}</Paragraph>
                    <Paragraph>{intl.get('updateTime')}：{showInfo.update_time}</Paragraph>
                </Typography>
            </MoveModal>
            <div className={classes.contentHead}>
                <Title level={2} className={classes.tit}>
                    {intl.get('leave') + ' ' + intl.get('approve')}&nbsp;&nbsp;
                    <RenderGetDataSourceButton/>
                </Title>
                <Form name="search" layout="inline" onFinish={onFinish}>
                    <Form.Item name="search">
                        <Input prefix={<SearchOutlined className="site-form-item-icon"/>}
                               placeholder={intl.get('search') + ' ' + intl.get('submitPerson')}/>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">Search</Button>
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

const LeaveApproval = () => {
    return (
        <App>
            <MyApp/>
        </App>
    )
}

export default LeaveApproval;
