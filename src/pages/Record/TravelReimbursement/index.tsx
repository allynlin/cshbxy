import {
    Table,
    Typography,
    Button,
    Drawer,
    Modal,
    message,
    Steps,
    Collapse,
    Result
} from 'antd';
import {ExclamationCircleOutlined, LoadingOutlined} from '@ant-design/icons';
import type {ColumnsType} from 'antd/es/table';
import React, {useEffect, useState} from 'react';
import {
    findTravelProcess,
    findUploadFilesByUid,
    deleteTravelReimbursementApply,
    findTravelReimbursementApplyList
} from '../../../component/axios/api';
import {DownLoadURL} from "../../../baseInfo";
import {red} from "../../../baseInfo";
import {RenderStatusTag} from "../../../component/Tag/RenderStatusTag";
import {RenderStatusColor} from "../../../component/Tag/RenderStatusColor";
import '../index.scss'
import {UpdateTravel} from "./UpdateTravel";

const {Title} = Typography;
const {Step} = Steps;
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
    const [RenderResultTitle, setRenderResultTitle] = useState<String>('正在获取差旅报销记录');
    const [isRenderInfo, setIsRenderInfo] = useState<boolean>(false);
    const [dataSource, setDataSource] = useState([]);
    const [content, setContent] = useState<any>({});
    const [fileList, setFileList] = useState<any>([]);
    const [processList, setProcessList] = useState<any>([]);
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
                mask={false}
                headerStyle={{
                    backgroundColor: RenderStatusColor(content.status)
                }}
                bodyStyle={{
                    backdropFilter: 'blur(20px) saturate(180%)',
                    backgroundColor: 'rgba(255, 255, 255, 0.6)'
                }}
            >
                <p>目的地：{content.destination}</p>
                <p>出差费用：{content.expenses}</p>
                <p>出差原因：{content.reason}</p>
                <p>申请状态：{RenderStatusTag(content.status, '差旅报销申请')}</p>
                <p>提交时间：{content.create_time}</p>
                <p>更新时间：{content.update_time}</p>
                <div style={{
                    display: 'flex',
                    justifyContent: 'end',
                    marginTop: 16
                }}>
                    <UpdateTravel
                        state={content}
                        fileList={fileList}
                        getNewContent={() => {
                            setOpen(false)
                            getDataSource()
                        }}
                    />
                    <Button
                        type="primary"
                        style={{
                            backgroundColor: red,
                            borderColor: red
                        }}
                        onClick={() => {
                            showDeleteConfirm(content.uid);
                        }}
                    >删除</Button>
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
                <div style={{marginTop: 16}}>
                    审批流程：
                    <Steps
                        style={{
                            marginTop: 16
                        }}
                        direction="vertical"
                        size="small"
                        current={content.count}
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
            </Drawer>
        )
    }

    // 获取当前记录上传的文件和当前审批流程
    const getInfo = async (uid: string) => {
        const hide = message.loading('正在获取文件列表和审批流程', 0);
        // 超时自动关闭
        setTimeout(hide, 10000);
        const list: boolean = await findTravelProcess(uid).then((res: any) => {
            setProcessList(res.body);
            return true;
        })
        const file: boolean = await findUploadFilesByUid(uid, tableName).then((res: any) => {
            setFileList(res.body);
            return true;
        })
        if (list && file) {
            hide();
            setOpen(true)
        }
    }

    // 删除确认框
    const showDeleteConfirm = (e: string) => {
        Modal.confirm({
            title: '要删除这条记录吗？',
            icon: <ExclamationCircleOutlined/>,
            content: '删除后不可恢复，如果您确定删除请点击确认',
            okText: '确认',
            okType: 'danger',
            cancelText: '取消',
            style: {
                backdropFilter: 'blur(20px) saturate(180%)',
                backgroundColor: 'rgba(255,255,255,0.6)'
            },
            mask: false,
            onOk() {
                deleteTravelReimbursementApply(e).then((res: any) => {
                    if (res.code === 200) {
                        message.success(res.msg);
                        setOpen(false);
                        const arr = dataSource.filter((item: any) => item.uid !== e);
                        setDataSource(arr);
                        if (arr.length === 0) {
                            setIsRenderResult(true);
                            setIsRenderInfo(true);
                            setRenderResultTitle('暂无部门变更记录');
                        }
                    } else {
                        message.error('删除失败');
                    }
                })
            }
        });
    };

    // 表格列
    const columns: ColumnsType<DataType> = [
        {
            title: 'id',
            width: 100,
            dataIndex: 'id',
            key: 'id',
            fixed: 'left',
            align: 'center',
        },
        {
            title: '目的地',
            dataIndex: 'destination',
            key: 'destination',
            width: 150,
            align: 'center',
        },
        {
            title: '费用',
            dataIndex: 'expenses',
            key: 'expenses',
            width: 150,
            align: 'center',
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            width: 150,
            align: 'center',
            render: (text: number) => {
                return (
                    RenderStatusTag(text, "差旅报销申请")
                )
            }
        },
        {
            title: '提交时间',
            dataIndex: 'create_time',
            key: 'create_time',
            width: 150,
            align: 'center',
        },
        {
            title: '更新时间',
            dataIndex: 'update_time',
            key: 'update_time',
            width: 150,
            align: 'center',
        },
        {
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
        findTravelReimbursementApplyList().then((res: any) => {
            if (res.code === 200) {
                const arr = res.body.map((item: any, index: number) => {
                    return {
                        key: item.uid,
                        id: index + 1,
                        destination: item.destination,
                        expenses: item.expenses,
                        reason: item.reason,
                        status: parseInt(item.status),
                        nextUid: item.nextUid,
                        count: parseInt(item.count),
                        create_time: item.create_time,
                        update_time: item.update_time,
                        uid: item.uid,
                    }
                })
                setDataSource(arr)
                setIsQuery(false)
                setWaitTime(0)
                setIsRenderResult(false)
            } else {
                setIsRenderInfo(true)
                setRenderResultTitle(res.msg)
            }
        }).catch(err => {
            setIsRenderInfo(true)
            setRenderResultTitle(err.message)
            setIsRenderResult(true)
        })
    }

    return isRenderResult ? (
        <Result
            status="info"
            icon={
                isRenderInfo ? '' : <LoadingOutlined
                    style={{
                        fontSize: 40,
                    }}
                    spin
                />
            }
            title={RenderResultTitle}
            extra={
                <Button disabled={isQuery} type="primary" onClick={() => {
                    getDataSource()
                }}>
                    {isQuery ? `刷新(${waitTime})` : `刷新`}
                </Button>
            }
        />) : (
        <div className={'record-body'}>
            <RenderDrawer/>
            <Title level={2} className={'tit'}>差旅报销申请记录</Title>
            <Table
                columns={columns}
                dataSource={dataSource}
                scroll={{x: 1500}}
                sticky
            />
        </div>
    );
};

export default Index;
