import handlers from "./handlers/index.js";
import { isObject } from "./utils/utils.js";

// 缓存代理对象
const proxyCache = new WeakMap();

export default function reactive(obj){
    // 添加边界判断
    // 1、如果不是对象，则直接返回
    if(!isObject(obj)){
        return obj;
    }
    // 2、如果已经是代理对象了，则返回代理对象
    if(proxyCache.has(obj)){
        return obj;
    }

    const proxy = new Proxy(obj,handlers)
    proxyCache.set(proxy ,obj);
    return proxy;
}