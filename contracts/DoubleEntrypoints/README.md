## Double Entry-points token

### Minimal example of exploit

type:

```bash
FORK=true BLOCK_NUMBER=14850000 yarn test test/DoubleEntrypoints.test.ts
```

### Lesson

**Token may have multiple entry-points.**
**Do not assume token has a single entry-point.**

In many cases proxy pattern is relevant.

> `Proxy Pattern:` This, in the context of ERC20 tokens, is a token composed of two parts: a proxy and a target.

#### Double Entry-Point ERC20 Token:

This is an ERC20 with a Proxy Architecture Pattern that allows users (and contracts) to interact directly with the target contract, skipping the proxy. Since it is possible to interact with both the proxy and the target directly, the token has two entry-points.

`TUSD`, `Synthetix` (`SNX`, `sBTC`...)

- [SNX - ProxyERC20 (Proxy)](https://etherscan.io/address/0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f#code)
- [SNX - Synthetix (Logic)](https://etherscan.io/address/0x7f30336e0e01bee8dd1c641bd793400f82d080cf#code)

In SNX case, actually `ProxyERC20` proxies calls without `delegatecall`.

### References

[Compound-TUSD Integration Issue Retrospective](https://blog.openzeppelin.com/compound-tusd-integration-issue-retrospective/)

[Balancer - Medium Severity Bug Found](https://forum.balancer.fi/t/medium-severity-bug-found/3161)
