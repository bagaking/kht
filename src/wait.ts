import {TimeoutError} from "./error";

export function forMs(ms: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

export async function forCondition(fnPredict: () => boolean | Promise<boolean>, spanMs: number = 100) {
    while (true) {
        const result = fnPredict();
        if (typeof result === "boolean") {
            if (result) {
                return;
            }
        } else {
            if (await result) {
                return;
            }
        }
        await forMs(spanMs);
    }
}

export async function timeoutPromise<T>(ms: number, promiseLike: Promise<T>, onCancel?: (...args: any[]) => any[]) {
    let timeOut: NodeJS.Timeout;
    const tPromise = new Promise((resolve, reject) => {
        timeOut = setTimeout(() => {
            if (onCancel) {
                onCancel(ms);
            }
            reject(new TimeoutError(`Timed out in ${ms} ms.`, ms));
        }, ms);
    });
    return Promise.race([
        Promise.resolve(promiseLike),
        tPromise,
    ]).then((v) => {
        clearTimeout(timeOut);
        return v;
    }, (err) => {
        clearTimeout(timeOut);
        throw err;
    });
}

export async function asyncMapEach<TVal, TOut>(
    array: TVal[],
    fnIterator: (item: TVal, ind: number, array: TVal[]) => Promise<TOut>,
    maxConcurrentNum: number = 10) {
    let i = 0;
    const ret: Array<Promise<TOut>> = [];
    const running: Array<Promise<TOut>> = [];

    async function execute() {
        if (i === array.length) {
            return await Promise.resolve();
        }
        const item = array[i];
        const promise: Promise<TOut> = fnIterator(item, i, array);
        running.push(promise);
        ret.push(promise.then(() => running.splice(running.indexOf(promise), 1)[0]));
        i++;

        if (running.length >= maxConcurrentNum) {
            await Promise.race(running);
        }

        await execute();
    }

    return execute().then(() => Promise.all(ret));
}
