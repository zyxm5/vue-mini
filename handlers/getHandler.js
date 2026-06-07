import {TrackOpTypes, isObject, RAW} from '../utils/utils.js';
import reactive from '../reactive.js';
import track, {stopTrack, startTrack} from '../effect/track.js';

// 重新数组的includes、indexOf、lastIndexOf方法
// 当判断查询对象为对象时，使用原始对象进行查询

const arrayInstrumentations = {};
['includes', 'indexOf', 'lastIndexOf'].forEach(e => {
    arrayInstrumentations[e] = function(...args){
        const res = Array.prototype[e].apply(this, args);
        if(res !== -1 || res === true){
            return res;
        }
        return Array.prototype[e].apply(this[RAW], args);
    }
});

// pop、push、shift、unshift、splice执行时length属性不需要进行依赖收集
['pop', 'push', 'shift', 'unshift', 'splice'].forEach(e => {
    arrayInstrumentations[e] = function(...args){
        stopTrack();
        const res = Array.prototype[e].apply(this, args);
        startTrack()
        return res;
    }
})
export default function get(target, prop){
    if(prop === RAW){
        return target;
    }
    const val = Reflect.get(target, prop);
    track(target, TrackOpTypes.GET, prop);
    if(arrayInstrumentations.hasOwnProperty(prop) && Array.isArray(target)){
        return arrayInstrumentations[prop];
    }
    // 如果对象，进行深层拦截
    if(isObject(val)){
        return reactive(val);
    }
    
    
    return val;
}