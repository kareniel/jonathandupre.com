---
title: Composing faulty assumptions
date: 2022-02-25
description: Standards facilitate interoperability between systems. But sometimes you need to verify that third-parties are respecting the standard you expect.
---

Standards facilitate interoperability between systems. 

But sometimes you need to verify that third-parties are respecting the standard you expect. Or someone might abuse your faulty assumptions. You will expect things to go one way, until the whole world goes upside down.

For example, in [the 2020 Balancer hack](https://blog.1inch.io/balancer-hack-2020-a8f7131c980e), the Balancer smart contracts didn't have any bugs. It was assumed in the design that tokens in liquidity pools followed the ERC20 standard. But tokens with different characteristics ended up in there. There goes  $500K. 

If the assumption supports security properties, confirm that it holds true before leaning on it.
