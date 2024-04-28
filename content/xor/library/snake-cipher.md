---
title: Snake cipher
date: 2024-04-27
description: Symmetric encryption algorithm
---

The snake cipher encrypts Tobaud encoded text.

Snake keys are 25-bit numbers.

### Encryption

1. Start with the left-most character, indexed 0
2. `XOR` the character with the key's character at that index
3. Do this for every character
4. Indices overflow

Example:
```
The "5ue2e" key encrypts "hello world" into "vpipj5bjmiz"

"hello world" is:
01000 00101 01100 01100 01111 00000 10111 01111 10001 01100 00100

"5ue2e" is: 
11110 10101 00101 11100 00101

Hence:
01000 ^ 11110 = 10110
00101 ^ 10101 = 10000
01100 ^ 00101 = 01001
01100 ^ 11100 = 10000
01111 ^ 00101 = 01010
00000 ^ 11110 = 11110
10111 ^ 10101 = 00010
01111 ^ 00101 = 01010
10001 ^ 11100 = 01101
01100 ^ 00101 = 01001
00100 ^ 11110 = 11010 ​

"vpipj5bjmiz" is 10110 10000 01001 10000 01010 11110 00010 01010 01101 01001 11010

```


### Key generation

The key generator is a 5-bit maximal-period Galois LFSR.

1. Set each bit according to a seed value
2. Shift right every untapped bit (Move 0 into 1, 1 into 2, 2 into 3, and 3 into 4)
3. `XOR` the tapped bits (4 and 1 into 0)
4. Repeat this 5 times

``` 
0  1  2  3  4
☐→☐ →☐→☐ →☐ 
↑  ↓        │
└──⊕───────┘

```
