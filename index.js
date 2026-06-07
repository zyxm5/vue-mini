import reactive from './reactive.js';
import { effect } from './effect/effect.js';
import computed from './computed.js';
import watch from './watch.js';
const obj = {
    a: {
        b: 1
    }
}
const arr = [1, obj, 3]
const proxyObj = reactive(obj);
const proxyArr = reactive(arr);
// proxyObj.a;
// for (const key in proxyObj) {
//     const element = proxyObj[key];
// }
// 'a' in proxyObj
// proxyObj.c = 1;
// proxyObj.a.b = 2
// delete proxyObj.a.b
// console.log(proxyObj)
// console.log(reactive(proxyObj))
// console.log(proxyArr)
// console.log(proxyArr.includes(obj)) 
// proxyArr[5] = 1
// proxyArr.length = 1
// proxyArr.push(1)
// const fn = effect(() => {
//     proxyObj.a
//     console.log('执行了')
// }, {
//     scheduler: (fn) => {
//         setTimeout(() => {
//             fn();
//         }, 1000)
//     }
// })

// fn()
// proxyObj.a = 2

// const c = computed(() => {
//     console.log('执行了')
//     return proxyObj.a.b + 1
// })
// console.log(c.value)
// proxyObj.a.b = 2
// console.log(c.value)

const unwatch = watch(proxyObj, (newVal, oldVal) => {
    console.log('监听a', newVal, oldVal)
}, {
    once: true,
    // immediate: true
})

proxyObj.a.b = 23
// unwatch();
// proxyObj.a = 3