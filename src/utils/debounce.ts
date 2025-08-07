export const debounce = (func: Function, delay: number = 300) => {
  let timer: any;
  return function (this: any, ...args: any[]) {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      func.apply(this, args);
      timer = null;
    }, delay);
  };
};
