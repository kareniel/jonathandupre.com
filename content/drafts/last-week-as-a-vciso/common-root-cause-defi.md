# Bugs only account for half of your information risk

Most security bugs in smart contracts end up with a similar impact: you can abuse them to withdraw or destroy tokens that are not yours.

Some of the more common bugs involved in major crypto security incidents include:

1. **Re-entrancy**: May allow you to drain funds from a contract by invoking a function as many times as you want.
2. **Unprotected function**: May allow you to drain funds from a contract or make it self-destruct by using a public function.
3. **Insufficient checks/validation**: May let you drain funds from a contract by calling functions you shouldn't be allowed to.
4. **Error in reward calculation logic**: May let you make unfair swaps by abusing a logical error.
5. **Integer overflow/underflow**: May let make unfair swaps by turning a small number into a bigger one and the other way around.

Security budgets often go to smart contract audits, but it's not just bugs in the software that you want to find. You also want to find bugs in the economic design, the configuration, and the operations of your crypto sytem. 

In 2021, 40% of incidents involving loss of funds involved one or more of the following events:

1. **Price manipulation with flash loans**: Flash loans allow you to borrow large sums of money as long as you repay it before the end of the transaction. Attackers use these to abuse economic design flaws.
2. **Abuse of a misconfiguration**: Smart contract, like other software, receives a configuration when it's deployed. IT operational mistakes lead to misconfigurations. Attackers abuse these misconfigurations to steal or destroy tokens.
3. **Private key compromise**: Attackers steal private keys. Access to these keys gives them to ability to steal or destroy funds. Vectors include spearphishing. This is an operational security concern. 

Smart contract audits don't cover all information risk. Security teams should spend at least a quarter of their budget to review cryptoeconomic system design, secure IT operations (DevSecOps), and operational security.
