import {Button, Collapse, Drawer, message, Modal, Table, Typography} from 'antd';
import {ExclamationCircleOutlined, SearchOutlined} from '@ant-design/icons';
import type {ColumnsType} from 'antd/es/table';
import React, {useEffect, useState} from 'react';
import {
    resolveTravel,
    findTravelWaitApprovalList,
    findUploadFilesByUid
} from '../../../component/axios/api';
import {DownLoadURL, green} from "../../../baseInfo";
import {RenderStatusTag} from "../../../component/Tag/RenderStatusTag";
import {RenderStatusColor} from "../../../component/Tag/RenderStatusColor";
import '../index.scss'
import RecordSkeleton from "../../../component/Skeleton/RecordSkeleton";
import RejectTravelReimbursement from "./RejectTravelReimbursement";

const {Title} = Typography;
const {Panel} = Collapse;

const tableName = `travelreimbursement`;

interface DataType {
    key: React.Key;
    name: string;
    age: number;
    address: string;
}

const Index: React.FC = () => {
    // 防止反复查询变更记录
    const [isQuery, setIsQuery] = useState<boolean>(false);
    const [waitTime, setWaitTime] = useState<number>(0);
    const [isRenderResult, setIsRenderResult] = useState<boolean>(true);
    const [dataSource, setDataSource] = useState([]);
    const [content, setContent] = useState<any>({});
    const [fileList, setFileList] = useState<any>([]);
    const [open, setOpen] = useState(false);

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

    // 渲染抽屉
    const RenderDrawer = () => {
        return (
            <Drawer
                title={<span>{RenderStatusTag(content.status)}</span>}
                placement="right"
                open={open}
                onClose={() => {
                    setOpen(false)
                }}
                headerStyle={{
                    backgroundColor: RenderStatusColor(content.status)
                }}
            >
                <p>申请人：{content.releaseUid}</p>
                <p>目的地：{content.destination}</p>
                <p>费用：{content.expenses}</p>
                <p>原因：{content.reason}</p>
                <p>提交时间：{content.create_time}</p>
                <p>更新时间：{content.update_time}</p>
                <div style={{
                    display: 'flex',
                    justifyContent: 'end',
                    marginTop: 16
                }}>
                    <RejectTravelReimbursement state={content} getNewContent={(isReject: boolean) => {
                        if (isReject) {
                            setOpen(false)
                            getDataSource()
                        }
                    }}/>
                    <Button
                        type="primary"
                        style={{
                            backgroundColor: green,
                            borderColor: green,
                            marginLeft: 16
                        }}
                        onClick={() => {
                            showResolveConfirm(content.uid);
                        }}
                    >通过</Button>
                </div>
                {
                    // 如果 fileList 不为空则渲染
                    fileList.length > 0 ? (
                        <Collapse ghost>
                            {/*循环输出 Card，数据来源 fileList*/}
                            {fileList.map((item: any, index: number) => {
                                return (
                                    <Panel header={`附件${index + 1}`} key={index}>
                                        <p>{item.oldFileName}</p>
                                        <a href={`${DownLoadURL}/downloadFile?filename=${item.fileName}`}
                                           target="_self">下载</a>
                                    </Panel>
                                )
                            })}
                        </Collapse>
                    ) : null
                }
            </Drawer>
        )
    }

    // 获取当前记录上传的文件和当前审批流程
    const getInfo = async (uid: string) => {
        const hide = message.loading('正在获取文件列表', 0);
        // 超时自动关闭
        setTimeout(hide, 10000);
        findUploadFilesByUid(uid, tableName).then((res: any) => {
            setFileList(res.body);
            hide();
            setOpen(true)
        }).catch(e => {
            message.error(e.message)
            hide();
        })
    }

    const showResolveConfirm = (e: string) => {
        Modal.confirm({
            title: '确认通过当前申请？',
            icon: <ExclamationCircleOutlined/>,
            content: '通过后不可变更，请谨慎操作',
            okText: '确认',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                resolveTravel(e).then((res: any) => {
                    if (res.code === 200) {
                        message.success(res.msg);
                        setOpen(false);
                        const arr = dataSource.filter((item: any) => item.uid !== e);
                        setDataSource(arr);
                        if (arr.length === 0) {
                            message.warning('暂无待审批记录');
                        }
                    }
                })
            }
        });
    }

    // 表格列
    const columns: ColumnsType<DataType> = [
        {
            title: 'id',
            width: 100,
            dataIndex: 'id',
            key: 'id',
            fixed: 'left',
            align: 'center',
        }, {
            title: '申请人',
            dataIndex: 'releaseUid',
            key: 'releaseUid',
            width: 150,
            align: 'center',
        }, {
            title: '目的地',
            dataIndex: 'destination',
            key: 'destination',
            width: 150,
            align: 'center',
        }, {
            title: '费用',
            dataIndex: 'expenses',
            key: 'expenses',
            width: 150,
            align: 'center',
        }, {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            width: 150,
            align: 'center',
            render: (text: number, record: any) => {
                return (
                    RenderStatusTag(text, "差旅报销申请")
                )
            }
        }, {
            title: '操作',
            key: 'uid',
            dataIndex: 'uid',
            fixed: 'right',
            width: 100,
            align: 'center',
            render: (text: any, record: any) => {
                return (
                    <Button
                        type="primary"
                        onClick={() => {
                            setContent(record)
                            getInfo(text)
                        }}
                        style={{
                            backgroundColor: RenderStatusColor(record.status),
                            borderColor: RenderStatusColor(record.status)
                        }}
                    >查看</Button>
                );
            }
        },
    ];

    useEffect(() => {
        getDataSource();
    }, [])

    // 获取所有数据
    const getDataSource = () => {
        setIsQuery(true)
        setWaitTime(10)
        // 防止多次点击
        if (isQuery) {
            return
        }
        setIsRenderResult(true)
        findTravelWaitApprovalList().then((res: any) => {
            if (res.code === 200) {
                const arr = res.body.map((item: any, index: number) => {
                    return {
                        ...item,
                        key: item.uid,
                        id: index + 1,
                    }
                })
                setDataSource(arr)
                setIsQuery(false)
                setWaitTime(0)
                setIsRenderResult(false)
            } else {
                setIsRenderResult(false)
                message.warning(res.msg)
                setDataSource([])
            }
        }).catch(err => {
            setIsRenderResult(false)
            message.error(err.message)
        })
    }

    return isRenderResult ?
        <RecordSkeleton/> : (
            <div className={'record-body'}>
                <RenderDrawer/>
                <Title level={2} className={'tit'}>
                    差旅报销申请记录&nbsp;&nbsp;
                    <Button type="primary" icon={<SearchOutlined/>} onClick={getDataSource}>刷新</Button>
                </Title>
                <Table
                    columns={columns}
                    dataSource={dataSource}
                    scroll={{x: 1000}}
                    sticky={true}
                    pagination={{
                        showSizeChanger: true,
                        total: dataSource.length,
                        showQuickJumper: true,
                        pageSizeOptions: [5, 10, 20, 50, 100, 200],
                        defaultPageSize: 5,
                        hideOnSinglePage: true
                    }}
                />
            </div>
        );
};

export default Index;