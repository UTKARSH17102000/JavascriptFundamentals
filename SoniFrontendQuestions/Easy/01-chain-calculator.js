/**
 * Soni Frontend — Easy — Chain calculator (Publicis, Meesho)
 * Calculator with add, subtract, multiply and method chaining; getValue() returns current value.
 */

class Calculator {
  constructor(initialValue = 0) {
    this.value = initialValue;
  }

  add(amount) {
    this.value += amount;
    return this;
  }

  subtract(amount) {
    this.value -= amount;
    return this;
  }

  multiply(factor) {
    this.value *= factor;
    return this;
  }

  getValue() {
    return this.value;
  }
}

const calculator = new Calculator(2);
console.log(calculator.add(3).multiply(4).subtract(5).getValue()); // 15
