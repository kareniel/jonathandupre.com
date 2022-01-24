---
title: Getting started with an asset inventory
date: 2022-01-24
---

Do you have an asset inventory yet? If not, schedule some time to start one.
We have already establish [why you should](/blog/should-you-keep-an-inventory), so here are some tips to help you get started.

## Start with a spreadsheet 

There are many software tools you can use to manage your inventory. But when you're just getting started, deploying or registering for a new tool can add unwelcomed complexity. We are trying to reduce complexity.

This is why I recommend starting with a simple spreadsheet. Pick the software that your team has defaulted to, it doesn't really matter which. At this point, we want to make sure the work has started.

## Maintain a list of asset types

Give each item in your list a category.
At some point, you will start having a detailed enough inventory that you can start analyzing it and gain valuable insights.

Here is a list of asset types you can use to get you started:

**Organizations and people:**
1. Business partner
1. Supplier
1. Stakeholder
1. Employee

**Data:**
1. Secret (API keys, tokens, etc)
1. Private key
1. Configuration file
1. Source code
1. Regulated data
1. Customer data
1. Logs
1. Document
1. Data stream (Video, audio, etc)

**Systems:**
1. Cloud account
1. DNS server
1. Database
1. Endpoint (Server, desktop, laptop, phone)
1. OS
1. Network
1. Harware security module
1. Runtime
1. Web service
1. Tooling
1. IP address
1. Domain name

## Is it mission critical?

For every item in your list, ask yourself the question: "Is it mission critical?".
Maybe someone depends on this to do their work. Or maybe it supports the main service you provide.
How long would it take for someone to notice if it went down or was unavailable?
Identifying critical assets is crucial for your business continuity plan.

## How sensitive is it?

Your asset list will contain data and systems. Is that data confidential? Does the system contain or process confidential data? Just how confidential? To determine this you will need a classification system. I like to use a simple 4-tier: Secret, Confidential, Private, and Public.

You should use the same scheme that you use to [control documents](/blog/simple-tricks-for-document-control).

## Does it process private user information?

Privacy regulations like GDPR in the European Union make it mandatory to identify systems that process private user data. By being pro-active about this and adding this dimension to your inventory, you will avoid duplicating work in the future.

## Where is it documented?

Documentation of different systems and datasets can easily get out of hand. Use a column in your inventory to note where the documentation specific to each item can be found. I like to maintain a list of documents in a different tab and reference that tab in each row using "Data Validation" in Google Sheets.

## Assign ownership

Last but not least, make sure that you assign an owner for each of these assets. The owner will be responsible for making sure that your policies and procedures are being followed when it comes to that particular asset. This will ease the burden on whoever is responsible for managing IT by distributing the load accross different teams. It will also give you the assurance that every component in your system is looked after by at least one person. If possible, include this responsibility in each individual contributor's work contract.
