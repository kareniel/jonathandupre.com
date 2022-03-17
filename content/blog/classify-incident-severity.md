---
title: How to classify incident severity
date: 2021-12-10
description: You need some kind of standard way to rate the severity of an incident.
---

The first set of controls in the [Canadian Baseline](7-organizational-controls) framework is to develop an incident response plan. This plan has a few different dimensions.

But first, it needs to account for incidents of varying severity. This implies that you need some kind of standard way to rate the severity of an incident. I have seen people struggling with this and honestly, the answer is to **keep it simple**.

5 levels of severity divided in 3 tiers:

**Tier 1. Go to red alert**

Impacts production.

- SEV1: Catastrophe. Most critical systems affected.
- SEV2: BIG problem. 1+ critical system affected.

**Tier 2. Go to yellow alert**

- SEV3: Significant issue. Could affect critical systems soon.
- SEV4: Definitely a problem. Stay vigilant.

**Tier 3. Informative.**

- SEV5: We can fix this later. Managed in bug tracker.

Remember that you want 100% of your staff to understand this completely. 
So keep it simple.
