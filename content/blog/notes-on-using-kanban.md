---
title: Notes on using Kanban 
date: 2022-01-27
description: This is a quick guide on using Kanban for security projects to help you reduce wasted time and effort.
---

I have used Kanban to manage infrastructure that supports hundreds of thousands of users. I chose this approach over Scrum/Agile, because the volume of unplanned work made sprint planning ineffective.

This is a quick guide on using Kanban for security projects done solo or with small teams.

You might recognize the ideas from the Phoenix Project. The following reflects what I learned from applying them in real life.

## Start with a simple Kanban tool
You're gonna need a tool that lets you visualize tasks as cards on a board divide into columns. Most project planning software have some way of representing tasks in this way.

If you are not already using a project management tool, start with Trello. 
It's a simple to understand web-based software with a free tier.

Divide the board into 5 columns: `backlog`, `next`, `doing`, `in review`, `done`. 

Dump every todo that comes your way in the `backlog` column. Schedule a moment at the beginning of each week to plan, and at the end of each week to review.

## Make your estimates in units of work session
Scrum planning usually involves story points. More traditional project management uses hours or days. 
I recommend standardizing the duration of work sessions. 25 to 45 minutes respects human limits.
Estimate work by counting how much work sessions you believe something will take.

## Chunk and categorize tasks
Every task should fall under one of four buckets:

1. **Business projects**: Work that benefits the bottom line in some way.
2. **Changes**: Work that involves operating your existing systems. Toil.
3. **Internal projects**: Work that involves reducing toil, by automating, integrating, or standardizing.
4. **Unplanned work**: Work that was not in your `backlog` at the beginning of the week. This includes incidents.

Add a category as soon as you create the task.
Break it down into smaller tasks until you estimate it possible to get it done in one work session.

## Pull a fixed number of tasks
Count how many tasks you got done last week. Use that number to determine how many tasks to pull from your `backlog`.

Tasks with an estimate and a category can move from the `backlog` to the `next` column.

## Limit the amount of work-in-progress
Insist on doing one thing at a time. Sometimes that won't be possible, so establish a limit on tasks you allow yourself to work on in parallel. Use the scheduled time at the end of your week to re-evaluate the limit you set. Try to keep that number low.

Tasks you are currently working on can go from the `next` to the `doing` column.

## Don't use a column for blocked items
Make sure blocking tasks stay visible.
Whenever you can't make progress on a task, tag it as blocked and leave it there.
Since it counts towards you work-in-progress limit, you will be clear on what is slowing you down.

## Remember to add management tasks
That time you spent planning ahead? That's also a task. Make sure you add it to your `backlog` and count it towards your work-in-progress limit. You need to schedule time to improve your workflow.

## Measure how right you were
Move complete items to the `in review` column.
Use the moment you schedule at the end of your week to review your estimates.
A task was supposed to take one working session but ending up taking 3. A project was meant to take 5 work sessions but you did it in 2. Consider why your estimate was off, take note of it, and leverage that insight in your next estimate. Improve your system week after week. 

By applying these ideas, you will find that you adapt better to changes in your environment. You will be able to accept incoming work without stressing out. You will save time planning and getting organized. You will drop the ball less often. You will be able to get clearer estimates of when it will be possible to deliver on any given project. And most of all, you will reduce [wasted time and efforts](lost-time-and-productivity-tax).
