import React, {useEffect, useState} from "react";
import {UploadProps} from "antd/es/upload/interface";
import {message, Upload} from "antd";
import {InboxOutlined} from "@ant-design/icons";

import {DownLoadURL} from "../../baseInfo";
import {deleteFile} from "./api";
import {SStorage} from "../localStrong";


interface FileUpLoadProps {
    /** 上传文件的表名 */
    setTableName: string
    /** 接收父组件传递的 fileList 的回调 */
    getList: Function
    /** 传递 fileList 给父组件 */
    setList: []
}

/**
 * 文件上传组件
 * @param {FileUpLoadProps} props 传递参数
 * @param {string} props.setTableName 上传文件的表名
 * @param {Function} props.getList 传递 fileList 给父组件
 * @param {[]} props.setList 接收父组件传递的 fileList
 * @returns {JSX.Element}
 * @example <FileUpLoad setTableName={'tableUid'} getList={(e)=>{}} setList={fileList}/>
 * @version 1.0.0
 */
const RenderUpLoadFiles: React.FC<FileUpLoadProps> = (props) => {
    const [fileList, setFileList] = useState<any>([]);

    const [api, contextHolder] = message.useMessage();

    const apiToken = SStorage.get('token');
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
        },
        multiple: true,
        action: `${DownLoadURL}/uploadFile`,
        fileList: fileList,
        // 如果上传的文件大于 500M，就提示错误
        beforeUpload: (file: any) => {
            if (file.size / 1024 / 1024 > 500) {
                api.warning("文件大小不能超过500MB");
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
                    content: `${info.file.name}正在上传中${info.file.percent?.toFixed(2)}%`,
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
                        api.error("权限不足");
                        break;
                    case 500:
                        info.file.status = 'error';
                        api.error("服务器错误");
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
                    content: `${info.file.name}上传失败`,
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
                content: `${info.name}上传已取消`,
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
            <p className="ant-upload-text">点击或拖拽文件到此区域进行上传</p>
            <p className="ant-upload-hint">支持单个或批量上传。每个文件最大500MB</p>
        </Upload.Dragger>
    )
}

export default RenderUpLoadFiles;
