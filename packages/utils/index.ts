// 防抖
export const debounce = (fn: (value: any) => void, time = 500) => {
    let timer: any;
    return (args?: any) => {
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }
        timer = setTimeout(() => {
            fn(args);
            timer = null
        }, time)
    }
}
