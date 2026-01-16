---
title: Bitwise shift
date: 2024-05-11
description: 
---

I was trying to figure out which shift operator to include in the instruction set of my [10-bit stack machine](/xor).

I ended up going with logical shifts. In this post, I document why.


Shift operators have always been a bit of a mystery to me. 

So working on the design of this stack machine has helping me unpack some of it.


My machine uses 5-bit bytes, and only handles unsigned integers.

Which means we can count up to 32. So the value of each bit starting from left (the most significant bit) is 16, 8, 4, 2, and 1.


## First, let's look at logical shifts.

When you shift left by n bits, you multiply your number by 2^n.

This is easy to see if you start with a single bit. Every time you shift, you get the value of the bit's position.

```
00001 = 1
00010 = 2
00100 = 4
```

But that's only true UNTIL you lose your most significant bit (the leftmost one!).

```
01000=8
10000=16
00000=0
```

So we need another bit to account for this edge case.


One way to do this is to store the bit that gets shifted out in a register (often called Carry Flag). 

This lets you know that your integer overflowed, so you can do something about it (and not end up with a confusing result).


Okay, so with arithmetic shifts, we get multiplication and division by two, with a way to handle integer overflows.

But is that it?


We don't just store integers in memory. By working at the bit level, you can pack a lot of information in a byte.

And that's where logical shifts shine. 


For example, we can extract the 2nd through 4th bits of a byte by using a mask and then shifting the resulting byte to the right:

```
01110 <- mask
01010 <- data
00101 <- result
```


Without this, we'd be missing an important tool for bit manipulation.

## So what about circular shifts?


When you do a bitwise rotation, the bit that gets shifted out fills in the vacant bit position:

```
01000=8
10000=16
00001=1
```

That means you never lose the carry bit. You also don't do any padding. You just reshuffle your existing bits.


A good use-case example is crypto, where we want to keep the same input bits, but obscure the relationship between inputs and outputs. 

In other words, if you lose bits, you lose the message you're trying to encrypt or decrypt.


So what I'm realizing is that they are all very different operations.

Arithmetic shifts are useful for multiplication/division by factors of 2.
Logical shifts are useful for bit twiddling.
Bitwise rotations are useful for cryptography.


That's as far as I was willing to go at this point, so here's why I chose to include only logical shifts in my instruction set:


Since this a toy machine, I don't need signed integers. That makes arithmetic shifts irrelevant. 

I can implement circular shift in software, which might come with timing attack vulnerabilities. 


But that's okay, because the purpose of this toy machine is to explore vulnerabilities.

So that leaves us with logical shift.
