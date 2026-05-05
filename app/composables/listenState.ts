export const listenState = () => {
    return {
        dataState: useState('dataState', () => 0)
    }
}