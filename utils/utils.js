export const TrackOpTypes = {
    GET: 'get',
    HAS: 'has',
    ITERATE: 'iterate'
}

export const TriggerOpTypes = {
    SET: 'set',
    DELETE_PROPERTY: 'deleteProperty',
    ADD: 'add'
}
export function isObject(val){
    return typeof val === 'object' && val !== null;
}

export function hasChanged(oldVal, val){
    return !Object.is(oldVal, val);
}

export const RAW = Symbol('raw')

export const ITERATE_KEY = Symbol('iterate')