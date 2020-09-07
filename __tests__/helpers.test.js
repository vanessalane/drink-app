const {if_eq, format_date, format_plural} = require('../utils/helpers');

test('if_eq() returns true if strictly equal', () => {  
    expect(if_eq(1, 1)).toBe(true);
});

test('if_eq() returns true if strictly equal', () => {  
    expect(if_eq("1", "1")).toBe(true);
});

test('if_eq() returns false if unequal', () => {  
    expect(if_eq(1, 2)).toBe(false);
});

test('if_eq() returns false if unequal', () => {  
    expect(if_eq("hello", "goodbye")).toBe(false);
});

test('if_eq() returns false if abstractly unequal', () => {  
    expect(if_eq(1, "1")).toBe(false);
});

test('format_date() returns a date string', () => {
    const date = new Date('2020-03-20 16:12:03');
  
    expect(format_date(date)).toBe('March 20th, 2020');
});

test('format_plural() returns a plural string if passed 2', () => {
    expect(format_plural('word', 2)).toBe('words');
})

test('format_plural() returns a singular string if passed 1', () => {
    expect(format_plural('word', 1)).toBe('word');
})