export function errorWrap(handler: any) {
    return function (...args: any[]) {
        handler(...args).catch(args[args.length - 1]);
    };
}