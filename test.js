import workers from './index.js';

/* Test 1: Basic code execution */
console.log('--- Test 1: Basic execution ---');
const worker1 = workers.Fn('acquire');
const result1 = await worker1.Fn('run', `export default 2 + 2`);
console.log(result1);

/* Test 2: Input via env */
console.log('\n--- Test 2: Input via env ---');
const worker2 = workers.Fn('acquire');
const result2 = await worker2.Fn('run', `export default 'Hello ' + env.name`, { name: 'Dejan' });
console.log(result2);

/* Test 3: Console.log bridge */
console.log('\n--- Test 3: Console.log ---');
const worker3 = workers.Fn('acquire');
const result3 = await worker3.Fn('run', `console.log('from sandbox'); export default 'done'`);
console.log(result3);

/* Test 4: Fetch */
console.log('\n--- Test 4: Fetch ---');
const worker4 = workers.Fn('acquire');
const result4 = await worker4.Fn('run', `
const res = await fetch('https://httpbin.org/get');
const data = await res.json();
export default data.url;
`);
console.log(result4);

/* Test 5: Error handling */
console.log('\n--- Test 5: Error handling ---');
const worker5 = workers.Fn('acquire');
const result5 = await worker5.Fn('run', `throw new Error('test error')`);
console.log(result5);

console.log('\n--- All tests complete ---');
