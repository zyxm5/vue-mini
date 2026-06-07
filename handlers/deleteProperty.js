import trigger from "../effect/trigger.js";
import { TriggerOpTypes } from "../utils/utils.js";

export default function (target, prop) {
    trigger(target, TriggerOpTypes.DELETE_PROPERTY, prop)
    return Reflect.deleteProperty(target, prop);
}