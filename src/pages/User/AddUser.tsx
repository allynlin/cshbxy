import React, {useRef, useState} from "react";
import type {InputRef} from 'antd';
import {App, Button, Divider, Form, Input, Select, Space} from 'antd';
import {PlusOutlined} from '@ant-design/icons';

import {checkUsername, userRegister} from "../../component/axios/api";

let index = 0;

const AddUserByAdmin = () => {

    const [loading, setLoading] = useState<boolean>(false);
    const [items, setItems] = useState(['Man(男)', 'Woman(女)', 'Cis-gender woman', 'Transgender Woman', 'Woman of Trans experience', 'Woman with a history of gender transition', 'Trans feminine', 'Feminine-of-center', 'MTF (male-to-female)', 'Demigirl', 'T-girl', 'Transgirl', 'Sistergirl', 'Cis-gender man', 'Transgender man', 'Man of Trans experience', 'Man with a history of gender transition', 'Trans masculine', 'Masculine-of-center', 'FTM (female-to-male)', 'Demiboy', 'T-boy', 'Transguy', 'Brotherboy', 'Trans', 'Transgender', 'Transsexual', 'Non-binary', 'Genderqueer', 'Agender', 'Xenogender', 'Fem', 'Femme', 'Butch', 'Boi', 'Stud', 'Aggressive (AG)', 'Androgyne', 'Tomboy', 'Gender outlaw', 'Gender non-conforming', 'Gender variant', 'Gender fluid', 'Genderfuck', 'Bi-gender', 'Multi-gender', 'Pangender', 'Gender creative', 'Gender expansive', 'Third gender', 'Neutrois', 'Omnigender', 'Polygender', 'Graygender', 'Intergender', 'Maverique', 'Novigender', 'Two-spirit', 'Hijra', 'Kathoey', 'Muxe', 'Khanith/Xanith', 'X-gender', 'MTX', 'FTX', 'Bakla', 'Mahu', 'Fa’afafine', 'Waria', 'Palao’ana', 'Ashtime', 'Mashoga', 'Mangaiko', 'Chibados', 'Tida wena', 'Bixa’ah', 'Alyha', 'Hwame', 'Lhamana', 'Nadleehi', 'Dilbaa', 'Winkte', 'Ninauposkitzipxpe', 'Machi-embra', 'Quariwarmi', 'Chuckchi', 'Whakawahine', 'Fakaleiti', 'Calabai', 'Calalai', 'Bissu', 'Acault', 'Travesti', 'Questioning', 'I don’t use labels', 'Declined', 'Not listed']);
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
    const departmentUid = Form.useWatch('departmentUid', form);
    const userType = Form.useWatch('userType', form);

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
            content: "正在检测用户名是否可用",
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
                    content: "用户名已存在",
                    duration: 3,
                });
                form.resetFields(['username']);
                return;
            }
            if (password !== enterPassword) {
                message.open({
                    key,
                    type: 'error',
                    content: "两次密码不一致",
                    duration: 3,
                });
                return
            }
            setLoading(true);
            register();
        }).catch(err => {
            message.destroy();
        });
    }

    const register = () => {
        userRegister(username, password, realeName, gender, tel, email, departmentUid, userType).then(res => {
            setLoading(false)
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
            onReset();
        }).catch(() => {
            message.destroy();
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
        >
            <Form.Item
                label="用户名"
                name="username"
                rules={[
                    {
                        required: true,
                        message: "请输入用户名",
                        pattern: /^[a-zA-Z0-9]{1,20}$/
                    },
                ]}
            >
                <Input showCount maxLength={20} allowClear={true}/>
            </Form.Item>

            <Form.Item
                label="密码"
                name="password"
                rules={[
                    {
                        required: true,
                        message: "请输入密码",
                        pattern: /^[a-zA-Z0-9]{8,20}$/
                    },
                ]}
            >
                <Input.Password showCount maxLength={20} allowClear={true}/>
            </Form.Item>

            <Form.Item
                label="确认密码"
                name="enterPassword"
                rules={[
                    {
                        required: true,
                        message: "请再次输入密码",
                        pattern: /^[a-zA-Z0-9]{8,20}$/
                    },
                ]}
            >
                <Input.Password showCount maxLength={20} allowClear={true}/>
            </Form.Item>

            <Form.Item
                label="真实姓名"
                name="realeName"
                rules={[
                    {
                        required: true,
                        message: "请输入真实姓名",
                    },
                ]}
            >
                <Input showCount maxLength={10} allowClear={true}/>
            </Form.Item>

            <Form.Item
                label="性别"
                name="gender"
                rules={[
                    {
                        required: true,
                        message: "请选择性别",
                    },
                ]}
            >
                <Select
                    style={{width: 300}}
                    placeholder="请选择性别"
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
            </Form.Item>

            <Form.Item
                label="联系电话"
                name="tel"
                rules={[
                    {
                        required: true,
                        message: "请输入联系电话",
                        pattern: /^1[3456789]\d{9}$/
                    },
                ]}
            >
                <Input type={"tel"} showCount maxLength={11} allowClear={true}/>
            </Form.Item>

            <Form.Item
                label="电子邮件地址"
                name="email"
                rules={[
                    {
                        required: true,
                        message: "请输入电子邮件地址",
                        pattern: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/,
                    },
                ]}
            >
                <Input type={"email"} showCount maxLength={30} allowClear={true}/>
            </Form.Item>

            <Form.Item
                label="请选择用户类型"
                name="userType"
                rules={[
                    {
                        required: true,
                        message: "请选择用户类型",
                    },
                ]}
            >
                <Select
                    style={{width: 120}}
                    options={[{value: 'Leader', label: '领导'}, {value: 'Department', label: '部门'}]}
                />
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading} disabled={loading}>
                    添加领导/部门
                </Button>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <Button htmlType="button" disabled={loading} onClick={onReset}>
                    重置
                </Button>
            </Form.Item>
        </Form>
    )
}

const AddUser = () => (
    <App>
        <AddUserByAdmin/>
    </App>
)


export default AddUser;
