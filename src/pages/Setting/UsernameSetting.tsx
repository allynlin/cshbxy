import {Button, Form, Input, Modal, notification} from 'antd';
import React, {useState} from 'react';
import intl from "react-intl-universal";
import {checkUsername, updateUserName} from "../../component/axios/api";
import {useDispatch, useSelector} from "react-redux";
import {orange5} from "../../baseInfo";
import {logout} from "../../component/redux/isLoginSlice";
import {all} from "../../component/redux/userTypeSlice";
import Cookie from "js-cookie";
import {useNavigate} from "react-router-dom";

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

const UserInfoSetting: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [usernameUse, setUsernameUse] = useState<boolean>(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const userInfo = useSelector((state: { userInfo: { value: any } }) => state.userInfo.value);
    const userType = useSelector((state: { userType: { value: any } }) => state.userType.value);

    const CollectionCreateForm: React.FC<CollectionCreateFormProps> = ({
                                                                           open,
                                                                           onCreate,
                                                                           onCancel,
                                                                       }) => {
        const [form] = Form.useForm();
        let timeOut: any;

        const checkUserName = (e: any) => {
            // 防抖
            clearTimeout(timeOut);
            timeOut = setTimeout(() => {
                checkUsername(e.target.value, userType).then(() => {
                    setUsernameUse(true)
                }).catch(() => {
                    setUsernameUse(false)
                })
            }, 500)
        }

        return (
            <Modal
                open={open}
                title={intl.get("changeUsername")}
                okText={intl.get('ok')}
                cancelText={intl.get('cancel')}
                onCancel={onCancel}
                onOk={() => {
                    if (!usernameUse) {
                        notification["error"]({
                            message: intl.get('usernameIsExist'),
                            className: 'back-drop'
                        });
                        return
                    }
                    form
                        .validateFields()
                        .then(values => {
                            form.resetFields();
                            onCreate(values);
                        })
                        .catch(() => {
                            notification["error"]({
                                message: intl.get('submitFailed'),
                                description: intl.get('pleaseInputAllInfo'),
                                className: 'back-drop'
                            });
                        });
                }}
            >
                <Form
                    form={form}
                    layout="vertical"
                    name="form_in_modal"
                    initialValues={{
                        username: userInfo.username,
                    }}
                >
                    <Form.Item
                        label={intl.get('username')}
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: intl.get('pleaseInputUsername'),
                                pattern: /^[a-zA-Z0-9]{1,20}$/
                            },
                        ]}
                    >
                        <Input showCount maxLength={20} allowClear={true} onChange={e => {
                            checkUserName(e)
                        }}/>
                    </Form.Item>
                </Form>
            </Modal>
        );
    };

    const onCreate = (values: any) => {
        updateUserName(userInfo.uid, values.username).then(res => {
            if (res.code === 200) {
                notification["success"]({
                    message: intl.get('changeSuccess'),
                    description: intl.get('changeSuccessNotice'),
                    className: 'back-drop'
                })
                dispatch(logout())
                dispatch(all())
                Cookie.remove('token');
                Cookie.remove('username');
                navigate('/login', {replace: true})
            }
        })
        setOpen(false);
    };

    return (
        <div>
            <Button
                type="primary"
                style={{backgroundColor: orange5, borderColor: orange5}}
                onClick={() => {
                    setOpen(true);
                    notification["warning"]({
                        message: intl.get('attention'),
                        description: intl.get('changeUsernameNotice'),
                        className: 'back-drop'
                    });
                }}
            >
                {intl.get('changeUsername')}
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

export default UserInfoSetting;
