import { buildFibCache, fibCache } from '../fib'

describe('fib', () => {
    it('should resolve if Fibonacci Cache has 1000 positions', async () => {
        buildFibCache(1000)
        expect(Object.keys(fibCache)).toHaveLength(1000)
    })
})
