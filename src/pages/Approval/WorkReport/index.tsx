import React, {useEffect, useState} from 'react';
import VirtualTable from "../../../component/virtualTable/VirtualTable";
import {Button, message, Skeleton, Typography, Form, Input, Modal, Card} from 'antd';
import {
    findTravelWaitApprovalList,
    findUploadFilesByUid, findWorkReportWaitApprovalList, resolveTravel, resolveWorkReport
} from "../../../component/axios/api";
import {ColumnsType} from "antd/es/table";
import intl from "react-intl-universal";
import '../../../App.scss';
import {ExclamationCircleOutlined, FileTextOutlined, SearchOutlined} from "@ant-design/icons";
import {DownLoadURL, greenButton} from "../../../baseInfo";
import {useSelector} from "react-redux";
import Reject from "./Reject";

const {Title} = Typography;

interface DataType {
    key: React.Key;
    dataIndex: string;
    align: 'left' | 'right' | 'center';
}

const tableName = `WorkReport`;

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
    // 详情弹窗
    const [showModal, setShowModal] = useState<boolean>(false);
    // 锁定按钮状态
    const [lock, setLock] = useState<boolean>(false);
    // 关联文件
    const [fileLoading, setFileLoading] = useState<boolean>(true);
    const [fileList, setFileList] = useState<any>([]);

    const tableSize = useSelector((state: any) => state.tableSize.value)

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
        findWorkReportWaitApprovalList().then((res: any) => {
            if (res.code === 200) {
                const newDataSource = res.body.map((item: any, index: number) => {
                    return {
                        ...item,
                        id: index + 1,
                        key: item.uid,
                        operation: <Button
                            type="primary"
                            onClick={() => {
                                setShowInfo({...item, id: index + 1});
                                getFiles(item.uid);
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

    const getFiles = (uid: string) => {
        let msg: any;
        setFileLoading(true)
        const hide = setTimeout(() => msg = message.loading(intl.get('gettingFileList'), 0), 500);
        findUploadFilesByUid(uid, tableName).then((res: any) => {
            setFileList(res.body);
        }).finally(() => {
            clearTimeout(hide)
            msg && msg();
            setFileLoading(false)
        })
    }

    const showResolveConfirm = (uid: string) => {
        Modal.confirm({
            title: intl.get('confirmPassApprove'),
            icon: <ExclamationCircleOutlined/>,
            content: intl.get('afterPassCannotChange'),
            okText: intl.get('ok'),
            okButtonProps: {style: greenButton},
            okType: 'primary',
            cancelText: intl.get('cancel'),
            onOk() {
                setLock(true);
                resolveWorkReport(uid).then((res: any) => {
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
        setDataSource(newDataSource);
        const newShowData = showData.filter((item: any) => item.uid !== showInfo.uid);
        setShowData(newShowData);
        setShowInfo({});
        if (newDataSource.length === 0) {
            message.warning(intl.get('noRecord'));
        }
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
        title: intl.get('createTime'),
        dataIndex: 'create_time',
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
                    <Button
                        key="refresh"
                        type="primary"
                        loading={fileLoading}
                        onClick={() => getFiles(showInfo.uid)}
                        disabled={fileLoading}>
                        {fileLoading ? intl.get('gettingFileList') : intl.get('refreshFileList')}
                    </Button>,
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
                        style={greenButton}
                        onClick={() => showResolveConfirm(showInfo.uid)}
                    >{intl.get('pass')}</Button>,
                    <Button
                        key="link"
                        type="primary"
                        disabled={lock}
                        loading={loading}
                        onClick={() => setShowModal(false)}
                    >
                        {intl.get('close')}
                    </Button>,
                ]}
            >
                <p>{intl.get('submitPerson')}：{showInfo.releaseUid}</p>
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
                    ) : <div className="showFile">
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
                }
            </Modal>
            <div className="record-head">
                <Title level={2} className={'tit'}>
                    {intl.get('workReport') + ' ' + intl.get('approve')}&nbsp;&nbsp;
                    <Button type="primary" disabled={isQuery} icon={<SearchOutlined/>}
                            onClick={getDataSource}>{isQuery ? `${intl.get('refresh')}(${waitTime})` : intl.get('refresh')}</Button>
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
