import {Alert, App, Button, DatePicker, Form, Modal, Typography} from 'antd';
import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import Marquee from 'react-fast-marquee';
import moment from "moment";
import intl from "react-intl-universal";
import type {Dayjs} from 'dayjs';
import dayjs from 'dayjs';

import {addLeave, checkLastTimeLeave,} from "../../component/axios/api";
import {useStyles} from "../../styles/webStyle";
import BraftEditor from "braft-editor";

const {Title, Paragraph} = Typography;

const LeaveForm = () => {

    const classes = useStyles();

    const {message} = App.useApp();

    const navigate = useNavigate();
    // 确认框状态
    const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [alertType, setAlertType] = useState<'info' | 'warning' | 'error' | 'success'>('info');
    const [alertMessage, setAlertMessage] = useState<string>(intl.get('leaveTitle-1'));
    const [alertDescription, setAlertDescription] = useState<string>(intl.get('leaveDesc-1'));
    // 是否有上一次请假情况
    const [isHaveLastLeave, setIsHaveLastLeave] = useState<boolean>(true);
    // 监听表单数据
    const [form] = Form.useForm();
    const reason = Form.useWatch('reason', form);
    const leaveTime = Form.useWatch('leaveTime', form);

    const controls = ['bold', 'italic', 'underline', 'text-color', 'separator', 'link'];

    useEffect(() => {
        checkLastTimeLeave().then(res => {
            if (res.code !== 200) {
                setAlertDescription(intl.get('leaveDesc-7'))
                setIsHaveLastLeave(false)
                return
            }
            if (res.body.status === 0) {
                setAlertType('warning')
                setAlertMessage(intl.get('leaveTitle-2'))
                setAlertDescription(intl.get('leaveDesc-2'))
            } else if (res.body.status === 1) {
                setAlertType('success')
                setAlertMessage(intl.get('leaveTitle-3'))
                // 判断 res.body.start_time 和现在的时间差，是已经过去了还是还没到
                const now = moment().format('YYYY-MM-DD HH:mm:ss')
                const startTime = moment(res.body.start_time).format('YYYY-MM-DD HH:mm:ss')
                const endTime = moment(res.body.end_time).format('YYYY-MM-DD HH:mm:ss')
                if (moment(now).isBefore(startTime)) {
                    setAlertDescription(intl.get('leaveDesc-3'))
                } else if (moment(now).isAfter(endTime)) {
                    setAlertDescription(intl.get('leaveDesc-4'))
                } else {
                    setAlertDescription(intl.get('leaveDesc-5'))
                }
            } else {
                setAlertType('error')
                setAlertMessage(intl.get('leaveTitle-4'))
                setAlertDescription(intl.get('leaveDesc-6'))
            }
            setIsHaveLastLeave(true)
        })
    }, [])


    // 表单提交
    const submitForm = () => {
        addLeave(reason.toHTML(), leaveTime[0].format('YYYY-MM-DD HH:mm:ss'), leaveTime[1].format('YYYY-MM-DD HH:mm:ss')).then(res => {
            if (res.code !== 200) {
                message.error(res.msg)
                return
            }
            navigate('/success', {
                state: {
                    object: {
                        title: intl.get('leaveApply') + ' ' + intl.get('submitSuccess'),
                        describe: intl.get('waitApprove'),
                        toPage: intl.get('showApplyList'),
                        toURL: '/leave-record',
                        againTitle: intl.get('continueSubmit')
                    }
                }
            })
        }).finally(() => {
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

    const onFinish = () => {
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

    const rangePresets: {
        label: string;
        value: [Dayjs, Dayjs];
    }[] = [
        {label: intl.get('today'), value: [dayjs(), dayjs()]},
        {label: intl.get('oneDay'), value: [dayjs(), dayjs().add(1, 'day')]},
        {label: intl.get('oneWeek'), value: [dayjs(), dayjs().add(7, 'd')]},
        {label: intl.get('oneMonth'), value: [dayjs(), dayjs().add(30, 'd')]},
    ];

    return (
        <div className={classes.cshbxy100Per}>
            {isHaveLastLeave ? <RenderAlert/> : null}
            <Modal
                title={intl.get('confirm')}
                open={isModalVisible}
                onOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
            >
                <Typography>
                    <Paragraph>{intl.get('startTime')}：{leaveTime ? leaveTime[0].format('YYYY-MM-DD HH:mm:ss') : intl.get('notChooseStartTime')}</Paragraph>
                    <Paragraph>{intl.get('endTime')}：{leaveTime ? leaveTime[1].format('YYYY-MM-DD HH:mm:ss') : intl.get('notChooseEndTime')}</Paragraph>
                    <Paragraph>{intl.get('reason')}：</Paragraph>
                    <div className={classes.outPutHtml} dangerouslySetInnerHTML={{__html: reason?.toHTML()}}/>
                </Typography>
            </Modal>
            <Title level={2}>{intl.get('leaveApply')}</Title>
            <Form
                form={form}
                name="basic"
                layout="vertical"
                onFinish={onFinish}
            >

                <Form.Item
                    label={intl.get('leaveTime')}
                    name="leaveTime"
                    rules={[{required: true, message: intl.get('pleaseChooseLeaveTime')}]}
                >
                    <DatePicker.RangePicker
                        renderExtraFooter={() =>
                            <LoopAlert/>
                        }
                        showTime={true}
                        format={"YYYY-MM-DD HH:mm:s"}
                        presets={rangePresets}
                    />
                </Form.Item>

                <Form.Item
                    label={intl.get('reason')}
                    name="reason"
                    rules={[{required: true, message: intl.get('pleaseInputReason')}]}
                >
                    <BraftEditor
                        // @ts-ignore
                        controls={controls}
                        placeholder={intl.get('pleaseInputReason')}
                    />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        {intl.get('submit')}
                    </Button>
                    <Button htmlType="button" onClick={onReset} style={{marginLeft: 8}}>
                        {intl.get('reset')}
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

const Leave = () => {
    return (
        <App>
            <LeaveForm/>
        </App>
    )
}

export default Leave;
