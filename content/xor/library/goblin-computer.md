---
title: Goblin computer
date: 2024-05-11
description: 10-bit stack machine
---

The goblin computer is a 5-bit stack machine.

## Registers

The machine has two 2-byte registers: the instruction pointer (IP) and the stack pointer (SP).

It also has two 1-bit flag register: the carry flag (CF), and the divide error flag (DE).

## Data types

The machine supports 3 data types: pointers, unsigned integers, and booleans.

## Memory layout

Words are one byte long, and bytes are 5 bits.

The memory has 32 pages of 32 words each.

Code gets loaded at the beginning of memory, and the stack grows from the bottom up.

## Instruction set

| code| binary| operation | category | description |
| --- | ----- | ------ | ---------- |  -- |
| 00  | 00000 | nop   | -          | Nothing |
| 01  | 00001 | hlt   | i/o | Stops the execution |
| 02  | 00010 | in     | i/o | Read a byte from the input and push it on top of the stack |
| 03  | 00011 | out    | i/o | Pop the value on top of the stack and write it to output |
| 04  | 00100 | sv   | data       | Save data at destination address |
| 05  | 00101 | ld   | data       | Load data from source address to top of stack |
| 06  | 00110 | psh   | stack      | Pushes the next instruction to top of stack |
| 07  | 00111 | pop    | stack      | Pops the value on top of stack |
| 08  | 01000 | dup    | stack      | Duplicates the value on top of stack |
| 09  | 01001 | swp   | stack      | Swaps the two values on top of stack |
| 10  | 01010 | not    | bitwise    | Returns the bitwise NOT of the value on top of stack |
| 11  | 01011 | and    | bitwise    | Returns the bitwise AND of the two values on top of stack |
| 12  | 01100 | or     | bitwise    | Returns the bitwise OR of the two values on top of stack |
| 13  | 01101 | xor    | bitwise    | Returns the bitwise XOR of the two values on top of stack |
| 14  | 01110 | lsh    | bitwise    | Logical left shift of the value on top of stack |
| 15  | 01111 | rsh    | bitwise    | Logical right shift of the value on top of stack |
| 16  | 10000 | eq     | compare    | Returns 1 if the two values on top of stack are identical |
| 17  | 10001 | grt    | compare    | Returns 1 if the second value on top of stack is greater than the first |
| 18  | 10010 | lsr    | compare    | Returns 1 if the second value on top of stack is lesser than the first |
| 19  | 10011 | jmp   | control    | Jumps to the address on top of stack |
| 20  | 10100 | jnz   | control    | If the third value is not zero, jumps to the second, otherwise jumps to the first |
| 21  | 10101 | add    | arithmetic | Adds together the two values on top of stack |
| 22  | 10110 | sub    | arithmetic | Subtracts the first value from the second value |
| 23  | 10111 | mul    | arithmetic | Multiplies together the two values on top of stack |
| 24  | 11000 | div    | arithmetic | Divides the second value by the first |
| 25  | 11001 | mod    | arithmetic | Returns the remainder left after dividing the second by the first value |
| 26  | 11010 | -    | reserved | Reserved |
| 27  | 11011 | -    | reserved | Reserved |
| 28  | 11100 | -    | reserved | Reserved |
| 29  | 11101 | -    | reserved | Reserved |
| 30  | 11110 | -    | reserved | Reserved |
| 31  | 11111 | -    | reserved | Reserved |

## Exceptions

Division by zero returns zero and sets the divide error flag.

## Assembler

### Labels

You can use labels to implement functions or reserve memory locations. Refer to them by using `&`. Those will be replaced by a `push` operation.

Assembly:
```
main:
  noop

loop:
  &loop
  jump

```

Machine code:
```
0  # noop
3  # push
0  # 0
17 # jump
```

### Constant values

You can inline integers with `#` and [Tobaud encoded](/xor/library/tobaud-code) chars with `@`. Those will be replaced by a `push` operation.

Assembly:
```
one:
  #1

letter_a:
  @a
```

Machine code:
```
1 # 1
1 # a
```

### Pointers

You can dereference memory addresses by using `.`. Those will be replaced by a `load` operation.

Assembly:
```
thirty_one:
  #31

add_thirty_one:
  .thirty_one
  add

```

Machine code:
```
31 # 31
2  # load
0  # 0
19 # add
```
