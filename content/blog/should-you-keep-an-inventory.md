---
title: Should you keep an inventory?
date: 2021-12-15
---

The Quebec government had to take down over 3900 of their own websites this week. This is after the announcement that a widely used logging library patched a high severity vulnerability. 

The reason why they had to take them down is simple: the work involved in identifying the impacted systems is simply too much for the resources available.

That decision was a wise one. They compared the potential loss associated with keeping the sites up with the cost of taking them down and determined that it would be less expensive to take them down. 

It would have been very difficult to guess that this specific event would happen. This case doesn't even involve an actual loss event or an adversary. It would have been difficult to reduce the probability of this kind of event.

In this particular case, society at large is paying (eg. lawyers can't do their job without having access to some documents that are only available through government systems). Every day that these systems are down probably involves millions of dollars in wasted time, without even counting the cost of actually solving the issue.

However, had they had an up to date inventory of their system, the cost of mitigation could have been substantially lowered. With a proper inventory, they could have answered the question: "How many of our systems are affected?" and only taken down those. We would have collectively save millions of dollars. And yes, keeping an asset inventory is not free either. We make tradeoffs when we decide which security project to work on. 

This is one project though that always pays off in the end. How can you know you are deploying the right quantity of resources if you don't even know what you are protecting? 
