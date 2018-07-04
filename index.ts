import 'k8w-extend-native';
import TestCaseResult from './src/TestCaseResult';
import TestCase from './src/TestCase';
import ColorLog from './src/ColorLog';

interface RunningTestCase {
    testCase: TestCase,
    childCases: TestCase[],
    result: TestCaseResult;
}

export default class KUnit {

    private static _instance: KUnit;
    static get instance(): KUnit {
        if (!this._instance) {
            this._instance = new KUnit();
        }
        return this._instance;
    }

    private _testCases: TestCase[] = [];

    test(caseName: string, func: Function): TestCase {
        let testCase: TestCase = {
            name: caseName,
            func: func
        };
        // running
        let lastCase = this._runningCasesStack.last();
        if (lastCase) {
            // add child
            lastCase.childCases.push(testCase);
        }
        // not running
        else {
            // add case
            this._testCases.push(testCase)
        }

        return testCase;
    };


    private _runningCasesStack: RunningTestCase[] = [];
    async run(testCase: TestCase): Promise<TestCaseResult> {
        
        // 生成RunningCase
        let runningCase: RunningTestCase = {
            testCase: testCase,
            childCases: [],
            result: new TestCaseResult(testCase.name)
        };

        // 执行主任务
        this._runningCasesStack.push(runningCase);
        try {
            await testCase.func();
        }
        catch (e) {
            // 同步过程出错 直接返回
            runningCase.result.isSucc = false;
            runningCase.result.err = e;
            return runningCase.result;
        }
        finally {
            this._runningCasesStack.pop();
        }

        // 主任务成功
        // 执行子任务
        if (runningCase.childCases.length) {
            for (let childCase of runningCase.childCases) {
                runningCase.result.addChild(await this.run(childCase));
            } 
            if (!runningCase.result.children || runningCase.result.children.some(v => !v.isSucc)) {
                runningCase.result.isSucc = false;
                return runningCase.result;
            }
        }
               
        runningCase.result.isSucc = true;
        return runningCase.result;
    }

    clear() {
        this._testCases = [];
    };

    async runAll() {        
        ColorLog('------------- KUNIT TEST START  -------------', 'yellow')
        let result = new TestCaseResult('');
        for (let testCase of this._testCases) {
            let caseResult = await this.run(testCase);
            result.addChild(caseResult);
        }

        if (result.children && result.children.some(v => !v.isSucc)) {
            ColorLog('------------- KUNIT TEST ERROR  -------------', 'yellow')

            for (let child of result.children!) {
                !child.isSucc && child.showError();
            }
        }

        if (result.children) {
            ColorLog('------------- KUNIT TEST RESULT  -------------', 'yellow')
            for (let child of result.children!) {
                child.showResult();
            }

            let succNum = result.children.count(v => v.isSucc ? true : false);
            ColorLog(`\n[RESULT] ${succNum} of ${result.children.length} succeeded.`, succNum === result.children.length ? 'green' : 'red')
        }
        else {
            console.warn('没有可用的测试用例')
        }
    };
}

export const test = KUnit.instance.test.bind(KUnit.instance);