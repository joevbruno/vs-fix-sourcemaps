export function myTest(y) {
  const x = 'some string';
  return x + y;
}

export default class Test {
  constructor() {
    this.state = {};
  }
  haveAGoodDay() {
    return 'hope so';
  }
  haveABadDay(sometimes) {
    if (sometimes) {
      return true;
    }
    return false;
  }
}

export const helloWorld = () => { };
