import reactive from "./reactive.js";
import track from "./effect/track.js";
import { TrackOpTypes, TriggerOpTypes } from "./utils/utils.js";
import trigger from "./effect/trigger.js";
import { isObject } from "./utils/utils.js";

export default function(val){
    if(isObject(val)) {
        return reactive(val);
    }   
    const proxyObj = {
        value: val,
        get(){
            track(this, TrackOpTypes.GET, 'value')
            return this.value;
        },
        set(newVal){
            trigger(this, TriggerOpTypes.SET, 'value')
            this.value = newVal;
        }
    }
    return proxyObj;
}