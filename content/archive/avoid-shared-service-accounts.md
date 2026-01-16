---
title: Avoid shared service accounts
date: 2022-06-07
description: Keep a record of who did what. Your security alerts will become more relevant and incidents will be easier to investigate.
---

Non-repudiation means you can't disprove that someone did something. 

When investigating a security incident, access logs help you understand what happened when, and who did what. The moment that two agents (a user or an application) share an identity, you lose the non-repudiation property.

When reviewing access permissions, look for shared identities. The easiest way to find out if an identity is shared is if two people share a password. 

Chances are that your environment has a shared admin account and a few shared service accounts. Ideally, you should avoid sharing credentials. But sometimes it's a necessary evil. 

If you can't, make sure that your system keeps a record of who did what. Your security alerts will become more relevant and your incidents will be easier to investigate.
