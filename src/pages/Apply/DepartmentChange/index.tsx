import {
    Input,
    Modal,
    Button,
    Form,
    message,
    Result,
    Select,
    Typography,
    Upload
} from 'antd';
import type {UploadProps} from 'antd/es/upload/interface';
import {InboxOutlined} from '@ant-design/icons';
import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {
    deleteFile,
    queryDepartmentMessage,
    teacherChangeDepartment,
    checkTeacherChangeDepartment,
    checkLastTimeUploadFiles
} from "../../../component/axios/api";
import '../index.scss';
import Cookie from "js-cookie";
import {BaseURL} from "../../../baseURL";

const {Title} = Typography;
const apiToken = Cookie.get('token');
const tableName = `changedepartmentbyteacher`;

const URL = `${BaseURL}/api`;

const LeaveForm = () => {
    const navigate = useNavigate();
    // 防止反复查询变更记录
    const [isQuery, setIsQuery] = useState<boolean>(false);
    const [waitTime, setWaitTime] = useState<number>(9);
    // 文件上传列表
    const [fileList, setFileList] = useState<any>([]);
    // 确认框状态
    const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    // 展示表单还是提示信息,两种状态，分别是 info 或者 warning

    const [isRenderResult, setIsRenderResult] = useState<boolean>(true);
    const [RenderResultTitle, setRenderResultTitle] = useState<String>('正在获取部门变更申请记录');
    // 部门列表
    const [departmentOptions, setDepartmentOptions] = useState([]);
    // 监听表单数据
    const [form] = Form.useForm();
    const departmentUid = Form.useWatch('departmentUid', form);
    const changeReason = Form.useWatch('changeReason', form);

    useEffect(() => {
        checkDepartmentChange();
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

    // 查询是否有正在审批的部门变更申请
    const checkDepartmentChange = () => {
        setIsQuery(true)
        setWaitTime(10)
        // 防止多次点击
        if (isQuery) {
            return
        }
        checkTeacherChangeDepartment().then(res => {
            if (res.code === 200) {
                checkUploadFilesList();
            } else {
                message.warning(res.msg);
                setRenderResultTitle("您已经提交过部门变更申请，请等待审批结果")
            }
        })
    }

    // 查询上次上传的文件列表
    const checkUploadFilesList = () => {
        checkLastTimeUploadFiles(tableName).then(res => {
            if (res.code === 200) {
                console.log(res)
                // 遍历 res.body
                const fileList = res.body.map((item: any) => {
                    return {
                        uid: item.fileName,
                        name: item.oldFileName,
                        status: 'done',
                        url: `${URL}/downloadFile?filename=${item.fileName}`,
                    }
                })
                setFileList(fileList)
            }
            setIsRenderResult(false)
        })
    }

    // 文件上传
    const props: UploadProps = {
        name: 'file',
        headers: {
            'Authorization': `${apiToken}`,
            'tableUid': tableName
        },
        multiple: true,
        action: `${URL}/uploadFile`,
        // action: 'https://www.allynlin.site:8080/cshbxy/api/uploadFile',
        fileList: fileList,
        // 如果上传的文件大于 20M，就提示错误
        beforeUpload: (file: any) => {
            if (file.size / 1024 / 1024 > 20) {
                message.warning('文件大小不能超过 20M');
                // 将对应文件的状态设置为 error
                file.status = 'error';
                return false;
            }
            return true;
        },
        onChange(info) {
            const {status} = info.file;
            setFileList([...info.fileList]);
            if (status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (status === 'done') {
                if (info.file.response.code === 200) {
                    message.success(info.file.response.msg);
                    // 找到对应的文件，将它的 uid 修改为 response.body
                    const newFileList = fileList.map((item: any) => {
                        if (item.uid === info.file.uid) {
                            item.url = `${URL}/downloadFile?filename=${info.file.response.body}`;
                            item.status = 'done';
                            item.uid = info.file.response.body;
                        }
                        return item;
                    })
                    setFileList(newFileList);
                } else {
                    message.error(info.file.response.msg);
                }
            } else if (status === 'error') {
                message.error(`${info.file.name} 文件上传失败`);
            }
        },
        onDrop(e: any) {
            console.log('Dropped files', e.dataTransfer.files);
        },
        onRemove(info: any) {
            const status = info.status;
            if (status === 'done') {
                // 获取需要删除的文件的 uid
                const uid = info.uid;
                deleteFile(uid).then(res => {
                    message.success(res.msg);
                })
            }
        },
        progress: {
            strokeColor: {
                '0%': '#108ee9',
                '100%': '#87d068',
            },
            strokeWidth: 3,
            format: percent => percent && `${parseFloat(percent.toFixed(2))}%`,
        },
    };

    // 表单提交
    const submitForm = () => {
        teacherChangeDepartment(departmentUid, changeReason).then(res => {
            setConfirmLoading(false);
            message.success(res.msg);
            navigate('/home');
        }).catch(err => {
            setConfirmLoading(false);
        })
    }

    // 获取部门列表
    const getDepartmentOptions = () => {
        queryDepartmentMessage().then(res => {
            const departmentOptions = res.body.map((item: { uid: String; realeName: String; }) => {
                return {
                    value: item.uid,
                    label: item.realeName
                }
            })
            setDepartmentOptions(departmentOptions);
        })
    }

    const RenderModal: React.FC = () => {
        return (
            <Modal
                title="确认提交"
                open={isModalVisible}
                onOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
            >
                <p>变更部门：{departmentUid}</p>
                <p>变更原因：{changeReason}</p>
                {/*将变更材料 changeFile 中的 fileList 数组中的状态为 done 的每一项 name 输出出来*/}
                <p>变更材料：{
                    fileList.filter((item: any) => item.status === 'done').map((item: any) => item.name).join('、')
                }</p>
            </Modal>
        )
    }

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleOk = () => {
        setConfirmLoading(true);
        submitForm();
    };

    const onFinish = (values: any) => {
        setIsModalVisible(true)
    };

    const onReset = () => {
        form.resetFields();
    };

    return isRenderResult ? (
        <Result
            status="warning"
            title={RenderResultTitle}
            extra={
                <>
                    <Button type="primary" key="console" onClick={() => {
                        navigate('/record/leaveList', {replace: true})
                    }}>
                        查看部门变更申请记录
                    </Button>
                    <Button type={'primary'} key="buy"
                            onClick={() => {
                                checkDepartmentChange();
                            }}
                            disabled={isQuery}
                    >
                        {isQuery ? `刷新(${waitTime})` : '刷新'}
                    </Button>
                </>
            }
        />) : (
        <div className={'body'}>
            <RenderModal/>
            <div className="zent-alert-example">
                <Title level={2} className={'tit'}>部门变更申请</Title>
                <Form
                    form={form}
                    name="basic"
                    labelCol={{span: 8}}
                    wrapperCol={{span: 16}}
                    onFinish={onFinish}
                    initialValues={{
                        file: fileList
                    }}
                >
                    <Form.Item
                        label="变更部门"
                        name="departmentUid"
                        rules={[{required: true, message: '请选择你需要变更的新部门'}]}
                    >
                        <Select
                            showSearch
                            placeholder="请选择你需要变更的新部门"
                            optionFilterProp="children"
                            onFocus={getDepartmentOptions}
                            options={departmentOptions}
                        />
                    </Form.Item>

                    <Form.Item
                        label="变更原因"
                        name="changeReason"
                        rules={[{required: true, message: '请输入变更原因'}]}
                    >
                        <Input.TextArea rows={4} placeholder={"请输入变更原因，如超出1000字请提交附件"} showCount={true}
                                        maxLength={1000}/>
                    </Form.Item>

                    <Form.Item
                        label="变更材料"
                        name="file"
                        rules={[{required: true, message: '请上传变更材料'}]}
                    >
                        <Upload.Dragger {...props}>
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined/>
                            </p>
                            <p className="ant-upload-text">单击或拖动文件到此区域进行上传</p>
                            <p className="ant-upload-hint">
                                支持单个或批量上传（单文件不超过 20M）
                            </p>
                        </Upload.Dragger>
                    </Form.Item>

                    <Form.Item wrapperCol={{offset: 8, span: 16}} style={{textAlign: "center"}}>
                        <Button type="primary" htmlType="submit">
                            提交
                        </Button>
                        <Button htmlType="button" onClick={onReset} style={{marginLeft: 8}}>
                            重置
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
        ;
};

const Index = () => {
    return (
        <LeaveForm/>
    )
}

export default Index;