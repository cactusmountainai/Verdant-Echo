import { Calculator } from '../src/calculator';

describe('Calculator', () => {
  let calculator: Calculator;

  beforeEach(() => {
    calculator = new Calculator();
  });

  describe('add', () => {
    it('should add two positive numbers correctly', () => {
      expect(calculator.add(2, 3)).toBe(5);
    });

    it('should add negative and positive numbers correctly', () => {
      expect(calculator.add(-1, 1)).toBe(0);
    });

    it('should add two negative numbers correctly', () => {
      expect(calculator.add(-2, -3)).toBe(-5);
    });

    it('should throw error if first argument is not a number', () => {
      expect(() => calculator.add('a' as any, 2)).toThrow('Both arguments must be numbers');
    });

    it('should throw error if second argument is not a number', () => {
      expect(() => calculator.add(2, 'b' as any)).toThrow('Both arguments must be numbers');
    });
  });

  describe('subtract', () => {
    it('should subtract two numbers correctly', () => {
      expect(calculator.subtract(5, 3)).toBe(2);
    });

    it('should handle negative results', () => {
      expect(calculator.subtract(2, 5)).toBe(-3);
    });

    it('should throw error if arguments are not numbers', () => {
      expect(() => calculator.subtract(1, 'a' as any)).toThrow('Both arguments must be numbers');
    });
  });

  describe('multiply', () => {
    it('should multiply two positive numbers correctly', () => {
      expect(calculator.multiply(4, 5)).toBe(20);
    });

    it('should multiply by zero', () => {
      expect(calculator.multiply(5, 0)).toBe(0);
    });

    it('should handle negative numbers', () => {
      expect(calculator.multiply(-3, 4)).toBe(-12);
    });

    it('should throw error on invalid types', () => {
      expect(() => calculator.multiply(null as any, 2)).toThrow('Both arguments must be numbers');
    });
  });

  describe('divide', () => {
    it('should divide two numbers correctly', () => {
      expect(calculator.divide(10, 2)).toBe(5);
    });

    it('should handle decimal results', () => {
      expect(calculator.divide(7, 2)).toBe(3.5);
    });

    it('should throw error when dividing by zero', () => {
      expect(() => calculator.divide(5, 0)).toThrow('Cannot divide by zero');
    });

    it('should throw error on non-number inputs', () => {
      expect(() => calculator.divide(10, 'a' as any)).toThrow('Both arguments must be numbers');
    });
  });

  describe('power', () => {
    it('should raise base to exponent correctly', () => {
      expect(calculator.power(2, 3)).toBe(8);
    });

    it('should handle exponent of zero', () => {
      expect(calculator.power(5, 0)).toBe(1);
    });

    it('should handle negative exponents', () => {
      expect(calculator.power(2, -2)).toBe(0.25);
    });

    it('should throw error on invalid types', () => {
      expect(() => calculator.power('a' as any, 2)).toThrow('Both arguments must be numbers');
    });
  });
});
