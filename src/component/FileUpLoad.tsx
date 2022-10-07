import React, {useState, useEffect} from "react";
import {UploadProps} from "antd/es/upload/interface";
import {DownLoadURL, version} from "../baseInfo";
import {message, Upload} from "antd";
import {deleteFile} from "./axios/api";
import Cookie from "js-cookie";
import {InboxOutlined} from "@ant-design/icons";
import {rootNavigate} from "../App";

interface FileUpLoadProps {
    setTableName: string
    getList: Function
    setList: []
    max?: number
}

const RenderUpLoadFiles: React.FC<FileUpLoadProps> = (props) => {
    const [fileList, setFileList] = useState<any>([]);

    const apiToken = Cookie.get('token');
    const tableName = props.setTableName;

    // 接收父组件传递的 fileList
    useEffect(() => {
        setFileList(props.setList)
    }, [props.setList])

    const Setting: UploadProps = {
        listType: "picture",
        name: 'file',
        headers: {
            'Authorization': `${apiToken}`,
            'tableUid': tableName,
            'version': version
        },
        multiple: true,
        maxCount: props.max ? props.max : undefined,
        action: `${DownLoadURL}/uploadFile`,
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
                if (typeof info.file.response === 'string') {
                    // 字符串格式： Message{code=101, msg='版本校验失败'}
                    // 去除字符串多余元素，只保留 code 和 msg
                    const code = info.file.response.split('=')[1].split(',')[0].replace(/'/g, '"');
                    if (code === '101' || code === '103') {
                        rootNavigate('/103')
                    } else if (code === "401" || code === "403") {
                        Cookie.remove('token');
                        Cookie.remove('userType');
                        rootNavigate('/403')
                    }
                    // 将对应文件的状态设置为 error
                    info.file.status = 'error';
                    return
                }
                // 传递参数给父组件, 用于更新父组件的 fileList，如果 info.fileList 为空，就传递一个空数组
                props.getList(info.fileList.length === 0 ? [] : fileList)
            }
            if (status === 'done') {
                if (info.file.response.code === 200) {
                    message.success(info.file.response.msg);
                    // 找到对应的文件，将它的 uid 修改为 response.body
                    const newFileList = fileList.map((item: any) => {
                        if (item.uid === info.file.uid) {
                            item.url = `${DownLoadURL}/downloadFile?filename=${info.file.response.body}`;
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
        onPreview(file: any) {
            // 当前页面重定向
            window.location.replace(file.url);
        },
        progress: {
            strokeColor: {
                '0%': '#fce38a',
                '100%': '#3cd500',
            },
            strokeWidth: 3,
            format: percent => percent && `${parseFloat(percent.toFixed(2))}%`,
        },
    };

    return (
        <Upload.Dragger {...Setting}>
            <p className="ant-upload-drag-icon">
                <InboxOutlined/>
            </p>
            <p className="ant-upload-text">单击或拖动文件到此区域进行上传</p>
            <p className="ant-upload-hint">
                支持单个文件或批量上传（单文件不超过 20M）
            </p>
        </Upload.Dragger>
    )
}


export default RenderUpLoadFiles;