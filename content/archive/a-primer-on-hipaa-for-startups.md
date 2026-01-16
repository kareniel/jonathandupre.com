---
title: A primer on HIPAA for startups
date: 2022-03-04
description: The Health Insurance Portability and Accountability Act was created to combat waste, fraud, and abuse in health insurance and health care delivery.
---

The Health Insurance Portability and Accountability Act was enacted in 1996 in the USA.
It amends the Internal Revenue Code of 1986, and was last updated in 2013.

It has many goals:

- Improve portability and continuity of health insurance coverage.
- Improve access to long-term care services and coverage.
- Simplify the administration of health insurance.
- Promote the use of medical savings accounts.

But the one of interest here is:

- Combat waste, fraud, and abuse in health insurance and health care delivery.

Title II is called "Preventing Health Care Fraud and Abuse". It intends to protect the security and privacy of Protected Health Information, or PHI. For that, it includes provisions (rules) for Privacy, Security, and Penalties.

This post won't cover the whole range of businesses that have to comply with the regulation. It's aimed at startups who's product design involves them using PHI.

## Who's responsible for what?

HIPAA is regulated by the USA Department of Health's Office for Civil Rights (OCR).

There is no official HIPAA certification. This means you can choose to self-assess or work with a third-party.

There are three roles modeled in the act:

1. **Covered Entities** - A health care provider who transmits any health information in electronic form. This would be users of your platform. 
2. **Business Associate** - An entity that provides services to, or performs certain functions involving the use or disclosure of PHI on your client's behalf. This is you, the apps you use, and your cloud service providers.
3. **Subcontractors** - An entity to whom a business associate delegates a function, activity, or service. 

A covered entity may be a business associate of another covered entity.

You and your clients have these responsibilities:

1. Provide records and compliance reports.
2. Cooperate with complaint investigations and compliance reviews.
3. Permit OCR to access anything required to help them figure out if you are compliant. This includes facilities, books, records, accounts, and other sources of information, including PHI.
4. Ensure you implement and maintain the systems needed to safeguard PHI

You and your subcontractors are liable for non-compliance with HIPAA.

## What are my responsibilities in case of a breach?

**TLDR:** You have to be aware that a breach occurred, and report it as soon as possible. Also, people can file a complaint against you, which the OCR can investigate as much as they want. Your clients also have obligations. It's in your best interest to educate them.

Your clients must provide notification of the breach to affected individuals, the Secretary, and, in certain circumstances, to the media.

You must notify your clients if you, or own of your suppliers have a data breach.

You must provide notice to clients within a reasonable delay and no later than 60 days from the discovery of the breach.

You must provide your clients with the identity of each user affected by the breach and any other available information they need in their own notification to affected people.

You have the burden of demonstrating that every required notifications has been provided or that a use or disclosure of unencrypted PHI did not constitute a breach.

You must maintain documentation that all required notifications were made, or documentation to demonstrate that notification was not required. 

You do that with one of:

1. A risk assessment demonstrating a low probability that the protected health information has been compromised by the impermissible use or disclosure.
2. The application of any other exceptions to the definition of "breach."

Your clients must have in place written policies and procedures regarding breach notification, they must train employees on these policies and procedures, and they must develop and apply appropriate sanctions against workforce members who do not comply with these policies and procedures.

You have 60 days to notify affected individuals, the OCR, and any other relevant people.

If your breach affects 500 or more people, OCR have a [breach portal](https://ocrportal.hhs.gov/ocr/breach/breach_report.jsf) where they are required to shame you publically for 24 months. At the time of writing this post, there are over 800 entries in that list.

A person who believes one of your clients or you are not complying with the rules, they can file a complaint with the OCR. 

An investigation can include a review of the policies, procedures, or practices of you or your clients, and of the circumstances regarding any alleged violation.


## What are the costs for non-compliance?

Violations can incur fines between $100 and $50,000. Fines can add up to a maximum amount of $25,000 in the best case, and $1.5M in the worst case.

Factors that are considered to determine the maximum amount include: 

- The number of individuals affected
- The time period during which the violation occurred
- The nature and extent of the harm resulting from the violation
- Your history of prior compliance 
- Your financial conditions

Which really comes down to asking the following questions:

1. Did you make a reasonable amount of effort?
2. Were you, or should've you been aware that a breach occured?
3. Was the breach a result of willful neglect?
4. Have attempts been made to correct the violation?


## What are we protecting?

Individually identifiable health information.

The transactions included in the regulation might give you some insight into where to look for PHI.

1. Health care claims or equivalent encounter information.
2. Health care payment and remittance advice.
3. Coordination of insurance benefits.
4. Health care claim status.
5. Enrollment and disenrollment in a health plan.
6. Verification of eligibility for a health plan.
7. Health plan premium payments.
8. Referral certification and authorization.
9. First report of injury.
10. Health claims attachment uploads.
11. Health care electronic funds transfers (EFT) and remittance advice.
12. **Other transactions that the OCR may prescribe by regulation.**

> The transmission of information between two parties to carry out financial or administrative activities related to health care.

## What are the Security and Privacy requirements?

You are responsible to ensure the confidentiality, integrity, and availability of all PHI you or your clients create, receive, maintain, or transmit.

You must protect it against any anticipated dangers to its security or integrity.

You must protect it against any anticipated uses or disclosures that are not permitted or required.

You must ensure compliance with these requirements by your workforce.

In deciding which security measures to use must take into account the following
factors:

1. Size, complexity, and capabilities 
2. Technical infrastructure, hardware, and software security capabilities
3. The costs of security measures
4. Probability and criticality of potential risks to PHI

> Individually identifiable health information should be protected with reasonable administrative, technical, and physical safeguards to ensure its confidentiality, integrity, and availability and to prevent unauthorized or inappropriate access, use, or disclosure.

The safeguards described in the regulation text look like what you would expect from a standard security management system. They have three categories: administrative, physical, and technical. 

The [HITRUST](https://hitrustalliance.net) framework provides mapping from these controls to other frameworks like NIST and ISO27K1.

## More information

Most of the information in this post comes from the [Combined Regulation Text](https://www.hhs.gov/hipaa/for-professionals/privacy/laws-regulations/combined-regulation-text/index.html) of all the regulatory standards.

You can also read the [Health Insurance Portability and Accountability Act of 1996](https://aspe.hhs.gov/reports/health-insurance-portability-accountability-act-1996) on the U.S. Department of Health's website.
