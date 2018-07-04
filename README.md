KUnit
---

一个可以用于微信小程序和浏览器的单元测试框架

### 例子

```ts
import { test } from '../index';
import { assert } from 'chai';
import KUnit from '../index';

test('测试用例1', function () {
    assert.equal(1, 1);
})

let case2 = test('异步测试用例 2', function () {
    test('2-1', async function () {
        await (3000);
        assert.equal(1, 1);
        console.log('FINISH 2-1')
    })

    test('2-2', async function () {
        await (500);
        assert.equal(1, 2);
        console.log('FINISH 2-2')
    })
})

test('测试用例3', function () {
    assert.equal(1, 2, '1等于2应该异常');
})

test('同步测试用例 4', function () {
    test('2-1', function () {
        assert.equal(1, 1);
    })

    test('2-2', function () {
        assert.equal(1, 2);
    })
})

async function wait(ms: number) {
    return new Promise(rs => {
        setTimeout(() => { rs() }, ms);
    })
}

KUnit.instance.runAll();
```