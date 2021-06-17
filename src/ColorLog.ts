import { KUnit } from './index';
export default function ColorLog(kunit: KUnit, content: string, color: 'green' | 'red' | 'yellow') {
    if (kunit.logger !== console || kunit.options.disableColorLog) {
        if (color === 'red') {
            kunit.logger.error(content);
        }
        else if (color === 'yellow') {
            kunit.logger.warn(content);
        }
        else {
            kunit.logger.log(content);
        }
        return;
    }

    // nodejs
    if (typeof window === 'undefined') {
        const colorMap = {
            yellow: '\x1b[33m',
            green: '\x1b[32m',
            red: '\x1b[31m',
            white: '\x1b[37m'
        };
        kunit.logger.log(colorMap[color] + content + colorMap['white']);
    }
    // browser or weapp
    else {
        let bg = color == 'yellow' ? 'background: black;' : '';
        kunit.logger.log(`%c${content}`, `color: ${color};${bg}`);
    }
}