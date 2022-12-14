import {App, Button, Form, Input, Modal, Radio} from 'antd';
import React, {useState} from 'react';
import intl from "react-intl-universal";
import {updateUserInfo} from "../../component/axios/api";
import {useDispatch, useSelector} from "react-redux";
import {setUser} from "../../component/redux/userInfoSlice";
import {useGaussianBlurStyles} from "../../styles/gaussianBlurStyle";

interface Values {
    title: string;
    description: string;
    modifier: string;
}

interface CollectionCreateFormProps {
    open: boolean;
    onCreate: (values: Values) => void;
    onCancel: () => void;
}

const key = "updateUserInfo"

const UserInfo: React.FC = () => {

    const {message} = App.useApp();

    const [open, setOpen] = useState(false);
    const dispatch = useDispatch();

    const gaussianBlurClasses = useGaussianBlurStyles();

    const gaussianBlur = useSelector((state: any) => state.gaussianBlur.value)
    const userInfo = useSelector((state: { userInfo: { value: any } }) => state.userInfo.value);

    const CollectionCreateForm: React.FC<CollectionCreateFormProps> = ({
                                                                           open,
                                                                           onCreate,
                                                                           onCancel,
                                                                       }) => {
        const [form] = Form.useForm();
        return (
            <Modal
                open={open}
                className={gaussianBlur ? gaussianBlurClasses.gaussianBlurModal : ''}
                mask={!gaussianBlur}
                title={intl.get("changeUserInfo")}
                okText={intl.get('ok')}
                cancelText={intl.get('cancel')}
                onCancel={onCancel}
                onOk={() => {
                    form
                        .validateFields()
                        .then(values => {
                            form.resetFields();
                            onCreate(values);
                        })
                        .catch(() => message.open({
                            key,
                            type: "error",
                            content: intl.get('pleaseInputAllInfo')
                        }));
                }}
            >
                <Form
                    form={form}
                    layout="vertical"
                    name="form_in_modal"
                    initialValues={{
                        realeName: userInfo.realeName,
                        email: userInfo.email,
                        tel: userInfo.tel,
                        gender: userInfo.gender
                    }}
                >
                    <Form.Item
                        label={intl.get('realName')}
                        name="realeName"
                        rules={[
                            {
                                required: true,
                                message: intl.get('pleaseInputRealName'),
                                pattern: /^[\u4e00-\u9fa5]{2,4}$/
                            },
                        ]}
                    >
                        <Input showCount maxLength={4} allowClear={true}/>
                    </Form.Item>

                    <Form.Item
                        label={intl.get('gender')}
                        name="gender"
                        rules={[
                            {
                                required: true,
                                message: intl.get('pleaseChooseGender'),
                            },
                        ]}
                    >
                        <Radio.Group buttonStyle="solid" style={{display: "flex"}}>
                            <Radio.Button value="???">{intl.get('male')}</Radio.Button>
                            <Radio.Button value="???">{intl.get('female')}</Radio.Button>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item
                        label={intl.get('tel')}
                        name="tel"
                        rules={[
                            {
                                required: true,
                                message: intl.get('pleaseInputTel'),
                                pattern: /^1[3456789]\d{9}$/
                            },
                        ]}
                    >
                        <Input type={"tel"} showCount maxLength={11} allowClear={true}/>
                    </Form.Item>

                    <Form.Item
                        label={intl.get('email')}
                        name="email"
                        rules={[
                            {
                                required: true,
                                message: intl.get('pleaseInputEmail'),
                                pattern: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/,
                            },
                        ]}
                    >
                        <Input type={"email"} showCount maxLength={30} allowClear={true}/>
                    </Form.Item>
                </Form>
            </Modal>
        );
    };

    const onCreate = (values: any) => {
        updateUserInfo(userInfo.uid, values.realeName, values.gender, values.tel, values.email).then(res => {
            if (res.code === 200) {
                message.open({
                    key,
                    type: "success",
                    content: intl.get('changeSuccess')
                })
                const newUserInfo = {
                    ...userInfo,
                    realeName: values.realeName,
                    email: values.email,
                    tel: values.tel,
                    gender: values.gender
                }
                dispatch(setUser(newUserInfo));
            }
        })
        setOpen(false);
    };

    return (
        <div>
            <Button
                type="primary"
                onClick={() => {
                    setOpen(true);
                }}
            >
                {intl.get('changeUserInfo')}
            </Button>
            <CollectionCreateForm
                open={open}
                onCreate={onCreate}
                onCancel={() => {
                    setOpen(false);
                }}
            />
        </div>
    );
};

const UserInfoSetting = () => {
    return (
        <App>
            <UserInfo/>
        </App>
    )
}

export default UserInfoSetting;
