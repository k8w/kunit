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

test('await Promise succ', async function () {
    await new Promise((rs, rj) => {
        setTimeout(() => { rs() }, 50)
    })
})

test('await Promise fail', async function () {
    await new Promise((rs, rj) => {
        setTimeout(() => { rj() }, 50)
    })
})

test('await Promise uncaught', async function () {
    await new Promise((rs, rj) => {
        wait(50).then(() => {
            assert.ok(false, 'uncaught err');
        }).catch(e => {
            rj(e)
        });
    })
})

test('await Promise uncaught 2', async function () {
    await new Promise((rs, rj) => {
        setTimeout(() => {
            try {
                assert.ok(false, 'uncaught err');
            }
            catch (e) {
                rj(e)
            }
        }, 50)
    });
})


test('await Promise uncaught 2', async function () {
    await new Promise(async (rs, rj) => {
        await wait(50);
        try {
            assert.ok(false, 'uncaught err');
        }
        catch (e) {
            rj(e)
        }
    });
})


KUnit.instance.runAll().then(() => {
    console.log('应该成功 1，2-2-1，4-2-1，其余失败')
});
