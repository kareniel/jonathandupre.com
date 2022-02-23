---
title: Common DeFi vulnerabilities from 2021
date: 2022-02-23
description: I took a look at CertiK's "The State of DeFi Security 2021" this morning. I thought I'd share some insights.
---

Security audits for DeFi projects are in high demand. Having had your code audited is now a common criteria used by consummers to determine if they should engage with a project or not.

CertiK is one of the well-known blockchain security audit firms. I took a look at CertiK's report "The State of DeFi Security 2021" this morning. I thought I'd share some insights.

Centralization issues accounted for about 16% of their findings. These are security vulnerabilities introduced at the design stage, meaning that they can't be solved by "fixing" code. They're usually a result of contract developers including functions that give them some control over some aspect of the system.

Centralization issues lead to vulnerability to [attacks we were familiar with](blog/smart-contract-risk-is-not-your-only-risk) before web3, such as the theft of private keys.

Controls to compensate this kind of design decision include protecting privileged action with a timelock, using a multi-sig wallet, and delegating the authority to a DAO.

Timelocks delay privileged actions to give operators time to react to unexpected events. Assigning privileged roles to a multi-sig wallet reduces the risk that a private key compromise endangers the whole project. And delegating authority to a DAO distributes that authority over a group.

The report identifies 4 more commonly identified vulnerabilities:

1. Lack of event emission
2. Unlocked compiler version
3. Lack of proper input validation
4. Reliance on third-party dependencies

You can read the full report on [CertiK's website](https://certik-2.hubspotpagebuilder.com/the-state-of-defi-security-2021).
