import {LStorage, SStorage} from "./localStrong";

const addCache = (key: string, value: any) => {
    const userInfo = SStorage.get('userInfo');
    if (!userInfo) return;
    const userKey = `${userInfo.uid}-${key}`;
    LStorage.set(userKey, value);
}

const readCache = (key: string) => {
    const userInfo = SStorage.get('userInfo');
    const userKey = `${userInfo.uid}-${key}`;
    const cache = LStorage.get(userKey);
    // 如果没有缓存，返回 null
    if (!cache) return null;
    return cache;
}

export {
    addCache,
    readCache
}