const fibonacci = require('fibonacci');

export const fibCache = {};

// Builds a dictionary of fibonacci sequence numbers up to the specified places
export function buildFibCache(places) {
  fibonacci.on('result', (num) => {
    if (num.iterations <= places) {
      fibCache[num.number] = true;
    } else {
      fibonacci.kill();
    }
  });

  fibonacci.iterate();
}

export function isFib(n) {
  if (fibCache[n]) {
    return true;
  }

  return false;
}
