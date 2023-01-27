import {updateUserSetting} from "./axios/api";
import {SStorage} from "./localStrong";

interface SettingItems {
    menuMode: 'inline' | 'vertical',
    gaussianBlur: boolean,
    showFloatButton: boolean,
    theme: 'light' | 'dark' | 'sys',
    showAlert: boolean
}

const defaultSetting: SettingItems = {
    menuMode: 'inline',
    gaussianBlur: false,
    showFloatButton: true,
    theme: 'sys',
    showAlert: true
}

export const settingChange = (settingItem: keyof SettingItems, newSetting: any) => {
    const newSettingItems = {...defaultSetting, [settingItem]: newSetting}
    const userUid = SStorage.get('userInfo').uid;
    if (userUid) {
        updateUserSetting(SStorage.get('userInfo').uid, JSON.stringify(newSettingItems)).then(res => {
            if (res.code !== 200) {
                SStorage.set('setting', JSON.stringify(newSettingItems))
            }
            SStorage.set('updateSetting', new Date().getTime())
        }).catch(err => {
            SStorage.set('setting', JSON.stringify(newSettingItems))
        })
    }
    // 保存到 localStorage 中
    localStorage.setItem('setting', JSON.stringify(newSettingItems))
}

export const getSetting = (settingItem: keyof SettingItems) => {
    const setting = localStorage.getItem('setting')
    if (setting) {
        const settingItems = JSON.parse(setting)
        return settingItems[settingItem]
    }
    return defaultSetting[settingItem]
}