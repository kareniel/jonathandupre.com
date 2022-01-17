---
title: Simple tricks for document control
date: 2022-01-17
---

One type of data that sometimes gets forgotten in software shops is the one found in office-suite documents such as spreadsheets and presentations. In order to control these you could get really intense with the red tape and have people fill forms all the time. But if one of your strengths is being nimble, you might not want to take that approach.

A simple way to approach this challenge is to enable the end-user as much as possible. 

1. Publish a document management policy that describes the different security levels a document can be labeled with and a scheme for document version control.
2. Create templates for each document type so that team members don't have to add more effort to their workload.
3. Progressively label old documents as you update them.
4. Assign ownership of directories where those documents reside to team managers. They will now be responsible for enforcing the document management policy inside that directory.
5. Add a clause that reflects this new responsibility to employment contracts for each of these roles. Make sure that both the manager and the person they report to sign this new change.

Security levels can be:

1. Secret (Red) - Consulted on a need to know basis. Access controlled. Encrypted in transit and at rest. Kept in a secrets data store.
2. Confidential (Orange) - Consulted on a need to know basis. Access controlled. Encrypted in transit and at rest.
3. Internal (Yellow) - Shared internally only. Access controlled if shared externally. Encrypted in transit.
4. Public (Green) - Sharing is encouraged.

Efforts should be made to move documents from orange to green as early as possible in an effort to reduce the volume of data to protect.

For versioning, you can use a simple scheme with two numbers, major and minor. Start with 0.1, incrementing the minor number every fix and incrementing the major number when something important changes.

**Remember to add cover pages to documents.** This is where you will be adding the most obvious and visible security labels. Modern apps like to show you a screenshot of documents and without a cover page you might expose sensitive information.
