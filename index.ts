import 'k8w-extend-native';
import TestCaseResult from './src/TestCaseResult';
import TestCase from './src/TestCase';
import ColorLog from './src/ColorLog';

export default class KUnit {

    private static _instance: KUnit;
    static get instance(): KUnit {
        if (!this._instance) {
            this._instance = new KUnit();
        }
        return this._instance;
    }

    private _testCases: TestCase[] = [];

    async test(caseName: string, func: Function): Promise<TestCase> {
        let testCase: TestCase = {
            name: caseName,
            func: func
        };

        // running
        if (this._runningCasesStack.length) {
            // add child
            let childResult = await this.run(testCase);
            this._runningCasesStack.last()!.addChild(childResult);
        }
        // not running
        else {
            // add case
            this._testCases.push(testCase)
        }

        return testCase;
    };


    private _runningCasesStack: TestCaseResult[] = [];
    private async run(testCase: TestCase): Promise<TestCaseResult> {
        let result = new TestCaseResult(testCase.name);
        this._runningCasesStack.push(result);
        try {
            await testCase.func();
            result.isSucc = true;
        }
        catch (e) {
            result.isSucc = false;
            result.err = e;
        }
        this._runningCasesStack.pop();
        return result;
    }

    clear() {
        this._testCases = [];
    };

    async runAll() {
        ColorLog('------------- KUNIT TEST START  -------------', 'yellow')
        let result = new TestCaseResult('');
        for (let testCase of this._testCases) {
            result.addChild(await this.run(testCase));
        }

        ColorLog('------------- KUNIT TEST DONE  -------------', 'yellow')
        if (result.children) {
            for (let child of result.children) {
                child.show();
            }
            ColorLog(`------------- KUNIT TEST RESULT  -------------`, 'yellow')

            let succNum = result.children.count(v => v.isSucc ? true : false);
            ColorLog(`${succNum} of ${result.children.length} succeeded.`, succNum === result.children.length ? 'green' : 'red')
        }
        else {
            console.warn('没有可用的测试用例')
        }
    };
}

export const test = KUnit.instance.test.bind(KUnit.instance);