KUnit
---

一个可以用于微信小程序和浏览器的单元测试框架

### 例子

```ts
import { test } from '../index';
import KUnit from '../index';
import { assert } from 'chai';

async function wait(ms: number) {
    return new Promise(rs => {
        setTimeout(() => { rs() }, ms);
    })
}

test('Test A', async function () {
    console.log('aaa')
    assert.equal(1, 1);

    await test('A1', async function () {
        console.log('aaa1')
    })

    await test('A2', async function () {
        console.log('aaa2')
    })
})

test('Test B', function () {
    console.log('bbb')
    assert.equal(1, 2);
})

KUnit.instance.runAll()
```