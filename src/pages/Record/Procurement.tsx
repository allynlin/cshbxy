import {Button, Drawer, message, Modal, Skeleton, Space, Spin, Steps, Table, Tag, Typography} from 'antd';
import {ExclamationCircleOutlined, LoadingOutlined, SearchOutlined} from '@ant-design/icons';
import React, {useEffect, useState} from 'react';
import {
    deleteProcurement,
    findProcurementList,
    findProcurementProcess,
    refreshProcurement
} from '../../component/axios/api';
import './index.scss';
import {RenderStatusTag} from "../../component/Tag/RenderStatusTag";
import {red} from "../../baseInfo";
import {ColumnsType} from "antd/es/table";
import {RenderStatusColor} from "../../component/Tag/RenderStatusColor";
import intl from "react-intl-universal";

const {Title} = Typography;
const {Step} = Steps;

interface DataType {
    key: string;
    name: string;
    age: number;
    address: string;
    tags: string[];
}

const Procurement: React.FC = () => {
    // 防止反复查询变更记录
    const [isQuery, setIsQuery] = useState<boolean>(false);
    const [waitTime, setWaitTime] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [dataSource, setDataSource] = useState([]);
    const [content, setContent] = useState<any>({});
    const [processList, setProcessList] = useState<any>([]);
    const [open, setOpen] = useState(false);
    const [openUid, setOpenUid] = useState<string>('');

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

    const refresh = (uid: string) => {
        setIsQuery(true)
        setWaitTime(10)
        if (isQuery) {
            return
        }
        refreshProcurement(uid).then(res => {
            let newContent = {
                key: content.key,
                id: content.id,
                ...res.body
            }
            setContent(newContent)
        })
    }

    // 获取当前记录上传的文件和当前审批流程
    const getInfo = (uid: string) => {
        setOpen(true);
        getProcess(uid);
    }

    const getProcess = (uid: string) => {
        setProcessLoading(true)
        const hide = message.loading(intl.get('gettingProcessList'), 0);
        findProcurementProcess(uid).then((res: any) => {
            setProcessList(res.body);
        }).finally(() => {
            setProcessLoading(false)
            hide();
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
                deleteProcurement(e).then((res: any) => {
                    if (res.code === 200) {
                        message.success(res.msg);
                        setOpen(false);
                        const arr = dataSource.filter((item: any) => item.uid !== e);
                        setDataSource(arr);
                        if (arr.length === 0) {
                            message.warning(intl.get('noProcurementList'));
                        }
                    } else {
                        message.error(res.msg);
                    }
                })
            }
        });
    };

    useEffect(() => {
        getDataSource();
    }, [])

    // 获取所有数据
    const getDataSource = () => {
        setIsQuery(true)
        setWaitTime(10)
        setLoading(true);
        findProcurementList().then(res => {
            if (res.code === 200) {
                const newDataSource = res.body.map((item: any, index: number) => {
                    return {
                        ...item,
                        id: index + 1,
                        key: item.uid
                    }
                });
                setDataSource(newDataSource);
            } else {
                message.warning(res.msg);
                setDataSource([])
            }
        }).finally(() => {
            setLoading(false);
        })
    }

    const columns: ColumnsType<DataType> = [
        {
            title: 'id',
            width: 100,
            dataIndex: 'id',
            key: 'id',
            fixed: 'left',
            align: 'center',
        }, {
            title: intl.get('procurementItem'),
            dataIndex: 'items',
            key: 'items',
            width: 150,
            align: 'center',
        }, {
            title: intl.get('procurementPrice'),
            dataIndex: 'price',
            key: 'price',
            width: 150,
            align: 'center',
            render: (text: string) => {
                return text + '￥'
            }
        }, {
            title: intl.get('status'),
            dataIndex: 'status',
            key: 'status',
            width: 150,
            align: 'center',
            render: (text: number) => {
                return (
                    RenderStatusTag(text, intl.get('procurementApply'))
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

    return (
        <div className={'record-body'}>
            <Drawer
                title={<span>{RenderStatusTag(content.status)}</span>}
                placement="right"
                open={open}
                onClose={() => {
                    setOpen(false)
                }}
                extra={content.status === 0 ?
                    <div style={{
                        display: 'flex'
                    }}>
                        <Button
                            type="primary"
                            style={{
                                backgroundColor: red,
                                borderColor: red,
                                marginLeft: 10
                            }}
                            onClick={() => {
                                showDeleteConfirm(content.uid);
                            }}
                        >{intl.get('delete')}</Button>
                    </div> : <Button
                        type="primary"
                        loading={processLoading}
                        onClick={() => refresh(openUid)}
                        icon={<SearchOutlined/>}
                        disabled={isQuery}>
                        {isQuery ? `${intl.get('refresh')}(${waitTime})` : intl.get('refresh')}
                    </Button>}
            >
                <p>{intl.get('procurementItem')}：{content.items}</p>
                <p>{intl.get('procurementPrice')}：{content.price} ￥</p>
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
                {intl.get('procurement') + ' ' + intl.get('record')}&nbsp;&nbsp;
                <Button type="primary" disabled={isQuery} icon={<SearchOutlined/>}
                        onClick={getDataSource}>{isQuery ? `${intl.get('refresh')}(${waitTime})` : intl.get('refresh')}</Button>
            </Title>
            <Spin spinning={loading} indicator={<LoadingOutlined
                style={{
                    fontSize: 40,
                }}
                spin
            />}>
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
            </Spin>
        </div>
    );
};

export default Procurement;
