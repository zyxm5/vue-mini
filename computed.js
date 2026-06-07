import { effect } from "./effect/effect.js"
import ref from './ref.js';
import track from "./effect/track.js";
import trigger from "./effect/trigger.js";
import { isObject, TrackOpTypes, TriggerOpTypes } from "./utils/utils.js";

function normalizeParam(funcOrOptions){
    // 最终返回一个对象，get，set
    let getter, setter;
    if(isObject(funcOrOptions)){
        getter = funcOrOptions.get;
        setter = funcOrOptions.set;
    }else{
        getter = funcOrOptions;
        setter = () => {
            console.warn('computed setter is not implemented');
        }
    }
    return {
        get: getter,
        set: setter
    }

}
export default function(funcOrOptions){
    const param = normalizeParam(funcOrOptions)
    // 返回一个对象，属性值value
    // 将getter返回的值赋给这个对象
    let value;
    // 创建更新标志
    let dirty = true;
    const eff = effect(param.get, {
        lazy: true,
        scheduler: (eff) => {
            // 依赖更新时，更新dirty
            dirty = true;
            // 派发更新
            trigger(res, TriggerOpTypes.SET, 'value')
        }
    })
    const res = {
        value,
        get value(){
            // 使用时，依赖收集
            track(res, TrackOpTypes.GET, 'value')
            if(dirty){
                value = eff();
                dirty = false;
            }
            return value;
        },
        set(newVal){
            setter(newVal);
        }
    };
    return res;
}