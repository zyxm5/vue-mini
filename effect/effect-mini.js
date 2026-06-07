const depMap = new Map();
let activeEffect = null;
let effectStack = [];
function track(target, prop){
    if(!activeEffect){
        return;
    }
    let fnSet;
    if(depMap.has(prop)){
        fnSet = depMap.get(prop);
    }else{
        fnSet = new Set();
    }
    fnSet.add(activeEffect);
    depMap.set(prop, fnSet);
    activeEffect.deps.push(fnSet)
    console.log(depMap);
}

function trigger(target, prop, val){
    const fnSet = depMap.get(prop);
    if(!fnSet){
        return;
    }
    // 创建快照，避免 cleanup 删除 + track 重新添加导致 forEach 无限循环
    const effectsToRun = [...fnSet];
    effectsToRun.forEach(fn => {
        fn();
    })
}

function cleanup(fn){
    // 要清空该函数的所有依赖
    fn.deps.forEach(dep => {
        dep.delete(fn);
        if(dep.size === 0){
            for (const [key, value] of depMap) {
                if(value === dep){
                    depMap.delete(key);
                }
            }
        }
    })
    fn.deps.length = 0;
}

function effect(fn){
    const environment = () => {
        activeEffect = environment;
        effectStack.push(environment);
        cleanup(environment);
        fn();
        activeEffect = effectStack.pop();
    }
    environment.deps = [];
    environment();
}
const proxyObj = new Proxy({
    a: 1
}, {
    get(target, prop){
        track(target,prop);
        return Reflect.get(target, prop)
    },
    set(target, prop, val){
        const res = Reflect.set(target, prop, val)
        trigger(target, prop, val)
        return res;
    }
})

// effect(() => {
//     if(proxyObj.a === 1){
//         proxyObj.b;
//         console.log('函数1执行了')
//     }else{
//         proxyObj.c;
//         console.log('函数2执行了')
//     }
// })

effect(() => {
    effect(() => {
        proxyObj.b;
        console.log('函数1执行了')
    })
    proxyObj.a;
    console.log('函数2执行了')
})

// proxyObj.a = 2;
