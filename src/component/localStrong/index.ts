import CryptoJS from 'crypto-js'

interface Config {
    name: string,
    version: string
}

const config: Config = {
    name: 'OA_allynlin',
    version: '1.0.0',
}

enum StorageType {
    l = 'localStorage',
    s = 'sessionStorage'
}

interface IStoredItem {
    value: any
    expires?: number
}

const SECRET_KEY = 'nkldsx@#45#VDss9' // 密钥
const PREFIX = config.name + '_' + config.version + '_' // 前缀
const IS_DEV = false

// const IS_DEV = process.env.NODE_ENV === 'production' // 是否为开发环境

class MyStorage {
    storage: Storage

    // 获取所有的 key
    constructor(type: StorageType) {
        this.storage =
            type === StorageType.l ? window.localStorage : window.sessionStorage
    }

    // 加密
    private encrypt(data: string) {
        return CryptoJS.AES.encrypt(data, SECRET_KEY).toString()
    }

    // 解密
    private decrypt(data: string) {
        const bytes = CryptoJS.AES.decrypt(data, SECRET_KEY)
        return bytes.toString(CryptoJS.enc.Utf8)
    }

    // 同步 key
    private synthesisKey(key: string) {
        return PREFIX + key
    }

    set(
        key: string,
        value: any,
        expires: boolean | number = false, // false 不过期，true 为默认过期时间，number 为指定过期时间
        encryption = true // 是否加密
    ) {
        const source: IStoredItem = {value: null} // 存储的数据, 默认值为 null
        if (expires) {
            source.expires =
                new Date().getTime() +
                (expires === true ? 1000 * 60 * 60 * 24 * 365 : expires) // 默认一年
        }
        source.value = value
        const data = JSON.stringify(source) // 转换为字符串
        this.storage.setItem(
            this.synthesisKey(key),
            IS_DEV ? data : encryption ? this.encrypt(data) : data
        ) // 存储数据
    }

    get(key: string, encryption = true) {
        const value = this.storage.getItem(this.synthesisKey(key)) // 获取数据
        let realValue = ''
        if (value) {
            if (encryption && !IS_DEV) {
                realValue = this.decrypt(value) // 解密，如果解密失败，返回空字符串
            } else {
                realValue = value
            }

            const source: IStoredItem = JSON.parse(realValue) // 转换为对象
            const expires = source.expires // 过期时间
            const now = new Date().getTime() // 当前时间，如果不过期，返回数据，否则返回空字符串
            if (expires && now > expires) {
                this.delete(key)
                return null
            }

            return source.value
        }
    }

    delete(key: string) {
        this.storage.removeItem(this.synthesisKey(key)) // 删除数据
    }

    clear() {
        this.storage.clear() // 清空数据
    }
}

export const LStorage = new MyStorage(StorageType.l)
export const SStorage = new MyStorage(StorageType.s)
