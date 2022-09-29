import {
    Input,
    Modal,
    Button,
    Form,
    message,
    Result,
    Select,
    Typography,
    Upload, InputNumber
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
import Spin from "../../../component/loading/Spin";

const {Title} = Typography;
const {Option} = Select;
const apiToken = Cookie.get('token');
const tableName = `travelreimbursement`;

const URL = `${BaseURL}/api`;

const LeaveForm = () => {
    const navigate = useNavigate();
    // 费用类型
    const [moneyType, setMoneyType] = useState<String>('CNY');
    // 文件上传列表
    const [fileList, setFileList] = useState<any>([]);
    // 确认框状态
    const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    // 展示表单前查询上次提交的文件
    const [isRenderResult, setIsRenderResult] = useState<boolean>(true);
    // 监听表单数据
    const [form] = Form.useForm();
    const destination = Form.useWatch('destination', form);
    const expenses = Form.useWatch('expenses', form);
    const reason = Form.useWatch('reason', form);

    useEffect(() => {
        checkUploadFilesList();
    }, [])

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
        // teacherChangeDepartment(destination, expenses,reason).then(res => {
        //     setConfirmLoading(false);
        //     message.success(res.msg);
        //     navigate('/home');
        // }).catch(err => {
        //     setConfirmLoading(false);
        // })
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
                <p>出差目的地：{destination}</p>
                <p>出差费用：{expenses} {moneyType}</p>
                <p>出差原因：{reason}</p>
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

    // 出差费用类型选择
    const selectAfter = (
        <Select defaultValue="CNY" style={{width: 60}}>
            <Option value="USD">$</Option>
            <Option value="EUR">€</Option>
            <Option value="GBP">£</Option>
            <Option value="CNY">¥</Option>
        </Select>
    );

    return (
        isRenderResult ? <Spin/> :
            <div className={'body'}>
                <RenderModal/>
                <div className="zent-alert-example">
                    <Title level={2} className={'tit'}>差旅报销申请</Title>
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
                            label="出差目的地"
                            name="destination"
                            rules={[{required: true, message: '请输入你的出差目的地'}]}
                        >
                            <Input showCount={true} maxLength={50}/>
                        </Form.Item>

                        <Form.Item
                            label="出差费用"
                            name="expenses"
                            rules={[{required: true, message: '请输入出差费用'}]}
                        >
                            <InputNumber addonAfter={
                                <Select defaultValue={moneyType} style={{width: 60}} onChange={e => {
                                    setMoneyType(e)
                                }}>
                                    <Option value="USD">$</Option>
                                    <Option value="EUR">€</Option>
                                    <Option value="GBP">£</Option>
                                    <Option value="CNY">¥</Option>
                                </Select>
                            }/>
                        </Form.Item>

                        <Form.Item
                            label="出差原因"
                            name="reason"
                            rules={[{required: true, message: '请输入出差原因'}]}
                        >
                            <Input.TextArea rows={4} placeholder={"请输入出差原因，如超出1000字请提交附件"}
                                            showCount={true}
                                            maxLength={1000}/>
                        </Form.Item>

                        <Form.Item
                            label="附件材料"
                            name="file"
                            rules={[{required: true, message: '请上传附件材料'}]}
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
};

const Index = () => {
    return (
        <LeaveForm/>
    )
}

export default Index;