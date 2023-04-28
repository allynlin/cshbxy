import {App, Button, Divider, Form, Input, Modal, Radio, Select, Space} from 'antd';
import React, {useRef, useState} from 'react';
import type {InputRef} from 'antd';
import intl from "react-intl-universal";
import {updateUserInfo} from "../../../component/axios/api";
import {useDispatch, useSelector} from "react-redux";
import {setUser} from "../../../component/redux/userInfoSlice";
import {useGaussianBlurStyles} from "../../../styles/gaussianBlurStyle";
import Cookie from "js-cookie";
import {PlusOutlined} from "@ant-design/icons";

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
let index = 0;

const UserInfo: React.FC = () => {

    const [items, setItems] = useState(['Cis-gender woman', 'Woman', 'Transgender Woman', 'Woman of Trans experience', 'Woman with a history of gender transition', 'Trans feminine', 'Feminine-of-center', 'MTF (male-to-female)', 'Demigirl', 'T-girl', 'Transgirl', 'Sistergirl', 'Cis-gender man', 'Man', 'Transgender man', 'Man of Trans experience', 'Man with a history of gender transition', 'Trans masculine', 'Masculine-of-center', 'FTM (female-to-male)', 'Demiboy', 'T-boy', 'Transguy', 'Brotherboy', 'Trans', 'Transgender', 'Transsexual', 'Non-binary', 'Genderqueer', 'Agender', 'Xenogender', 'Fem', 'Femme', 'Butch', 'Boi', 'Stud', 'Aggressive (AG)', 'Androgyne', 'Tomboy', 'Gender outlaw', 'Gender non-conforming', 'Gender variant', 'Gender fluid', 'Genderfuck', 'Bi-gender', 'Multi-gender', 'Pangender', 'Gender creative', 'Gender expansive', 'Third gender', 'Neutrois', 'Omnigender', 'Polygender', 'Graygender', 'Intergender', 'Maverique', 'Novigender', 'Two-spirit', 'Hijra', 'Kathoey', 'Muxe', 'Khanith/Xanith', 'X-gender', 'MTX', 'FTX', 'Bakla', 'Mahu', 'Fa’afafine', 'Waria', 'Palao’ana', 'Ashtime', 'Mashoga', 'Mangaiko', 'Chibados', 'Tida wena', 'Bixa’ah', 'Alyha', 'Hwame', 'Lhamana', 'Nadleehi', 'Dilbaa', 'Winkte', 'Ninauposkitzipxpe', 'Machi-embra', 'Quariwarmi', 'Chuckchi', 'Whakawahine', 'Fakaleiti', 'Calabai', 'Calalai', 'Bissu', 'Acault', 'Travesti', 'Questioning', 'I don’t use labels', 'Declined', 'Not listed']);
    const [name, setName] = useState('');
    const inputRef = useRef<InputRef>(null);

    const {message} = App.useApp();

    const [open, setOpen] = useState(false);
    const dispatch = useDispatch();

    const gaussianBlurClasses = useGaussianBlurStyles();

    const gaussianBlur = useSelector((state: any) => state.gaussianBlur.value)
    const userInfo = useSelector((state: { userInfo: { value: any } }) => state.userInfo.value);

    // 用于英文性别
    const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    };

    const addItem = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
        e.preventDefault();
        setItems([...items, name || `New item ${index++}`]);
        setName('');
        setTimeout(() => {
            inputRef.current?.focus();
        }, 0);
    };

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
                                pattern: /^[\u4e00-\u9fa5]{2,100}$/
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
                        {
                            Cookie.get("cshbxy-oa-language") === "zh" ?
                                <Radio.Group buttonStyle="solid" style={{display: "flex"}}>
                                    <Radio.Button value="男">{intl.get('male')}</Radio.Button>
                                    <Radio.Button value="女">{intl.get('female')}</Radio.Button>
                                </Radio.Group> :
                                <Select
                                    style={{width: 300}}
                                    placeholder={intl.get('pleaseChooseGender')}
                                    dropdownRender={(menu) => (
                                        <>
                                            {menu}
                                            <Divider style={{margin: '8px 0'}}/>
                                            <Space style={{padding: '0 8px 4px'}}>
                                                <Input
                                                    placeholder="Please enter item"
                                                    ref={inputRef}
                                                    value={name}
                                                    onChange={onNameChange}
                                                />
                                                <Button type="text" icon={<PlusOutlined/>} onClick={addItem}>
                                                    Add item
                                                </Button>
                                            </Space>
                                        </>
                                    )}
                                    options={items.map((item) => ({label: item, value: item}))}
                                />
                        }
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
