import 'k8w-extend-native';
import TestCaseResult from './src/TestCaseResult';
import TestCase from './src/TestCase';
import ColorLog from './src/ColorLog';
import { Logger } from './src/Logger';

interface RunningTestCase {
    testCase: TestCase,
    childCases: TestCase[],
    result: TestCaseResult;
}

export interface KUnitOptions {
    disableColorLog?: boolean;
}

export default class KUnit {

    options: KUnitOptions = {}

    logger: Logger = console;

    private static _instance: KUnit;
    static get instance(): KUnit {
        if (!this._instance) {
            this._instance = new KUnit();
        }
        return this._instance;
    }

    private _testCases: TestCase[] = [];
    get testCases() {
        return this._testCases;
    }

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
            result: new TestCaseResult(testCase.name, this)
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
        ColorLog(this, '------------- KUNIT TEST START  -------------', 'yellow')
        let result = new TestCaseResult('', this);
        for (let testCase of this._testCases) {
            let caseResult = await this.run(testCase);
            result.addChild(caseResult);

            if (caseResult.isSucc) {
                this.logger.log(`${result.children!.length}/${this._testCases.length} √ Succ [${caseResult.name}]`)
            }
            else {
                this.logger.error(`${result.children!.length}/${this._testCases.length} × Fail [${caseResult.name}]`)
            }
        }

        if (result.children && result.children.some(v => !v.isSucc)) {
            ColorLog(this, '------------- KUNIT TEST ERROR  -------------', 'yellow')

            for (let child of result.children!) {
                !child.isSucc && child.showError();
            }
        }

        if (result.children) {
            ColorLog(this, '------------- KUNIT TEST RESULT  -------------', 'yellow')
            for (let child of result.children!) {
                child.showResult();
            }

            let succNum = result.children.count(v => v.isSucc ? true : false);
            ColorLog(this, `\n[RESULT] ${succNum} of ${result.children.length} succeeded.`, succNum === result.children.length ? 'green' : 'red')
        }
        else {
            console.warn('没有可用的测试用例')
        }

        return result;
    };
}

export const test = KUnit.instance.test.bind(KUnit.instance);