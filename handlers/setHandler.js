import { TriggerOpTypes, hasChanged } from "../utils/utils.js";
import trigger from "../effect/trigger.js";

export default function (target, prop, val) {
    const oldVal = target[prop];
    const res = Reflect.set(target, prop, val);
    if(hasChanged(oldVal, val)){
        trigger(target, oldVal !== undefined ? TriggerOpTypes.SET : TriggerOpTypes.ADD, prop)
        const oldLen = target.length;
        const res = Reflect.set(target, prop, val);
        // 由于其他属性导致数组长度变化时，也要触发更新
        if(Array.isArray(target) && prop !== 'length'){
            if(target.length !== oldLen){
                trigger(target, TriggerOpTypes.SET, 'length')
            }
        }
        // 显示修改数组长度，长度变小时，需要触发影响元素的删除
        if(Array.isArray(target) && prop === 'length' && target.length < oldLen){
            for (let index = target.length; index < oldLen; index++) {
                trigger(target, TriggerOpTypes.DELETE_PROPERTY, index)
            }
        }
    }
    return res;
  }