import { effect, cleanup } from "./effect/effect.js";
import { isObject } from "./utils/utils.js";
function normalizeParam(param){
    if(typeof param === 'function'){
        return param;
    }
    return () => traverse(param)
}   

function traverse(val, senn = new Set()){
    if(!isObject(val) || senn.has(val)){
        return val;
    }
    for (const key in val) {
        traverse(val[key], senn)
    }
    return val;
}

/**
 * 依赖更新时，执行回调函数
 * @param {*} source 
 * @param {*} cb 
 * @param {*} options 
 * @returns 
 */
export default function(source, cb, options){
    // 首先需要对source进行参数归一化处理，得到一个函数
    const depFunc = normalizeParam(source);
    let oldVal, newVal;
    const job = () => {
        newVal = effectFun();
        cb(newVal, oldVal);
        oldVal = newVal;
        if(options.once){
            cleanup(effectFun)
        }
    }
    // 对这个func进行依赖收集
    const effectFun = effect(depFunc, {
        lazy: true, 
        scheduler: () => {
            if(options.flush === 'post'){
                Promise.resolve().then(job)
            }else{
                job()
            }
        }
    })
    if(options.immediate){
        job();
    }else{
        effectFun()
    }
    // 返回一个停止watch的函数
    return () => {
        cleanup(effectFun)
    }
}