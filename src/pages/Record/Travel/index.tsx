import {Button, Collapse, Drawer, message, Modal, Skeleton, Space, Steps, Table, Tag, Typography} from 'antd';
import {ExclamationCircleOutlined, SearchOutlined} from '@ant-design/icons';
import type {ColumnsType} from 'antd/es/table';
import React, {useEffect, useState} from 'react';
import {
    deleteTravelReimbursementApply,
    findTravelProcess,
    findTravelReimbursementApplyList,
    findUploadFilesByUid,
    refreshTravel
} from '../../../component/axios/api';
import {DownLoadURL, red} from "../../../baseInfo";
import {RenderStatusTag} from "../../../component/Tag/RenderStatusTag";
import {RenderStatusColor} from "../../../component/Tag/RenderStatusColor";
import '../index.scss'
import RecordSkeleton from "../../../component/Skeleton/RecordSkeleton";
import intl from "react-intl-universal";

const {Title} = Typography;
const {Step} = Steps;
const {Panel} = Collapse;

const tableName = `Travel`;

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
    const [processList, setProcessList] = useState<any>([]);
    const [open, setOpen] = useState(false);
    const [openUid, setOpenUid] = useState<string>('');

    const [fileLoading, setFileLoading] = useState<boolean>(true);
    const [processLoading, setProcessLoading] = useState<boolean>(true);

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
        // 当 content 变化时，在 dataSource 中找到对应的 uid，将 content 赋值给 dataSource 中的对应 uid
        let newDataSource: any = dataSource.map((item: any) => {
            if (item.uid === content.uid) {
                return content
            } else {
                return item
            }
        })
        setDataSource(newDataSource)
    }, [content])

    // 获取当前记录上传的文件和当前审批流程
    const getInfo = async (uid: string) => {
        setOpen(true)
        getProcess(uid);
        getFiles(uid);
    }

    const getProcess = (uid: string) => {
        setProcessLoading(true)
        const hide = message.loading(intl.get('gettingProcessList'), 0);
        findTravelProcess(uid).then((res: any) => {
            setProcessList(res.body);
        }).finally(() => {
            hide()
            setProcessLoading(false)
        })
    }

    const getFiles = (uid: string) => {
        setFileLoading(true)
        const hide = message.loading(intl.get('gettingFileList'), 0);
        findUploadFilesByUid(uid, tableName).then((res: any) => {
            setFileList(res.body);
        }).finally(() => {
            hide()
            setFileLoading(false)
        })
    }

    const refresh = (uid: string) => {
        setIsQuery(true)
        setWaitTime(10)
        if (isQuery) {
            return
        }
        refreshTravel(uid).then(res => {
            let newContent = {
                key: content.key,
                id: content.id,
                ...res.body
            }
            setContent(newContent)
        })
    }

    // 删除确认框
    const showDeleteConfirm = (e: string) => {
        Modal.confirm({
            title: intl.get('deleteConfirm'),
            icon: <ExclamationCircleOutlined/>,
            content: intl.get('deleteCannotBeUndone'),
            okText: intl.get('ok'),
            okType: 'danger',
            cancelText: intl.get('cancel'),
            onOk() {
                deleteTravelReimbursementApply(e).then((res: any) => {
                    if (res.code === 200) {
                        message.success(res.msg);
                        setOpen(false);
                        const arr = dataSource.filter((item: any) => item.uid !== e);
                        setDataSource(arr);
                        if (arr.length === 0) {
                            setIsRenderResult(true);
                            message.warning(intl.get('noTravelReimburseList'));
                        }
                    } else {
                        message.error(intl.get('deleteError'));
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
        }, {
            title: intl.get('destination'),
            dataIndex: 'destination',
            key: 'destination',
            width: 150,
            align: 'center',
        }, {
            title: intl.get('cost'),
            dataIndex: 'expenses',
            key: 'expenses',
            width: 150,
            align: 'center',
        }, {
            title: intl.get('status'),
            dataIndex: 'status',
            key: 'status',
            width: 150,
            align: 'center',
            render: (text: number) => {
                return (
                    RenderStatusTag(text, intl.get('travelReimburseApply'))
                )
            }
        }, {
            title: intl.get('operate'),
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
                            setOpenUid(text)
                        }}
                        style={{
                            backgroundColor: RenderStatusColor(record.status),
                            borderColor: RenderStatusColor(record.status)
                        }}
                    >{intl.get('check')}</Button>
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
        findTravelReimbursementApplyList().then((res: any) => {
            if (res.code === 200) {
                const arr = res.body.map((item: any, index: number) => {
                    return {
                        ...item,
                        key: item.uid,
                        id: index + 1
                    }
                })
                setDataSource(arr)
            } else {
                message.warning(res.msg)
                setDataSource([])
            }
        }).finally(() => {
            setIsRenderResult(false)
        })
    }

    return isRenderResult ?
        <RecordSkeleton/> : (
            <div className={'record-body'}>
                <Drawer
                    title={<span>{RenderStatusTag(content.status)}</span>}
                    placement="right"
                    open={open}
                    onClose={() => {
                        setOpen(false)
                    }}
                    extra={content.status === 0 ?
                        <>
                            <Button
                                type="primary"
                                style={{
                                    backgroundColor: red,
                                    borderColor: red
                                }}
                                onClick={() => {
                                    showDeleteConfirm(content.uid);
                                }}
                            >{intl.get('delete')}</Button>
                        </> : <Button
                            type="primary"
                            loading={processLoading}
                            onClick={() => refresh(openUid)}
                            icon={<SearchOutlined/>}
                            disabled={isQuery}>
                            {isQuery ? `${intl.get('refresh')}(${waitTime})` : intl.get('refresh')}
                        </Button>}
                >
                    <p>{intl.get('destination')}：{content.destination}</p>
                    <p>{intl.get('cost')}：{content.expenses}</p>
                    <p>{intl.get('reason')}：{content.reason}</p>
                    {content.reject_reason ?
                        <>
                            {intl.get('rejectReason')}：
                            <Tag color={red}
                                 style={{marginBottom: 16}}>{content.reject_reason}</Tag>
                        </> : null}
                    <p>{intl.get('createTime')}：{content.create_time}</p>
                    <p>{intl.get('updateTime')}：{content.update_time}</p>
                    {
                        fileLoading ? <Skeleton.Button block={true} active={true} size={'large'}/> :
                            // 如果 fileList 不为空则渲染
                            fileList.length > 0 ? (
                                <>
                                    {content.status === 0 ? <Button
                                        type="primary"
                                        loading={fileLoading}
                                        onClick={() => getFiles(openUid)}
                                        disabled={isQuery}>
                                        {isQuery ? `${intl.get('refreshFileList')}(${waitTime})` : intl.get('refreshFileList')}
                                    </Button> : null}
                                    <Collapse ghost>
                                        {/*循环输出 Card，数据来源 fileList*/}
                                        {fileList.map((item: any, index: number) => {
                                            return (
                                                <Panel header={intl.get('file') + (index + 1)} key={index}>
                                                    <p>{item.oldFileName}</p>
                                                    <a href={`${DownLoadURL}/downloadFile?filename=${item.fileName}`}
                                                       target="_self">{intl.get('download')}</a>
                                                </Panel>
                                            )
                                        })}
                                    </Collapse>
                                </>
                            ) : null
                    }
                    {
                        processLoading ? (
                                <Space style={{flexDirection: 'column'}}>
                                    <Skeleton.Input active={true} block={false}/>
                                    <Skeleton.Input active={true} block={false}/>
                                    <Skeleton.Input active={true} block={false}/>
                                    <Skeleton.Input active={true} block={false}/>
                                </Space>) :
                            <div style={{marginTop: 16}}>
                                {content.status === 0 ? <Button
                                    type="primary"
                                    loading={processLoading}
                                    onClick={() => {
                                        getProcess(openUid)
                                        refresh(openUid)
                                    }}
                                    disabled={isQuery}>
                                    {isQuery ? `${intl.get('refreshProcessList')}(${waitTime})` : intl.get('refreshProcessList')}
                                </Button> : null}
                                <div style={{marginTop: 16}}>{intl.get('approveProcess')}：</div>
                                <Steps
                                    style={{
                                        marginTop: 16
                                    }}
                                    direction="vertical"
                                    size="small"
                                    current={content.count}
                                    status={content.status === 0 ? 'process' : content.status === 1 ? 'finish' : 'error'}
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
                </Drawer>
                <Title level={2} className={'tit'}>
                    {intl.get('travelReimburse') + ' ' + intl.get('record')}&nbsp;&nbsp;
                    <Button type="primary" disabled={isQuery} icon={<SearchOutlined/>}
                            onClick={getDataSource}>{isQuery ? `${intl.get('refresh')}(${waitTime})` : intl.get('refresh')}</Button>
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
                        defaultPageSize: 5
                    }}
                />
            </div>
        );
};

export default Index;
