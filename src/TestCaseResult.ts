import ColorLog from './ColorLog';

export default class TestCaseResult {
    static currentIndentNum = 0;

    name: string;

    /**
     * true  成功
     * false 失败
     * undefined 未执行完成
     */
    isSucc?: boolean;
    err?: Error;
    children?: TestCaseResult[];

    constructor(name: string) {
        this.name = name;
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

    //     show() {
    //         let indent = '  '.repeat(TestCaseResult.currentIndentNum);
    //         if (this.isSucc) {
    //             ColorLog(`${indent}√ ${this.name}`, 'green');
    //         }
    //         else {
    //             if (this.err && (this.err as any).showDiff) {
    //                 ColorLog(`${indent}× ${this.name}
    //   |- Expected: ${(this.err as any).expected}
    //   |- Actual: ${(this.err as any).actual}
    //   |- ${this.err.stack}`, 'red');
    //             }
    //             else if(this.err){
    //                 ColorLog(`${indent}× ${this.name}\n  ${(this.err as Error).stack}`, 'red');
    //             }
    //             else {
    //                 ColorLog(`${indent}× ${this.name}`, 'red');
    //             }
    //         }        

    //         if (this.children) {
    //             ++TestCaseResult.currentIndentNum;
    //             for (let child of this.children) {
    //                 child.show();
    //             }
    //             --TestCaseResult.currentIndentNum;
    //         }
    //     }

    showResult() {
        let indent = '  '.repeat(TestCaseResult.currentIndentNum);
        if (this.isSucc) {
            ColorLog(`${indent}√ ${this.name}`, 'green');
        }
        else {
            ColorLog(`${indent}× ${this.name}`, 'red');
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
                ColorLog(`${indent}× ${this.name}
  |- Expected: ${JSON.stringify((this.err as any).expected, null, 2)}
  |- Actual: ${JSON.stringify((this.err as any).actual, null, 2)}
  |- ${this.err.stack}`, 'red');
            }
            else if (this.err) {
                ColorLog(`${indent}× ${this.name}\n  ${(this.err as Error).stack}`, 'red');
            }
            else {
                ColorLog(`${indent}× ${this.name}`, 'red');
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