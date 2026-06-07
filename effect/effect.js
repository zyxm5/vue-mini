export const targetMap = new WeakMap();
export let activeEffect = null;
let effectStack = [];

export function cleanup(fn){
    // 要清空该函数的所有依赖
    fn.deps.forEach(dep => {
        dep.delete(fn);
    })
    fn.deps.length = 0;
}

export function effect(fn, options){
    const environment = () => {
        activeEffect = environment;
        effectStack.push(environment);
        cleanup(environment);
        const res = fn();
        effectStack.pop()
        activeEffect = effectStack[effectStack.length - 1];
        return res;
    }
    environment.deps = [];
    environment.options = options;
    if(options?.lazy){
        return environment;
    }
    environment();
}

