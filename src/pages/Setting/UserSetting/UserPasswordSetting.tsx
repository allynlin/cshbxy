import {App, Button, Form, Input, Modal} from 'antd';
import React, {useState} from 'react';
import {useNavigate} from "react-router-dom";
import intl from "react-intl-universal";
import {updatePassword} from "../../../component/axios/api";
import {useDispatch, useSelector} from "react-redux";
import {logout} from "../../../component/redux/isLoginSlice";
import {all} from "../../../component/redux/userTypeSlice";
import Cookie from "js-cookie";
import {useGaussianBlurStyles} from "../../../styles/gaussianBlurStyle";

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

const key = "updatePassword"

const UserPassword: React.FC = () => {
    const [open, setOpen] = useState(false);

    const {message} = App.useApp();

    const navigate = useNavigate();
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
                title={intl.get("changePassword")}
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
                        .catch(() => {
                            message.open({
                                key,
                                type: "error",
                                content: intl.get('pleaseInputAllInfo')
                            })
                        });
                }}
            >
                <Form
                    form={form}
                    layout="vertical"
                    name="form_in_modal"
                >
                    <Form.Item
                        name={'password'}
                        label={intl.get("password")}
                        rules={[{required: true, message: intl.get('pleaseInputPassword')}]}
                    >
                        <Input.Password maxLength={20} showCount placeholder={intl.get('pleaseInputPassword')}/>
                    </Form.Item>
                    <Form.Item
                        name="repeatPassword"
                        label={intl.get('repeatPassword')}
                        rules={[{required: true, message: intl.get('pleaseRepeatPassword')}]}
                    >
                        <Input.Password maxLength={20} showCount placeholder={intl.get('pleaseRepeatPassword')}/>
                    </Form.Item>
                </Form>
            </Modal>
        );
    };

    const onCreate = (values: any) => {
        if (values.password !== values.repeatPassword) {
            message.open({
                key,
                type: "error",
                content: intl.get('twoPasswordIsNotSame')
            })
            return
        }
        updatePassword(userInfo.uid, values.password).then(res => {
            if (res.code === 200) {
                message.open({
                    key,
                    type: "success",
                    content: intl.get('changeSuccessNotice')
                })
                dispatch(logout())
                dispatch(all())
                Cookie.remove('token');
                Cookie.remove('password');
                navigate('/login', {replace: true})
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
                    message.open({
                        key,
                        type: "warning",
                        content: intl.get('changePasswordNotice')
                    })
                }}
            >
                {intl.get('changePassword')}
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

const UserPasswordSetting = () => {
    return (
        <App>
            <UserPassword/>
        </App>
    )
}

export default UserPasswordSetting;
