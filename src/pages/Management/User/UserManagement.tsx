import React, {useEffect, useRef, useState} from 'react';
import VirtualTable from "../../../component/VirtualTable";
import {App, Button, Form, Input, Modal, Result, Skeleton, Typography} from 'antd';
import {findAllUser} from "../../../component/axios/api";
import {ColumnsType} from "antd/es/table";
import intl from "react-intl-universal";
import {FolderOpenOutlined, SearchOutlined} from "@ant-design/icons";
import {RenderUserStatusTag} from "../../../component/Tag/RenderUserStatusTag";
import {RenderUserTypeTag} from "../../../component/Tag/RenderUserTypeTag";
import ChangeUserName from "./ChangeUserName";
import ChangeUserInfo from "./ChangeUserInfo";
import ChangePassword from "./ChangePassword";
import ChangeUserStatus from "./ChangeUserStatus";
import DeleteUser from "./DeleteUser";
import {useSelector} from "react-redux";
import Draggable, {DraggableData, DraggableEvent} from "react-draggable";

import {useStyles} from "../../../styles/webStyle";
import {RenderVirtualTableSkeleton} from "../../../component/RenderVirtualTableSkeleton";
import {useGaussianBlurStyles} from "../../../styles/gaussianBlurStyle";

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
    const [showContent, setShowContent] = useState<boolean>(true);
    // 详情弹窗
    const [showModal, setShowModal] = useState<boolean>(false);
    // 是否为空数据
    const [isEmpty, setIsEmpty] = useState<boolean>(false);
    // 可移动 modal
    const [disabled, setDisabled] = useState(false);
    const [bounds, setBounds] = useState({left: 0, top: 0, bottom: 0, right: 0});
    const draggleRef = useRef<HTMLDivElement>(null);

    const tableSize = useSelector((state: any) => state.tableSize.value);
    const gaussianBlur = useSelector((state: any) => state.gaussianBlur.value);

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
                    tag: RenderUserStatus(item.status),
                    showUserType: RenderUserTypeTag(item.userType),
                    operation: <Button
                        type="primary"
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
                        {intl.get('management')}
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

    const RenderGetDataSourceButton = () => {
        return (
            <Button type="primary" disabled={isQuery} icon={<SearchOutlined/>}
                    onClick={getDataSource}>{isQuery ? `${intl.get('refresh')}(${waitTime})` : intl.get('refresh')}</Button>
        )
    }

    const onStart = (_event: DraggableEvent, uiData: DraggableData) => {
        const {clientWidth, clientHeight} = window.document.documentElement;
        const targetRect = draggleRef.current?.getBoundingClientRect();
        if (!targetRect) {
            return;
        }
        setBounds({
            left: -targetRect.left + uiData.x,
            right: clientWidth - (targetRect.right - uiData.x),
            top: -targetRect.top + uiData.y,
            bottom: clientHeight - (targetRect.bottom - uiData.y),
        });
    };

    return (
        <div className={classes.contentBody}>
            <Modal
                title={
                    <div
                        style={{
                            width: '100%',
                            cursor: 'move',
                        }}
                        onMouseOver={() => {
                            if (disabled) {
                                setDisabled(false);
                            }
                        }}
                        onMouseOut={() => {
                            setDisabled(true);
                        }}
                    >
                        {intl.get('userInfo')}
                    </div>
                }
                onCancel={() => setShowModal(false)}
                open={showModal}
                className={gaussianBlur ? gaussianBlurClasses.gaussianBlurModal : ''}
                mask={!gaussianBlur}
                modalRender={(modal) => (
                    <Draggable
                        disabled={disabled}
                        bounds={bounds}
                        onStart={(event: any, uiData: any) => onStart(event, uiData)}
                    >
                        <div ref={draggleRef}>{modal}</div>
                    </Draggable>
                )}
                footer={[
                    <Button
                        key="link"
                        loading={loading}
                        onClick={() => setShowModal(false)}
                    >
                        {intl.get('close')}
                    </Button>,
                ]}
            >
                {showContent ? (<Skeleton paragraph={{rows: 18}} active/>) : (
                    <Typography>
                        <Title level={3}>{intl.get('baseInfo')}</Title>
                        <Paragraph>UID：{showInfo.uid}</Paragraph>
                        {showInfo.departmentUid ? (
                            <Paragraph>{intl.get('department')}：{showInfo.departmentUid}</Paragraph>) : null}
                        <Paragraph>{intl.get('username')}：{showInfo.username}</Paragraph>
                        <Paragraph>{intl.get('realName')}：{showInfo.realeName}</Paragraph>
                        <Paragraph>{intl.get('gender')}：{showInfo.gender}</Paragraph>
                        <Paragraph>{intl.get('email')}：{showInfo.email}</Paragraph>
                        <Paragraph>{intl.get('tel')}：{showInfo.tel}</Paragraph>
                        <Paragraph>{intl.get('createTime')}：{showInfo.create_time}</Paragraph>
                        <Paragraph>{intl.get('updateTime')}：{showInfo.update_time}</Paragraph>
                        <Paragraph>{intl.get('status')}：{showInfo.tag}</Paragraph>
                        <Paragraph>{intl.get('userType')}：{showInfo.showUserType}</Paragraph>
                        <Title level={3}>{intl.get('userOperation')}</Title>
                        <Paragraph>{<ChangePassword uid={showInfo.uid}/>}</Paragraph>
                        <Paragraph>
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
                                                onClick={() => {
                                                    setShowInfo({
                                                        ...showInfo,
                                                        username: newUsername
                                                    });
                                                    setShowModal(true);
                                                    setShowContent(false);
                                                }}>
                                                {intl.get('management')}
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
                                                onClick={() => {
                                                    setShowInfo({
                                                        ...showInfo,
                                                        username: newUsername
                                                    });
                                                    setShowModal(true);
                                                    setShowContent(false);
                                                }}>
                                                {intl.get('management')}
                                            </Button>
                                        }
                                    }
                                    return item
                                })
                                setShowData(newShowData)
                            }}/>}
                        </Paragraph>
                        <Paragraph>
                            {<ChangeUserInfo info={showInfo} getChange={(newContent: any) => {
                                setShowInfo({...showInfo, ...newContent})
                                const newDateSource = dataSource.map((item: any) => {
                                    if (item.uid === showInfo.uid) {
                                        return {
                                            ...showInfo,
                                            ...newContent,
                                            operation: <Button
                                                type="primary"
                                                onClick={() => {
                                                    setShowInfo({
                                                        ...showInfo,
                                                        ...newContent
                                                    });
                                                    setShowModal(true);
                                                    setShowContent(false);
                                                }}>
                                                {intl.get('management')}
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
                                                onClick={() => {
                                                    setShowInfo({
                                                        ...showInfo,
                                                        ...newContent
                                                    });
                                                    setShowModal(true);
                                                    setShowContent(false);
                                                }}>
                                                {intl.get('management')}
                                            </Button>
                                        }
                                    }
                                    return item
                                })
                                setShowData(newShowData)
                            }}/>}
                        </Paragraph>
                        <Paragraph>
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
                                                onClick={() => {
                                                    setShowInfo({
                                                        ...showInfo,
                                                        status: newStatus,
                                                        tag: RenderUserStatus(newStatus),
                                                    });
                                                    setShowModal(true);
                                                    setShowContent(false);
                                                }}>
                                                {intl.get('management')}
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
                                                onClick={() => {
                                                    setShowInfo({
                                                        ...showInfo,
                                                        status: newStatus,
                                                        tag: RenderUserStatus(newStatus),
                                                    });
                                                    setShowModal(true);
                                                    setShowContent(false);
                                                }}>
                                                {intl.get('management')}
                                            </Button>
                                        }
                                    }
                                    return item
                                })
                                setShowData(newShowData)
                            }}/>}
                        </Paragraph>
                        <Title level={3}>{intl.get('advancedFeatures')}</Title>
                        <Paragraph>
                            {<DeleteUser content={showInfo} getChange={(newContent: string) => {
                                if (newContent === 'yes') {
                                    setShowModal(false)
                                    const newDateSource: any = dataSource.filter((item: any) => {
                                        return item.uid !== showInfo.uid;
                                    })
                                    if (newDateSource.length === 0) {
                                        setDataSource([])
                                        setShowData([])
                                        setIsEmpty(true)
                                        return
                                    }
                                    setDataSource(newDateSource)
                                    const newShowData: any = showData.filter((item: any) => {
                                        return item.uid !== showInfo.uid;
                                    })
                                    setShowData(newShowData)
                                    setShowInfo({})
                                }
                            }}/>}
                        </Paragraph>
                    </Typography>
                )}
            </Modal>
            <div className={classes.contentHead}>
                <Title level={2} className={classes.tit}>
                    {intl.get('userManagement')}&nbsp;&nbsp;
                    <RenderGetDataSourceButton/>
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

const UserManagement = () => {
    return (
        <App>
            <MyApp/>
        </App>
    )
}

export default UserManagement;
