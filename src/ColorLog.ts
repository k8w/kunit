export default function ColorLog(content: string, color: 'green' | 'red' | 'yellow') {
    // nodejs
    if (typeof window === 'undefined') {
        const colorMap = {
            yellow: '\x1b[33m',
            green: '\x1b[32m',
            red: '\x1b[31m',
            white: '\x1b[37m'
        };
        console.log(colorMap[color] + content + colorMap['white']);
    }
    // browser or weapp
    else {
        console.log(`%c${content}`, `color: ${color}`);
    }
}