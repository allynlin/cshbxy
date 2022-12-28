import React, {useEffect, useState} from "react";
import {UploadProps} from "antd/es/upload/interface";
import intl from "react-intl-universal";
import {message, Upload} from "antd";
import Cookie from "js-cookie";
import {InboxOutlined} from "@ant-design/icons";

import {DownLoadURL, version} from "../../baseInfo";
import {deleteFile} from "./api";


interface FileUpLoadProps {
    setTableName: string
    getList: Function
    setList: []
    max?: number
}

const RenderUpLoadFiles: React.FC<FileUpLoadProps> = (props) => {
    const [fileList, setFileList] = useState<any>([]);

    const [api, contextHolder] = message.useMessage();

    const apiToken = Cookie.get('cshbxy-oa-token');
    const language = Cookie.get('cshbxy-oa-language') || 'en_US';
    const tableName = props.setTableName;

    // 接收父组件传递的 fileList
    useEffect(() => {
        setFileList(props.setList)
    }, [props.setList])

    const Setting: UploadProps = {
        name: 'file',
        headers: {
            'Authorization': `${apiToken}`,
            'tableUid': tableName,
            'version': version,
            'Accept-Language': language
        },
        multiple: true,
        action: `${DownLoadURL}/uploadFile`,
        fileList: fileList,
        // 如果上传的文件大于 500M，就提示错误
        beforeUpload: (file: any) => {
            if (file.size / 1024 / 1024 > 500) {
                api.warning(intl.get('maxFileSize', {size: 500}));
                // 将对应文件的状态设置为 error
                file.status = 'error';
                return false;
            }
            return true;
        },
        onChange(info) {
            const {status} = info.file;
            setFileList([...info.fileList]);
            if (status === "uploading") {
                api.open({
                    key: info.file.uid,
                    type: "loading",
                    content: `${info.file.name} ${intl.get('uploading')} ${info.file.percent?.toFixed(2)}%`,
                    duration: 0,
                })
            }
            if (status !== 'uploading') {
                // console.log(info.file, info.fileList);
                // 如果 fileList 为空，就传递一个空数组
                if (info.file.response === undefined) {
                    props.getList(info.fileList.length === 0 ? [] : fileList)
                    return;
                }
                switch (info.file.response.code) {
                    case 401:
                    case 403:
                        info.file.status = 'error';
                        api.error(intl.get('noPermission'));
                        break;
                    case 500:
                        info.file.status = 'error';
                        api.error(intl.get('sysError'));
                        break;
                    default:
                        // 传递参数给父组件, 用于更新父组件的 fileList，如果 info.fileList 为空，就传递一个空数组
                        props.getList(info.fileList.length === 0 ? [] : fileList)
                }
            }
            if (status === 'done') {
                if (info.file.response.code !== 200) {
                    api.open({
                        key: info.file.uid,
                        type: 'error',
                        content: `${info.file.name} ${info.file.response.msg}`,
                    })
                    return
                }
                api.open({
                    key: info.file.uid,
                    type: 'success',
                    content: `${info.file.name} ${info.file.response.msg}`,
                })
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
                props.getList(info.fileList.length === 0 ? [] : newFileList)
            }
            if (status === 'error') {
                api.open({
                    key: info.file.uid,
                    type: 'error',
                    content: `${info.file.name} ${intl.get('uploadFailed')}`,
                })
                info.file.status = 'error';
                const newFileList = fileList.map((item: any) => {
                    if (item.uid === info.file.uid) {
                        item.status = 'error';
                    }
                    return item;
                })
                setFileList(newFileList);
                props.getList(info.fileList.length === 0 ? [] : newFileList)
            }
        },
        onRemove(info: any) {
            console.log(info);
            const status = info.status;
            if (status === 'done') {
                // 获取需要删除的文件的 uid
                const uid = info.uid;
                deleteFile(uid).then(res => {
                    api.success(res.msg);
                })
                return
            }
            api.open({
                key: info.uid,
                type: 'error',
                content: `${info.name} ${intl.get('uploadCanceled')}`,
            })
            info.status = 'removed';
            const newFileList = fileList.filter((item: any) => item.uid !== info.uid);
            setFileList(newFileList);
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
            {contextHolder}
            <p className="ant-upload-drag-icon">
                <InboxOutlined/>
            </p>
            <p className="ant-upload-text">{intl.get('uploadTitle')}</p>
            <p className="ant-upload-hint">
                {intl.get('uploadDescription', {size: 500})}
            </p>
        </Upload.Dragger>
    )
}

export default RenderUpLoadFiles;
