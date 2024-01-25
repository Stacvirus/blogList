const {reverse} = require('../utils/for_testing')

test('reverse of a', () =>{
    const result = reverse('a')
    expect(result).toBe('a')
})

test('reverse of react', () =>{
    const result = reverse('react')
    expect(result).toBe('react')
})

test('reverse of reveleler', () =>{
    const result = reverse('reveleler')
    expect(result).toBe('reveleler')
})

test('palindrome of react', () =>{
    const result = reverse('react')
    expect(result).toBe('react')
})