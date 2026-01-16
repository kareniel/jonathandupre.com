---
title: How to manage vendor risk
date: 2022-06-08
description: By assuming that your vendor will get breached, you can make the decision to work with them without asking them anything, because you understand your own risk.
---

Using vendors to solve business problems forces you to make tradeoffs between security and productivity. Risk management is about making decisions with acceptable tradeoffs.

Before you send out a security questionnaire to a potential vendor, do a rapid risk assessment. This should not take more than 30-60 minutes. 

Identify what kind of data the vendor will have access to.

1. It could be secrets like encryption keys.
2. It could be user data, like emails, names and phone numbers.
3. It could be configuration information, like your firewall rules.

Identify how that data will flow between the two organizations.

  1. You might be sending them data on a regular interval.
  2. You might be creating data inside their solution.
  3. Your data might be synchronized between the two systems.
  4. They could have direct access to your own internal systems.

Consider what could go wrong if the vendor was compromised, and how bad it would be.

1. What happens if the data is disclosed to the world?
2. What happens if the data is incorrect?
3. What happens if the data is not available, lost, or deleted?

For each scenario, consider the negative consequences.

1. It could impact your company's reputation.
2. It could impact productivity.
3. It could cost money.

Imagine what you could do to mitigate that risk.

1. How can we reduce the access levels that the vendor has to a minimum?
2. What existing controls can we leverage to reduce the remaining risk?

What you should end up with is a list of scenarios (what could go wrong), and a set of solutions for each. You now know what kind of risk you might expose yourself to. 

By assuming that your vendor will get breached, you can make the decision to work with them without asking them anything, because you understand your own risk.

Once you've made that determination, what's left is to assess how likely the risk scenarios are to happen. 

Ask your vendor the following questions:

1. When was the last time your were breached?
2. Do you have security leadership?
3. Do you have a security program in place?

In the context of your risk analysis, the answers to these questions should determine how many more questions you'll want to ask. 

Their breach history will help you understand in what ways they were vulnerable before, and how they respond to events like these. Not having security leadership, or not having a security program in place should be a huge red flag if you want to share sensitive data with them. 

Notice that your risk assessment stays relevant even if you decide to not move ahead with a given vendor. 
