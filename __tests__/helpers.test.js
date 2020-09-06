const {format_plural} = require('../utils/helpers');

test('format_plural() returns a plural string if passed 2', () => {
    expect(format_plural('word', 2)).toBe('words');
})

test('format_plural() returns a singular string if passed 1', () => {
    expect(format_plural('word', 1)).toBe('word');
})