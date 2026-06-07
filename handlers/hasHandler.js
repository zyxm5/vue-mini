import { TrackOpTypes } from '../utils/utils.js';
import track from '../effect/track.js';
export default function (target, key) { 
    track(target, TrackOpTypes.HAS, key)
    return Reflect.has(target, key);
 }