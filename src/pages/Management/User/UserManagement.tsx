import React, {useEffect, useState} from 'react';
import VirtualTable from "../../../component/virtualTable/VirtualTable";
import {Button, message, Skeleton, Typography, Form, Input, Modal} from 'antd';
import {findAllUser} from "../../../component/axios/api";
import {ColumnsType} from "antd/es/table";
import intl from "react-intl-universal";
import '../management.scss';
import {SearchOutlined} from "@ant-design/icons";
import {green} from "../../../baseInfo";
import {RenderUserStatusTag} from "../../../component/Tag/RenderUserStatusTag";
import {RenderUserTypeTag} from "../../../component/Tag/RenderUserTypeTag";
import {RenderUserStatusColor} from "../../../component/Tag/RenderUserStatusColor";
import ChangeUserName from "./ChangeUserName";
import ChangeUserInfo from "./ChangeUserInfo";
import ChangePassword from "./ChangePassword";
import ChangeUserStatus from "./ChangeUserStatus";
import DeleteUser from "./DeleteUser";

const {Title} = Typography;

interface DataType {
    key: React.Key;
    dataIndex: string;
    align: 'left' | 'right' | 'center';
}

export default function UserManagement() {

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
    const [showContent, setShowContent] = useState<boolean>(true);
    // 详情弹窗
    const [showModal, setShowModal] = useState<boolean>(false);
    // 虚拟列表的宽度和高度
    const [width, setWidth] = useState<number>(0);
    const [height, setHeight] = useState<number>(0);

    useEffect(() => {
        // 获取页面宽度
        const width = document.body.clientWidth;
        // 获取页面高度
        const height = document.body.clientHeight;
        // 虚拟列表的宽度计算：页面宽度 - 左侧导航栏宽度（200）- 右侧边距（20） - 表格左右边距（20）
        const tableWidth = width - 200 - 40;
        // 虚拟列表高度计算：液面高度 - 页面顶部（10%，最小50px） - 页面底部（5%，最小20px） - 表格上下边距（20）
        const bottomHeight = height * 0.05 >= 20 ? height * 0.05 : 20;
        const topHeight = height * 0.1 >= 50 ? height * 0.1 : 50;
        const tableHeight = height - bottomHeight - topHeight - 100 - 43;
        setWidth(tableWidth);
        setHeight(tableHeight);
    }, [])

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

    const RenderUserStatus = (status: number) => {
        switch (status) {
            case 0:
                return RenderUserStatusTag(intl.get('normal'))
            case -1:
                return RenderUserStatusTag(intl.get('disabled'))
            default:
                return RenderUserStatusTag(intl.get('unKnow'))
        }
    }

    const RenderUserOperateButton = (status: number) => {
        switch (status) {
            case 0:
                return RenderUserStatusColor(intl.get('normal'))
            case -1:
                return RenderUserStatusColor(intl.get('disabled'))
            default:
                return RenderUserStatusColor(intl.get('unKnow'))
        }
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
        findAllUser().then(res => {
            if (res.code === 200) {
                const newDataSource = res.body.map((item: any, index: number) => {
                    return {
                        ...item,
                        id: index + 1,
                        key: item.uid,
                        tag: RenderUserStatus(item.status),
                        showUserType: RenderUserTypeTag(item.userType),
                        operation: <Button
                            type="primary"
                            style={{
                                backgroundColor: RenderUserOperateButton(item.status),
                                borderColor: RenderUserOperateButton(item.status)
                            }}
                            onClick={() => {
                                setShowInfo({
                                    ...item,
                                    id: index + 1,
                                    key: item.uid,
                                    tag: RenderUserStatus(item.status),
                                    showUserType: RenderUserTypeTag(item.userType),
                                });
                                setShowModal(true);
                                setShowContent(false);
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

    const onFinish = (values: any) => {
        // 如果什么内容都没有输入，那就把所有数据展示出来
        if (!values.search) {
            setShowData(dataSource);
            return
        }
        // 如果有输入内容，那将 dataSource 中的 reason 进行模糊匹配
        const newShowData = dataSource.filter((item: any) => {
            return item.username.indexOf(values.search) !== -1
        })
        setShowData(newShowData);
    };

    const columns: ColumnsType<DataType> = [{
        title: 'id',
        dataIndex: 'id',
        align: 'center',
    }, {
        title: intl.get('username'),
        dataIndex: 'username',
        align: 'center',
    }, {
        title: intl.get('realName'),
        dataIndex: 'realeName',
        align: 'center',
    }, {
        title: intl.get('status'),
        dataIndex: 'tag',
        align: 'center',
    }, {
        title: intl.get('userType'),
        dataIndex: 'showUserType',
        align: 'center',
    }, {
        title: intl.get('operate'),
        dataIndex: 'operation',
        align: 'center',
    }];

    return (
        <div className={'record-body'}>
            <Modal
                title={intl.get('userInfo')}
                onCancel={() => setShowModal(false)}
                open={showModal}
                footer={[
                    <Button
                        key="link"
                        type="primary"
                        loading={loading}
                        onClick={() => setShowModal(false)}
                        style={{
                            backgroundColor: green,
                            borderColor: green
                        }}
                    >
                        {intl.get('close')}
                    </Button>,
                ]}
            >
                {showContent ? (<Skeleton paragraph={{rows: 13}} active/>) : (
                    <>
                        <Title level={3}>{intl.get('baseInfo')}</Title>
                        <p>UID：{showInfo.uid}</p>
                        {showInfo.departmentUid ? (<p>{intl.get('department')}：{showInfo.departmentUid}</p>) : null}
                        <p>{intl.get('username')}：{showInfo.username}</p>
                        <p>{intl.get('realName')}：{showInfo.realeName}</p>
                        <p>{intl.get('gender')}：{showInfo.gender}</p>
                        <p>{intl.get('email')}：{showInfo.email}</p>
                        <p>{intl.get('tel')}：{showInfo.tel}</p>
                        <p>{intl.get('createTime')}：{showInfo.create_time}</p>
                        <p>{intl.get('updateTime')}：{showInfo.update_time}</p>
                        <p>{intl.get('status')}：{showInfo.tag}</p>
                        <p>{intl.get('userType')}：{showInfo.showUserType}</p>
                        <Title level={3}>{intl.get('userOperation')}</Title>
                        <p>{<ChangePassword uid={showInfo.uid}/>}</p>
                        <p>
                            {<ChangeUserName info={showInfo} getChange={(newUsername: string) => {
                                // 修改 showInfo 中的 username
                                setShowInfo({
                                    ...showInfo,
                                    username: newUsername
                                })
                                // 修改 dataSource 中的 username
                                const newDataSource = dataSource.map((item: any) => {
                                    if (item.uid === showInfo.uid) {
                                        return {
                                            ...item,
                                            username: newUsername,
                                            operation: <Button
                                                type="primary"
                                                style={{
                                                    backgroundColor: RenderUserOperateButton(item.status),
                                                    borderColor: RenderUserOperateButton(item.status)
                                                }}
                                                onClick={() => {
                                                    setShowInfo({
                                                        ...showInfo,
                                                        username: newUsername
                                                    });
                                                    setShowModal(true);
                                                    setShowContent(false);
                                                }}>
                                                {intl.get('check')}
                                            </Button>
                                        }
                                    }
                                    return item
                                })
                                setDataSource(newDataSource)
                                // 修改 showData 中的 username
                                const newShowData = showData.map((item: any) => {
                                    if (item.uid === showInfo.uid) {
                                        return {
                                            ...item,
                                            username: newUsername,
                                            operation: <Button
                                                type="primary"
                                                style={{
                                                    backgroundColor: RenderUserOperateButton(item.status),
                                                    borderColor: RenderUserOperateButton(item.status)
                                                }}
                                                onClick={() => {
                                                    setShowInfo({
                                                        ...showInfo,
                                                        username: newUsername
                                                    });
                                                    setShowModal(true);
                                                    setShowContent(false);
                                                }}>
                                                {intl.get('check')}
                                            </Button>
                                        }
                                    }
                                    return item
                                })
                                setShowData(newShowData)
                            }}/>}
                        </p>
                        <p>
                            {<ChangeUserInfo info={showInfo} getChange={(newContent: any) => {
                                setShowInfo({...showInfo, ...newContent})
                                const newDateSource = dataSource.map((item: any) => {
                                    if (item.uid === showInfo.uid) {
                                        return {
                                            ...showInfo,
                                            ...newContent,
                                            operation: <Button
                                                type="primary"
                                                style={{
                                                    backgroundColor: RenderUserOperateButton(item.status),
                                                    borderColor: RenderUserOperateButton(item.status)
                                                }}
                                                onClick={() => {
                                                    setShowInfo({
                                                        ...showInfo,
                                                        ...newContent
                                                    });
                                                    setShowModal(true);
                                                    setShowContent(false);
                                                }}>
                                                {intl.get('check')}
                                            </Button>
                                        }
                                    }
                                    return item
                                })
                                setDataSource(newDateSource)
                                const newShowData = showData.map((item: any) => {
                                    if (item.uid === showInfo.uid) {
                                        return {
                                            ...showInfo,
                                            ...newContent,
                                            operation: <Button
                                                type="primary"
                                                style={{
                                                    backgroundColor: RenderUserOperateButton(item.status),
                                                    borderColor: RenderUserOperateButton(item.status)
                                                }}
                                                onClick={() => {
                                                    setShowInfo({
                                                        ...showInfo,
                                                        ...newContent
                                                    });
                                                    setShowModal(true);
                                                    setShowContent(false);
                                                }}>
                                                {intl.get('check')}
                                            </Button>
                                        }
                                    }
                                    return item
                                })
                                setShowData(newShowData)
                            }}/>}
                        </p>
                        <p>
                            {<ChangeUserStatus info={showInfo} getChange={(newStatus: number) => {
                                setShowInfo({
                                    ...showInfo,
                                    tag: RenderUserStatus(newStatus),
                                    status: newStatus,
                                })
                                const newDateSource = dataSource.map((item: any) => {
                                    if (item.uid === showInfo.uid) {
                                        return {
                                            ...item,
                                            tag: RenderUserStatus(newStatus),
                                            status: newStatus,
                                            operation: <Button
                                                type="primary"
                                                style={{
                                                    backgroundColor: RenderUserOperateButton(newStatus),
                                                    borderColor: RenderUserOperateButton(newStatus)
                                                }}
                                                onClick={() => {
                                                    setShowInfo({
                                                        ...showInfo,
                                                        status: newStatus,
                                                        tag: RenderUserStatus(newStatus),
                                                    });
                                                    setShowModal(true);
                                                    setShowContent(false);
                                                }}>
                                                {intl.get('check')}
                                            </Button>
                                        }
                                    }
                                    return item
                                })
                                setDataSource(newDateSource)
                                const newShowData = showData.map((item: any) => {
                                    if (item.uid === showInfo.uid) {
                                        return {
                                            ...item,
                                            tag: RenderUserStatus(newStatus),
                                            status: newStatus,
                                            operation: <Button
                                                type="primary"
                                                style={{
                                                    backgroundColor: RenderUserOperateButton(newStatus),
                                                    borderColor: RenderUserOperateButton(newStatus)
                                                }}
                                                onClick={() => {
                                                    setShowInfo({
                                                        ...showInfo,
                                                        status: newStatus,
                                                        tag: RenderUserStatus(newStatus),
                                                    });
                                                    setShowModal(true);
                                                    setShowContent(false);
                                                }}>
                                                {intl.get('check')}
                                            </Button>
                                        }
                                    }
                                    return item
                                })
                                setShowData(newShowData)
                            }}/>}
                        </p>
                        <Title level={3}>{intl.get('advancedFeatures')}</Title>
                        <p>
                            {<DeleteUser content={showInfo} getChange={(newContent: string) => {
                                if (newContent === 'yes') {
                                    setShowModal(false)
                                    const newDateSource: any = dataSource.filter((item: any) => {
                                        return item.uid !== showInfo.uid;
                                    })
                                    setDataSource(newDateSource)
                                    const newShowData: any = showData.filter((item: any) => {
                                        return item.uid !== showInfo.uid;
                                    })
                                    setShowData(newShowData)
                                    setShowInfo({})
                                }
                            }}/>}
                        </p>
                    </>
                )}
            </Modal>
            <div className="record-head">
                <Title level={2} className={'tit'}>
                    {intl.get('userManagement')}&nbsp;&nbsp;
                    <Button type="primary" disabled={isQuery} icon={<SearchOutlined/>}
                            onClick={getDataSource}>{isQuery ? `${intl.get('refresh')}(${waitTime})` : intl.get('refresh')}</Button>
                </Title>
                <Form name="search" layout="inline" onFinish={onFinish}>
                    <Form.Item name="search">
                        <Input prefix={<SearchOutlined className="site-form-item-icon"/>}
                               placeholder={intl.get('search') + ' ' + intl.get('username')}/>
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
            <VirtualTable columns={columns} dataSource={showData} scroll={{y: height, x: width}}/>
        </div>
    )
};
