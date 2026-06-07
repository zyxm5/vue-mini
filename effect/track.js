import { TrackOpTypes, ITERATE_KEY } from "../utils/utils.js";
import { activeEffect, targetMap } from './effect.js';

let enableTrack = true;

export function stopTrack(){
    enableTrack = false;
}

export function startTrack(){
    enableTrack = true;
}
export default function(target, opType, key){
    if(!enableTrack || !activeEffect){
        return;
    }
    
    let propMap = targetMap.get(target);
    if(!propMap){
        propMap = new Map();
        targetMap.set(target, propMap);
    }
    if(opType === TrackOpTypes.ITERATE){
        key = ITERATE_KEY;
    }
    let typeMap = propMap.get(key);
    if(!typeMap){
        typeMap = new Map();
        propMap.set(key, typeMap);
    }
    let deps = typeMap.get(opType);
    if(!deps){
        deps = new Set();
        typeMap.set(opType, deps);
    }
    if(deps.has(activeEffect)){
        return;
    }
    // 关联当前的effect
    deps.add(activeEffect);
    // effect 关联当前的deps
    activeEffect.deps.push(deps);
}