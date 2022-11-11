import {Button, Col, Divider, Drawer, Input, InputRef, Row, Space, Spin, Table, Tag, Typography} from 'antd';
import {LoadingOutlined, SearchOutlined,} from '@ant-design/icons';
import React, {useEffect, useRef, useState} from 'react';
import './management.scss'
import {RenderUserStatusColor} from "../../component/Tag/RenderUserStatusColor";
import intl from "react-intl-universal";
import {findUserByDepartment} from "../../component/axios/api";
import {RenderUserStatusTag} from "../../component/Tag/RenderUserStatusTag";
import type {ColumnsType, ColumnType} from 'antd/es/table';
import type {FilterConfirmProps} from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';
import {RenderUserTypeTag} from "../../component/Tag/RenderUserTypeTag";
import ChangePassword from "./ChangePassword";
import ChangeUsername from "./ChangeUsername";
import ChangeUserInfo from "./ChangeUserInfo";
import ChangeUserStatus from "./ChangeUserStatus";
import {useSelector} from "react-redux";

const {Title} = Typography;

interface DataType {
    key: React.Key;
    id: number;
    uid: string;
    username: string;
    realeName: string;
    status: number;
    userType: string;
}

type DataIndex = keyof DataType;

interface DescriptionItemProps {
    title: string;
    content: React.ReactNode;
}

const Index: React.FC = () => {
    // 防止反复查询变更记录
    const [isQuery, setIsQuery] = useState<boolean>(false);
    const [waitTime, setWaitTime] = useState<number>(0);
    const [loading, setLoading] = useState(true);
    const [dataSource, setDataSource] = useState([]);
    const [content, setContent] = useState<any>({});
    const [open, setOpen] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef<InputRef>(null);

    const userInfo = useSelector((state: { userInfo: { value: any } }) => state.userInfo.value);

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

    const onClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        getDataSource();
    }, [])

    // 获取所有数据
    const getDataSource = () => {
        setLoading(true);
        setIsQuery(true)
        setWaitTime(10)
        // 防止多次点击
        if (isQuery) {
            return
        }
        findUserByDepartment(userInfo.uid).then(res => {
            const data = res.body.map((item: any, index: number) => {
                return {
                    ...item,
                    key: item.uid,
                    id: index + 1,
                    status: item.status === 0 ? intl.get('normal') : item.status === -1 ? intl.get('disabled') : intl.get('unKnow'),
                    departmentUid: item.departmentUid === null ? intl.get('unKnow') : item.departmentUid,
                }
            })
            setDataSource(data)
        }).finally(() => {
            setLoading(false)
        })
    }

    const handleSearch = (
        selectedKeys: string[],
        confirm: (param?: FilterConfirmProps) => void,
        dataIndex: DataIndex,
    ) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters: () => void) => {
        clearFilters();
        setSearchText('');
    };

    const getColumnSearchProps = (dataIndex: DataIndex, name: string): ColumnType<DataType> => ({
        filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters}) => (
            <div style={{padding: 8}}>
                <Input
                    ref={searchInput}
                    placeholder={`${intl.get('search')} ${name}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                    style={{marginBottom: 8, display: 'block'}}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                        icon={<SearchOutlined/>}
                        size="small"
                        style={{width: 90}}
                    >
                        {intl.get('search')}
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{width: 90}}
                    >
                        {intl.get('reset')}
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered: boolean) => (
            <SearchOutlined style={{color: filtered ? '#1890ff' : undefined}}/>
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                .toString()
                .toLowerCase()
                .includes((value as string).toLowerCase()),
        onFilterDropdownOpenChange: visible => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: text =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{backgroundColor: '#ffc069', padding: 0}}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });

    const columns: ColumnsType<DataType> = [
        {
            title: 'id',
            width: 100,
            dataIndex: 'id',
            key: 'id',
            fixed: 'left',
            align: 'center',
        }, {
            title: intl.get('username'),
            dataIndex: 'username',
            key: 'username',
            width: 150,
            align: 'center',
            ...getColumnSearchProps('username', intl.get('username')),
        }, {
            title: intl.get('realName'),
            dataIndex: 'realeName',
            key: 'realeName',
            width: 150,
            align: 'center',
            ...getColumnSearchProps('realeName', intl.get('realName')),
        }, {
            title: intl.get('status'),
            dataIndex: 'status',
            key: 'status',
            width: 150,
            align: 'center',
            defaultSortOrder: 'descend',
            sorter: (a, b) => a.status - b.status,
            filters: [
                {
                    text: intl.get('normal'),
                    value: intl.get('normal'),
                },
                {
                    text: intl.get('disabled'),
                    value: intl.get('disabled'),
                },
            ],
            onFilter: (value: any, record) => record.status.toString().indexOf(value) === 0,
            filterSearch: true,
            render: (text: string) => {
                return (
                    RenderUserStatusTag(text)
                )
            },
        }, {
            title: intl.get('userType'),
            dataIndex: 'userType',
            key: 'userType',
            width: 150,
            align: 'center',
            defaultSortOrder: 'descend',
            sorter: (a, b) => a.userType.length - b.userType.length,
            filters: [
                {
                    text: intl.get('department'),
                    value: 'Department',
                },
                {
                    text: intl.get('leader'),
                    value: 'Leader',
                },
                {
                    text: intl.get('employee'),
                    value: 'Employee',
                },
            ],
            onFilter: (value: any, record) => record.userType.indexOf(value) === 0,
            filterSearch: true,
            render: (text: string) => {
                return (
                    RenderUserTypeTag(text)
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
                            setOpen(true)
                        }}
                        style={{
                            backgroundColor: RenderUserStatusColor(record.status),
                            borderColor: RenderUserStatusColor(record.status)
                        }}
                    >{intl.get('check')}</Button>
                );
            }
        },
    ];

    const DescriptionItem = ({title, content}: DescriptionItemProps) => (
        <div className="site-description-item-profile-wrapper">
            <p className="site-description-item-profile-p-label">
                {title}:&nbsp;
                <Tag color="default">{content}</Tag>
            </p>
        </div>
    );

    const DescriptionNoStyleItem = ({title, content}: DescriptionItemProps) => (
        <div className="site-description-item-profile-wrapper">
            <div className="site-description-item-profile-p-label">
                {title}:&nbsp;{content}
            </div>
        </div>
    );

    return (<div className={'management-body'}>
            <Title level={2} className={'tit'}>
                {intl.get('userManagement')}&nbsp;&nbsp;
                <Button type="primary" disabled={isQuery} icon={<SearchOutlined/>}
                        onClick={getDataSource}>{isQuery ? `${intl.get('refresh')}(${waitTime})` : intl.get('refresh')}</Button>
            </Title>
            <Drawer width={640} placement="right" closable={false} onClose={onClose} open={open}>
                <p className="site-description-item-profile-p" style={{marginBottom: 24}}>
                    {intl.get('userInfo')}
                </p>
                <p className="site-description-item-profile-p">{intl.get('baseInfo')}</p>
                <Row>
                    <Col span={12}>
                        <DescriptionItem title={'UID'} content={content.uid}/>
                    </Col>
                    <Col span={12}>
                        <DescriptionItem title={intl.get('username')} content={content.username}/>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <DescriptionItem title={intl.get('realName')} content={content.realeName}/>
                    </Col>
                    <Col span={12}>
                        <DescriptionItem title={intl.get('gender')} content={content.gender}/>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <DescriptionItem title={intl.get('email')} content={content.email}/>
                    </Col>
                    <Col span={12}>
                        <DescriptionItem title={intl.get('tel')} content={content.tel}/>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <DescriptionItem title={intl.get('createTime')} content={content.create_time}/>
                    </Col>
                    <Col span={12}>
                        <DescriptionItem title={intl.get('updateTime')} content={content.update_time}/>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <DescriptionNoStyleItem title={intl.get('status')}
                                                content={RenderUserStatusTag(content.status)}/>
                    </Col>
                    <Col span={12}>
                        <DescriptionNoStyleItem title={intl.get('userType')}
                                                content={RenderUserTypeTag(content.userType)}/>
                    </Col>
                </Row>
                <Divider/>
                <p className="site-description-item-profile-p">{intl.get('userOperation')}</p>
                <Row>
                    <Col span={12}>
                        {<ChangePassword uid={content.uid}/>}
                    </Col>
                    <Col span={12}>
                        {<ChangeUsername content={content} getChange={(newUsername: string) => {
                            if (newUsername === content.username)
                                return
                            setContent({...content, username: newUsername})
                            const newDateSource: any = dataSource.map((item: any) => {
                                if (item.uid === content.uid) {
                                    return {...item, username: newUsername}
                                }
                                return item
                            })
                            setDataSource(newDateSource)
                        }}/>}
                    </Col>
                </Row>
                <Row style={{marginTop: 16}}>
                    <Col span={12}>
                        {<ChangeUserInfo content={content} getChange={(newContent: any) => {
                            setContent(newContent)
                            const newDateSource: any = dataSource.map((item: any) => {
                                if (item.uid === content.uid) {
                                    return {...newContent}
                                }
                                return item
                            })
                            setDataSource(newDateSource)
                        }}/>}
                    </Col>
                    <Col span={12}>
                        {<ChangeUserStatus content={content} getChange={(newStatus: string) => {
                            if (newStatus === content.status)
                                return
                            setContent({...content, status: newStatus})
                            const newDateSource: any = dataSource.map((item: any) => {
                                if (item.uid === content.uid) {
                                    return {...item, status: newStatus}
                                }
                                return item
                            })
                            setDataSource(newDateSource)
                        }}/>}
                    </Col>
                </Row>
            </Drawer>
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
                        defaultPageSize: 50
                    }}
                />
            </Spin>
        </div>
    );
};

export default Index;
