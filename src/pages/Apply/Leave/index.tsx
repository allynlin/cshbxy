import {Alert, Button, DatePicker, Form, Input, Modal, Typography} from 'antd';
import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {addLeave, checkLastTimeLeave,} from "../../../component/axios/api";
import '../apply.scss';
import Marquee from 'react-fast-marquee';
import moment from "moment";
import intl from "react-intl-universal";

const {Title} = Typography;

const LeaveForm = () => {
    const navigate = useNavigate();
    // 防止反复查询变更记录
    const [isQuery, setIsQuery] = useState<boolean>(false);
    const [waitTime, setWaitTime] = useState<number>(0);
    // 确认框状态
    const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [alertType, setAlertType] = useState<'info' | 'warning' | 'error' | 'success'>('info');
    const [alertMessage, setAlertMessage] = useState<string>('正在获取提示信息');
    const [alertDescription, setAlertDescription] = useState<string>('正在请求提示信息，如长期展示此信息，请检查网络连接');
    // 是否有上一次请假情况
    const [isHaveLastLeave, setIsHaveLastLeave] = useState<boolean>(true);
    // 监听表单数据
    const [form] = Form.useForm();
    const reason = Form.useWatch('reason', form);
    const leaveTime = Form.useWatch('leaveTime', form);

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
        checkLastTimeLeave().then(res => {
                if (res.code === 200) {
                    if (res.body.status === 0) {
                        setAlertType('warning')
                        setAlertMessage('您有未审批通过的请假申请')
                        setAlertDescription(`您可以在请假记录中查看详情，或咨询上级部门`)
                    } else if (res.body.status === 1) {
                        setAlertType('success')
                        setAlertMessage('您上一次的请假申请已审批通过')
                        // 判断 res.body.start_time 和现在的时间差，是已经过去了还是还没到
                        const now = moment().format('YYYY-MM-DD HH:mm:ss')
                        const startTime = moment(res.body.start_time).format('YYYY-MM-DD HH:mm:ss')
                        const endTime = moment(res.body.end_time).format('YYYY-MM-DD HH:mm:ss')
                        if (moment(now).isBefore(startTime)) {
                            setAlertDescription(`您上次提交的请假申请还未到生效时间，如果有变更您可以在请假记录中修改，请注意：修改后的请假申请将重新审批`)
                        } else if (moment(now).isAfter(endTime)) {
                            setAlertDescription('您上次提交的请假申请已经过期，如果您还未销假请及时销假，如您已销假请忽略此条消息')
                        } else {
                            setAlertDescription(`您当前正在休假中，不建议再次提交请假申请，如您需要修改请假时间或销假时间，可以在请假记录页面修改，请注意：修改后的请假申请将重新审批。如您已销假请忽略此条消息`)
                        }
                    } else {
                        setAlertType('error')
                        setAlertMessage('您上一次请假申请已被驳回')
                        setAlertDescription('如果您再次提交和上一次相同的申请，请先联系上级部门，避免再次被驳回')
                    }
                    setIsHaveLastLeave(true)
                } else {
                    setAlertDescription('暂无提示信息')
                    setIsHaveLastLeave(false)
                }
            }
        )
    }, [])


    // 表单提交
    const submitForm = () => {
        addLeave(reason, leaveTime[0].format('YYYY-MM-DD HH:mm:ss'), leaveTime[1].format('YYYY-MM-DD HH:mm:ss')).then(res => {
            setConfirmLoading(false);
            navigate('/home/success', {
                state: {
                    object: {
                        title: '请假申请提交成功',
                        describe: '请等待上级部门审批',
                        toPage: '查看申请记录',
                        toURL: '/home/record/leave',
                        againTitle: '继续提交新的申请'
                    }
                }
            })
        }).catch(() => {
            setConfirmLoading(false);
        })
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

    // 渲染上次请假是否未销假、是否有未审批的请假申请、是否有已审批的请假申请
    const RenderAlert: React.FC = () => {
        return (
            <Alert
                message={alertMessage}
                description={alertDescription}
                type={alertType}
                showIcon
                closable
                style={{
                    marginBottom: '16px'
                }}
            />
        )
    }

    // 渲染时间选择器下方的提示信息
    const LoopAlert: React.FC = () => (
        <Alert
            type={alertType}
            banner
            message={
                <Marquee pauseOnHover gradient={false}>
                    {alertDescription}
                </Marquee>
            }
        />
    );

    return (
        <div className={'apply-body'}>
            {isHaveLastLeave ? <RenderAlert/> : null}
            <Modal
                title={intl.get('Confirm')}
                open={isModalVisible}
                onOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
            >
                <p>请假时间：{leaveTime ? leaveTime[0].format('YYYY-MM-DD HH:mm:ss') : '未选择请假时间'}</p>
                <p>销假时间：{leaveTime ? leaveTime[1].format('YYYY-MM-DD HH:mm:ss') : '未选择销假时间'}</p>
                <p>请假原因：{reason}</p>
            </Modal>
            <Title level={2} className={'tit'}>请假申请</Title>
            <Form
                form={form}
                name="basic"
                labelCol={{span: 8}}
                wrapperCol={{span: 16}}
                onFinish={onFinish}
                initialValues={{
                    leaveTime: [moment(), moment().add(1, 'days')]
                }}
            >

                <Form.Item
                    label="请假时间"
                    name="leaveTime"
                    rules={[{required: true, message: '请选择请假时间'}]}
                >
                    <DatePicker.RangePicker
                        renderExtraFooter={() =>
                            <LoopAlert/>
                        }
                        showTime={true}
                        format={"YYYY-MM-DD HH:mm:ss"}
                        ranges={{
                            '快捷选择': [moment(), moment().add(1, 'days')],
                            '今天': [moment(), moment().endOf('day')],
                            '一天': [moment(), moment().add(1, 'days')],
                            '一周': [moment(), moment().add(1, 'weeks')],
                            '一月': [moment(), moment().add(1, 'months')],
                        }}
                    />
                </Form.Item>

                <Form.Item
                    label={intl.get('Reason')}
                    name="reason"
                    rules={[{required: true, message: intl.get('input-required-message', {name: intl.get('Reason')})}]}
                >
                    <Input.TextArea rows={4} placeholder={intl.get('textarea-enter-placeholder', {
                        name: intl.get('Reason'),
                        max: 500
                    })} showCount={true}
                                    maxLength={500}/>
                </Form.Item>

                <Form.Item wrapperCol={{offset: 8, span: 16}} style={{textAlign: "center"}}>
                    <Button type="primary" htmlType="submit">
                        {intl.get('Submit')}
                    </Button>
                    <Button htmlType="button" onClick={onReset} style={{marginLeft: 8}}>
                        {intl.get('Reset')}
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

const Index = () => {
    return (
        <LeaveForm/>
    )
}

export default Index;
