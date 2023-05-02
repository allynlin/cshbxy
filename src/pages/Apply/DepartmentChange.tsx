import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {App, Button, Form, Input, Modal, Result, Select, Typography} from 'antd';

import {
    ChangeDepartment,
    checkLastTimeUploadFiles,
    checkTeacherChangeDepartment,
    findUserType
} from "../../component/axios/api";
import {DownLoadURL, tableName} from "../../baseInfo";
import FileUpLoad from "../../component/axios/FileUpLoad";
import {useStyles} from "../../webStyle";
import logo from "../../images/logo.png";

const {TextArea} = Input;


const {Title, Paragraph} = Typography;

const ChangeForm = () => {

    const classes = useStyles();

    const {message} = App.useApp();

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
    const [RenderResultTitle, setRenderResultTitle] = useState<String>("获取上次申请记录");
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
        checkTeacherChangeDepartment().then(res => {
            if (res.code !== 200) {
                setRenderResultTitle("请等待审批")
                return
            }
            setRenderResultTitle("获取上次上传文件")
            checkUploadFilesList();
        })
    }

    // 查询上次上传的文件列表
    const checkUploadFilesList = () => {
        checkLastTimeUploadFiles(tableName.departmentChange).then(res => {
            setIsRenderResult(false)
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
        })
    }

    // 表单提交
    const submitForm = () => {
        ChangeDepartment(departmentUid, changeReason).then(res => {
            if (res.code !== 200) {
                message.error(res.msg)
                return
            }
            navigate('/success', {
                state: {
                    object: {
                        title: "部门变更申请提交成功",
                        describe: "等待审批",
                        toPage: "查看申请记录",
                        toURL: '/departmentChange-Record',
                    }
                }
            })
        }).finally(() => {
            setConfirmLoading(false);
        })
    }

    // 获取部门列表
    const getDepartmentOptions = () => {
        findUserType().then(res => {
            if (res.code !== 200) {
                message.error(res.msg)
                return
            }
            const departmentOptions = res.body.map((item: { uid: String; realeName: String; }) => {
                return {
                    value: item.uid,
                    label: item.realeName
                }
            })
            setDepartmentOptions(departmentOptions);
        }).catch(() => {
            getDepartmentOptions();
        })
    }

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleOk = () => {
        setConfirmLoading(true);
        submitForm();
    };

    const onFinish = () => {
        setIsModalVisible(true)
    };

    const onReset = () => {
        form.resetFields();
    };

    return isRenderResult ? (
        <Result
            status="info"
            icon={<img src={logo} alt="logo" className={classes.webWaitingImg}/>}
            title={RenderResultTitle}
            extra={
                <Button disabled={isQuery} type="primary" onClick={() => {
                    checkDepartmentChange()
                }}>
                    {isQuery ? `刷新(${waitTime})` : "刷新"}
                </Button>
            }
        />) : (
        <div className={classes.cshbxy100Per}>
            <Modal
                title="确认"
                open={isModalVisible}
                onOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
            >
                <Typography>
                    <Paragraph>变更部门：{departmentUid}</Paragraph>
                    <Paragraph>原因：{changeReason}</Paragraph>
                    <Paragraph>文件：{
                        fileList.filter((item: any) => item.status === 'done').map((item: any) => item.name).join('、')
                    }</Paragraph>
                </Typography>
            </Modal>
            <Title level={2}>部门变更申请</Title>
            <Form
                form={form}
                name="basic"
                onFinish={onFinish}
                layout="vertical"
                initialValues={{
                    file: fileList
                }}
            >
                <Form.Item
                    label="部门"
                    name="departmentUid"
                    rules={[{
                        required: true,
                        message: "请选择部门"
                    }]}
                >
                    <Select
                        showSearch
                        placeholder="请选择部门"
                        optionFilterProp="children"
                        onFocus={getDepartmentOptions}
                        options={departmentOptions}
                    />
                </Form.Item>

                <Form.Item
                    label="原因"
                    name="changeReason"
                    rules={[{
                        required: true,
                        message: "请输入原因"
                    }]}
                >
                    <TextArea showCount rows={4} maxLength={1000} placeholder="请输入原因"/>
                </Form.Item>

                <Form.Item
                    label="文件"
                    name="file"
                    rules={[{required: true, message: "请选择文件"}]}
                >
                    <FileUpLoad
                        setTableName={tableName.departmentChange}
                        getList={(list: []) => {
                            // 如果 list 为空，说明用户删除了所有的文件，此时需要将 fileList 也置为空
                            if (list.length === 0) {
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

                <Form.Item>
                    <Button type="primary" htmlType="submit">提交</Button>
                    <Button htmlType="button" onClick={onReset} style={{marginLeft: 8}}>重置</Button>
                </Form.Item>
            </Form>
        </div>
    );
};

const DepartmentChange = () => (
    <App>
        <ChangeForm/>
    </App>
)


export default DepartmentChange;
