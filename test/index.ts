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

    test('A1', async function () {
        console.log('aaa1')
    })

    test('A2', async function () {
        console.log('aaa2')
    })
})

test('Test B', function () {
    console.log('bbb')
    assert.equal(1, 2);
})

KUnit.instance.runAll()