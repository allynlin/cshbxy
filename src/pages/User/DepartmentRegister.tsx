import React, {useRef, useState} from "react";
import {App, Button, Divider, Form, Input, Radio, Select, Space} from 'antd';
import intl from "react-intl-universal";
import {useSelector} from "react-redux";
import type {InputRef} from 'antd';
import {checkUsername, userRegister} from "../../component/axios/api";
import {Employee} from "../../component/redux/userTypeSlice";
import Cookie from "js-cookie";
import {PlusOutlined} from "@ant-design/icons";

let index = 0;

const AddUserByDepartment = () => {

    const [loading, setLoading] = useState<boolean>(false);
    const [items, setItems] = useState(['Cis-gender woman', 'Woman', 'Transgender Woman', 'Woman of Trans experience', 'Woman with a history of gender transition', 'Trans feminine', 'Feminine-of-center', 'MTF (male-to-female)', 'Demigirl', 'T-girl', 'Transgirl', 'Sistergirl', 'Cis-gender man', 'Man', 'Transgender man', 'Man of Trans experience', 'Man with a history of gender transition', 'Trans masculine', 'Masculine-of-center', 'FTM (female-to-male)', 'Demiboy', 'T-boy', 'Transguy', 'Brotherboy', 'Trans', 'Transgender', 'Transsexual', 'Non-binary', 'Genderqueer', 'Agender', 'Xenogender', 'Fem', 'Femme', 'Butch', 'Boi', 'Stud', 'Aggressive (AG)', 'Androgyne', 'Tomboy', 'Gender outlaw', 'Gender non-conforming', 'Gender variant', 'Gender fluid', 'Genderfuck', 'Bi-gender', 'Multi-gender', 'Pangender', 'Gender creative', 'Gender expansive', 'Third gender', 'Neutrois', 'Omnigender', 'Polygender', 'Graygender', 'Intergender', 'Maverique', 'Novigender', 'Two-spirit', 'Hijra', 'Kathoey', 'Muxe', 'Khanith/Xanith', 'X-gender', 'MTX', 'FTX', 'Bakla', 'Mahu', 'Fa’afafine', 'Waria', 'Palao’ana', 'Ashtime', 'Mashoga', 'Mangaiko', 'Chibados', 'Tida wena', 'Bixa’ah', 'Alyha', 'Hwame', 'Lhamana', 'Nadleehi', 'Dilbaa', 'Winkte', 'Ninauposkitzipxpe', 'Machi-embra', 'Quariwarmi', 'Chuckchi', 'Whakawahine', 'Fakaleiti', 'Calabai', 'Calalai', 'Bissu', 'Acault', 'Travesti', 'Questioning', 'I don’t use labels', 'Declined', 'Not listed']);
    const [name, setName] = useState('');
    const inputRef = useRef<InputRef>(null);

    const {message} = App.useApp();

    const [form] = Form.useForm();
    const username = Form.useWatch('username', form);
    const password = Form.useWatch('password', form);
    const enterPassword = Form.useWatch('enterPassword', form);
    const realeName = Form.useWatch('realeName', form);
    const gender = Form.useWatch('gender', form);
    const tel = Form.useWatch('tel', form);
    const email = Form.useWatch('email', form);
    const userType = Form.useWatch('userType', form);

    const userInfo = useSelector((state: any) => state.userInfo.value);

    const key = 'register'

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

    const onFinish = () => {
        message.open({
            key,
            type: 'loading',
            content: intl.get('checkUserNameing'),
            duration: 0,
        });
        checkUserName();
    };

    const checkUserName = () => {
        checkUsername(username, userType).then(res => {
            if (res.code !== 200) {
                message.open({
                    key,
                    type: 'error',
                    content: intl.get('usernameIsExist'),
                    duration: 3,
                });
                form.resetFields(['username']);
                return;
            }
            if (password !== enterPassword) {
                message.open({
                    key,
                    type: 'error',
                    content: intl.get('twoPasswordIsNotSame'),
                    duration: 3,
                });
                return
            }
            register();
            setLoading(true);
        }).catch(() => {
            message.open({
                key,
                type: 'error',
                content: intl.get('tryingAgain'),
                duration: 3,
            });
            checkUserName()
        });
    }

    const register = () => {
        userRegister(username, password, realeName, gender, tel, email, userInfo.uid, userType).then(res => {
            setLoading(false);
            if (res.code !== 200) {
                message.open({
                    key,
                    type: 'error',
                    content: res.msg,
                    duration: 3,
                });
                return
            }
            message.open({
                key,
                type: 'success',
                content: res.msg,
                duration: 3,
            });
            onReset()
        }).catch(() => {
            message.open({
                key,
                type: 'error',
                content: intl.get('tryingAgain'),
                duration: 3,
            });
            register()
        });
    }

    const onReset = () => {
        form.resetFields();
    };

    return (
        <Form
            form={form}
            name="login"
            layout="vertical"
            onFinish={onFinish}
            initialValues={{
                userType: "Employee"
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
                <Input showCount maxLength={20} allowClear={true}/>
            </Form.Item>

            <Form.Item
                label={intl.get('password')}
                name="password"
                rules={[
                    {
                        required: true,
                        message: intl.get('pleaseInputPassword'),
                        pattern: /^[a-zA-Z0-9]{8,20}$/
                    },
                ]}
            >
                <Input.Password showCount maxLength={20} allowClear={true}/>
            </Form.Item>

            <Form.Item
                label={intl.get('repeatPassword')}
                name="enterPassword"
                rules={[
                    {
                        required: true,
                        message: intl.get('pleaseRepeatPassword'),
                        pattern: /^[a-zA-Z0-9]{8,20}$/
                    },
                ]}
            >
                <Input.Password showCount maxLength={20} allowClear={true}/>
            </Form.Item>

            <Form.Item
                label={intl.get('realName')}
                name="realeName"
                rules={[
                    {
                        required: true,
                        message: intl.get('pleaseInputRealName'),
                    },
                ]}
            >
                <Input showCount maxLength={10} allowClear={true}/>
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

            <Form.Item
                label={intl.get('userType')}
                name="userType"
                rules={[
                    {
                        required: true,
                        message: intl.get('pleaseChooseUserType'),
                    },
                ]}
            >
                <Radio.Group buttonStyle="solid">
                    <Radio.Button value="Employee">{intl.get('employee')}</Radio.Button>
                    <Radio.Button value="Leader">{intl.get('leader')}</Radio.Button>
                </Radio.Group>
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading} disabled={loading}>
                    {intl.get('register')}
                </Button>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <Button htmlType="button" disabled={loading} onClick={onReset}>
                    {intl.get('reset')}
                </Button>
            </Form.Item>
        </Form>
    )
}

const DepartmentLogin = () => (
    <App>
        <AddUserByDepartment/>
    </App>
)


export default DepartmentLogin;
