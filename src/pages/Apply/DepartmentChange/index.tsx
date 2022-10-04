import {
    Input,
    Modal,
    Button,
    Form,
    message,
    Result,
    Select,
    Typography
} from 'antd';
import React, {useEffect, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {
    queryDepartmentMessage,
    teacherChangeDepartment,
    checkTeacherChangeDepartment,
    checkLastTimeUploadFiles
} from "../../../component/axios/api";
import '../index.scss';
import {DownLoadURL} from "../../../baseInfo";
import FileUpLoad from "../../../component/FileUpLoad";
import {LoadingOutlined} from "@ant-design/icons";
import NProgress from "nprogress";

const {Title} = Typography;
const tableName = `changedepartmentbyteacher`;

const LeaveForm = () => {
    const navigate = useNavigate();
    // 防止反复查询变更记录
    const [isQuery, setIsQuery] = useState<boolean>(false);
    const [waitTime, setWaitTime] = useState<number>(0);
    // 文件上传列表
    const [fileList, setFileList] = useState<[]>([]);
    // 确认框状态
    const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    // 展示表单还是提示信息,两种状态，分别是 info 或者 loading
    const [isRenderResult, setIsRenderResult] = useState<boolean>(true);
    const [RenderResultTitle, setRenderResultTitle] = useState<String>('正在获取部门变更申请记录');
    const [isRenderInfo, setIsRenderInfo] = useState<boolean>(false);
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
                setRenderResultTitle("正在获取上次上传的文件")
                checkUploadFilesList();
                setIsQuery(false)
                setWaitTime(0)
            } else {
                setIsRenderInfo(true)
                setRenderResultTitle("您已经提交过部门变更申请，请等待审批结果")
            }
        })
    }

    // 查询上次上传的文件列表
    const checkUploadFilesList = () => {
        checkLastTimeUploadFiles(tableName).then(res => {
            if (res.code === 200) {
                // 遍历 res.body
                const fileList = res.body.map((item: any) => {
                    return {
                        uid: item.fileName,
                        name: item.oldFileName,
                        status: 'done',
                        url: `${DownLoadURL}/downloadFile?filename=${item.fileName}`,
                    }
                })
                setFileList(fileList)
            }
            setIsRenderResult(false)
        })
    }

    // 表单提交
    const submitForm = () => {
        teacherChangeDepartment(departmentUid, changeReason).then(res => {
            setConfirmLoading(false);
            message.success(res.msg);
            navigate('/home/teacher/record/departmentChange');
            navigate('/home/success', {
                state: {
                    object: {
                        title: '部门变更申请提交成功',
                        describe: '请等待管理员审批',
                        toPage: '查看审批记录',
                        toURL: '/home/teacher/record/departmentChange',
                    }
                }
            })
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
                    checkDepartmentChange()
                }}>
                    {isQuery ? `刷新(${waitTime})` : `刷新`}
                </Button>
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
                        <FileUpLoad
                            setTableName={tableName}
                            getList={(list: []) => {
                                console.log(list)
                                // 如果 list 为空，说明用户删除了所有的文件，此时需要将 fileList 也置为空
                                if (list.length === 0) {
                                    console.log('list 为空')
                                    setFileList([])
                                    form.setFieldsValue({file: []})
                                    return
                                }
                                setFileList(list)
                                form.setFieldsValue({
                                    file: list
                                })
                            }}
                            setList={fileList}
                        />
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