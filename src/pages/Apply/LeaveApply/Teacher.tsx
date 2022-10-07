import {
    Input,
    Modal,
    Button,
    Form,
    message,
    Typography
} from 'antd';
import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {
    teacherChangeDepartment,
} from "../../../component/axios/api";
import '../apply-light.scss';
import '../apply-dark.scss';
import {useSelector} from "react-redux";

const {Title} = Typography;
const tableName = `changedepartmentbyteacher`;

const LeaveForm = () => {
    const navigate = useNavigate();
    // 防止反复查询变更记录
    const [isQuery, setIsQuery] = useState<boolean>(false);
    const [waitTime, setWaitTime] = useState<number>(0);
    // 确认框状态
    const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    // 监听表单数据
    const [form] = Form.useForm();
    const reason = Form.useWatch('reason', form);

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


    // 表单提交
    const submitForm = () => {
        // teacherChangeDepartment(departmentUid, changeReason).then(res => {
        //     setConfirmLoading(false);
        //     message.success(res.msg);
        //     navigate('/home/teacher/record/departmentChange');
        //     navigate('/home/success', {
        //         state: {
        //             object: {
        //                 title: '部门变更申请提交成功',
        //                 describe: '请等待管理员审批',
        //                 toPage: '查看审批记录',
        //                 toURL: '/home/teacher/record/departmentChange',
        //             }
        //         }
        //     })
        // }).catch(err => {
        //     setConfirmLoading(false);
        // })
    }


    const RenderModal: React.FC = () => {
        return (
            <Modal
                title="确认提交"
                mask={false}
                style={{
                    backdropFilter: 'blur(20px) saturate(180%)',
                    backgroundColor: 'rgba(255,255,255,0.6)'
                }}
                open={isModalVisible}
                onOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
            >
                <p>请假原因：{reason}</p>
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

    const themeColor: String = useSelector((state: {
        themeColor: {
            value: String
        }
    }) => state.themeColor.value)

    // 根据不同的 themeColor，渲染不同的样式
    const renderThemeColor = () => {
        switch (themeColor) {
            case 'dark':
                return 'body-dark'
            case 'light':
                return 'body-light'
            default:
                return 'body-light'
        }
    }

    return (
        <div className={renderThemeColor()}>
            <RenderModal/>
            <Title level={2} className={'tit'}>请假申请</Title>
            <Form
                form={form}
                name="basic"
                labelCol={{span: 8}}
                wrapperCol={{span: 16}}
                onFinish={onFinish}
            >
                <Form.Item
                    label="请假原因"
                    name="reason"
                    rules={[{required: true, message: '请输入请假原因'}]}
                >
                    <Input.TextArea rows={4} placeholder={"请输入请假原因，不超过200字"} showCount={true}
                                    maxLength={200}/>
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
    );
};

const Teacher = () => {
    return (
        <LeaveForm/>
    )
}

export default Teacher;