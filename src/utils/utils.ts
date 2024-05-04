export function debounce<T extends (...args: any[]) => void>(func: T, wait: number): (...args: Parameters<T>) => void {
    let timeout: ReturnType<typeof setTimeout> | null;

    return function executedFunction(...args: Parameters<T>): void {
        const later = () => {
            timeout = null;
            func(...args);
        };

        if (timeout !== null) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(later, wait);
    };
}

export function deepIsEqual(array1: KeyValuePair[], array2: KeyValuePair[]): boolean{
    if (array1.length !== array2.length) return false;
    for (let i = 0; i < array1.length; i++) {
        const object1 = array1[i];
        const object2 = array2[i];
        const keys1 = Object.keys(object1);
        const keys2 = Object.keys(object2);
        if (keys1.length !== keys2.length) return false;
        for (const key of keys1) {
            if (object1[key] !== object2[key]) return false;
        }
    }
    return true
}
