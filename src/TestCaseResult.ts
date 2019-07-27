import ColorLog from './ColorLog';
import KUnit from '../index';

export default class TestCaseResult {
    static currentIndentNum = 0;

    name: string;
    kunit: KUnit;

    /**
     * true  成功
     * false 失败
     * undefined 未执行完成
     */
    isSucc?: boolean;
    err?: Error;
    children?: TestCaseResult[];

    constructor(name: string, kunit: KUnit) {
        this.name = name;
        this.kunit = kunit;
    }

    addChild(child: TestCaseResult) {
        if (!this.children) {
            this.children = [];
        }
        this.children.push(child);
    }

    toString(): string {
        return '';
    }

    showResult() {
        let indent = '  '.repeat(TestCaseResult.currentIndentNum);
        if (this.isSucc) {
            ColorLog(this.kunit, `${indent}√ ${this.name}`, 'green');
        }
        else {
            ColorLog(this.kunit, `${indent}× ${this.name}`, 'red');
        }

        if (this.children) {
            ++TestCaseResult.currentIndentNum;
            for (let child of this.children) {
                child.showResult();
            }
            --TestCaseResult.currentIndentNum;
        }
    }

    showError() {
        let indent = '  '.repeat(TestCaseResult.currentIndentNum);
        if (!this.isSucc) {
            if (this.err && (this.err as any).showDiff) {
                ColorLog(this.kunit, `${indent}× ${this.name}
  |- Expected: ${JSON.stringify((this.err as any).expected, null, 2)}
  |- Actual: ${JSON.stringify((this.err as any).actual, null, 2)}
  |- ${this.err.stack}`, 'red');
            }
            else if (this.err) {
                ColorLog(this.kunit, `${indent}× ${this.name}\n  ${(this.err as Error).stack}`, 'red');
            }
            else {
                ColorLog(this.kunit, `${indent}× ${this.name}`, 'red');
            }
        }

        if (this.children) {
            ++TestCaseResult.currentIndentNum;
            for (let child of this.children) {
                !child.isSucc && child.showError();
            }
            --TestCaseResult.currentIndentNum;
        }
    }
}