## Metamorphic Contract

> A critical Ethereum security assumption is that smart contract code is immutable and therefore cannot be changed once it is deployed on the blockchain. In practice, some smart contracts can change – even after they’ve been deployed.

> when metamorphic bytecode executes, it copies code from some other on-chain location – in this case, from the Implementation Contract – into the Metamorphic Contract. As we talked about in the last section, since CREATE2 is deterministic – as long as the same sender, salt, and bytecode are used – then the Metamorphic Contract address stays the same no matter how many times these steps are repeated.

source: [A Tool for Detecting Metamorphic Smart Contracts](https://a16zcrypto.com/metamorphic-smart-contract-detector-tool/)

### References

[Metamorphosis Smart Contracts using CREATE2](https://ethereum-blockchain-developer.com/110-upgrade-smart-contracts/12-metamorphosis-create2/#overwriting-smart-contracts)

[A Tool for Detecting Metamorphic Smart Contracts](https://a16zcrypto.com/metamorphic-smart-contract-detector-tool/)

[0age's metamorphic](https://github.com/0age/metamorphic/tree/master/)
