import React, {useEffect, useState} from 'react';
import {App, Button, Form, Modal, Typography} from 'antd';
import {useNavigate} from 'react-router-dom';

import {checkLastTimeUploadFiles, submitWorkReport} from "../../component/axios/api";
import {DownLoadURL, tableName} from "../../baseInfo";
import FileUpLoad from "../../component/axios/FileUpLoad";
import {ExclamationCircleOutlined} from "@ant-design/icons";
import {useStyles} from "../../webStyle";

const {Title} = Typography;


const ChangeForm = () => {

    const classes = useStyles();

    const {message} = App.useApp();

    const navigate = useNavigate();
    // 文件上传列表
    const [fileList, setFileList] = useState<[]>([]);
    // 监听表单数据
    const [form] = Form.useForm();

    useEffect(() => {
        checkUploadFilesList();
    }, [])

    // 查询上次上传的文件列表
    const checkUploadFilesList = () => {
        checkLastTimeUploadFiles(tableName.workReport).then(res => {
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
        submitWorkReport(tableName.workReport).then(res => {
            if (res.code !== 200) {
                message.error(res.msg)
                return
            }
            navigate('/success', {
                state: {
                    object: {
                        title: "工作报告提交成功",
                        describe: "等待审批",
                        toPage: "查看申请记录",
                        toURL: '/workReport-Record',
                    }
                }
            })
        })
    }

    const showConfirm = () => {
        Modal.confirm({
            title: "确认",
            icon: <ExclamationCircleOutlined/>,
            onOk() {
                submitForm();
            }
        });
    }

    const onFinish = () => {
        showConfirm();
    };

    const onReset = () => {
        form.resetFields();
    };

    return (
        <div className={classes.cshbxy100Per}>
            <Title level={2}>工作报告</Title>
            <Form
                form={form}
                name="basic"
                layout="vertical"
                onFinish={onFinish}
                initialValues={{
                    file: fileList
                }}
            >
                <Form.Item
                    label="工作报告"
                    name="file"
                    rules={[{required: true, message: "请上传工作报告"}]}
                >
                    <FileUpLoad
                        setTableName={tableName.workReport}
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

const WorkReport = () => {
    return (
        <App>
            <ChangeForm/>
        </App>
    )
}

export default WorkReport;
