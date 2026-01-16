---
title: Junior cloud security engineer
date: 2024-02-19
description: If you are looking to get into an engineering role focused on defense in the cloud, this post is for you.
---

If you are looking to get into an engineering role focused on defense in the cloud, this post is for you.

If I was hiring a junior cloud security engineering tomorrow, here are 3 high-value projects that I would like to see in the candidate's portfolio.

If you don't understand what any of the vocabulary means, you might not be ready for the job yet. Study, read documentation, run experiments, until you understand every word. Then implement each project in the listed order.

For each project, document your approach to solving it, the lessons you learned while working on it, and what you would do differently next time. Publish a blog post on your website, and the code for what you built on GitHub.

The projects 👇

## Secure container cluster
Why? Running apps in containers is how it's done now. But devs don't want to have to think about the underlying platform.
How? Deploy a K8S cluster with a reverse proxy, an API backend app, a cache, and a database. Configure the cluster such that only the proxy is exposed to the internet, encrypting all traffic with TLS. Create a set of roles: an auditor that can verify the secure configuration, a sysadmin that can modify the cluster config, and a developer that can redeploy the app.

## Secure delivery pipeline
Why? One of the most common needs is to make it possible for developers to ship secure code faster.
How? Write a basic app, include 3 different types of bug, create a CI/CD pipeline for it, add code analysis jobs that use industry standard tooling to find the bugs,  add a job that outputs a helpful report so that devs can fix it. Bonus points if your solution can also run on dev laptops before they push their code.

## Automated response
Why? Tons of changes happen every day in cloud environments and there is no way to keep track of them all. Some of them should never happen in normal circumstances which means you can just automate the response.
How? Write 3 detection scripts. Each one should read audit logs, cross-reference information, and then take some kind of action. For example, if an admin signs in from a new IP address, send a Slack message to the team.

By building solutions that are relevant to the teams you will be working with, you will demonstrate that you understand what reality they live in, and that you are competent enough to be trusted with a project.
