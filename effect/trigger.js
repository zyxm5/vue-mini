import {activeEffect, targetMap} from './effect.js';
import { TrackOpTypes, TriggerOpTypes } from '../utils/utils.js';

// 定义修改数据和触发数据的映射关系
const triggerTypeMap = {
  [TriggerOpTypes.SET]: [TrackOpTypes.GET],
  [TriggerOpTypes.ADD]: [
    TrackOpTypes.GET,
    TrackOpTypes.ITERATE,
    TrackOpTypes.HAS,
  ],
  [TriggerOpTypes.DELETE_PROPERTY]: [
    TrackOpTypes.GET,
    TrackOpTypes.ITERATE,
    TrackOpTypes.HAS,
  ],
};

export default function(target, opType, key){
    const effectFuns = getEffectFuns(target, opType, key);

    if(effectFuns.length === 0){
        return;
    }
    for (const effectFun of effectFuns) {
        if(effectFun === activeEffect){
            continue;
        }
        if(effectFun.options?.scheduler){
            return effectFun.options.scheduler(effectFun);
        }
        effectFun();
    }    
}
/**
 * 收集依赖函数
 * @param {*} target 
 * @param {*} opType 
 * @param {*} key 
 * @returns 
 */
function getEffectFuns(target, opType, key){
    const propMap = targetMap.get(target);
    if(!propMap){
        return [];
    }
    // 如果是新增或者删除，会额外触发迭代
    const keys = [key];
    if(opType === TriggerOpTypes.ADD || opType === TriggerOpTypes.DELETE_PROPERTY){
        keys.push(ITERATE_KEY);
    }
    let effectFuns = new Set();
    for (const key of keys) {
        const typeMap = propMap.get(key);
        if(!typeMap){
            continue;
        }
        const trackTypes = triggerTypeMap[opType];
        for (const trackType of trackTypes) {
            const deps = typeMap.get(trackType);
            if(!deps){
                continue;
            }
            for (const dep of deps) {
                effectFuns.add(dep);
            }
        }
    }
    return effectFuns;
}