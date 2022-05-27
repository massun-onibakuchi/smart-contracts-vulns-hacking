## Phantom functions

#### Minimal example of vulnerability

Type:

```bash
yarn test test/WrappedERC20.test.ts
```

### Lesson

[Rari Capital - Solcurity](https://github.com/Rari-Capital/solcurity#code)

> `X8` - If you are calling a particular function, do not assume that `success` implies that the function exists (phantom functions).
> If the protocol is complex, wrapping ETH to WETH is worth considering.

### References

[AnySwap/Multichain Vulnerability](https://media.dedaub.com/phantom-functions-and-the-billion-dollar-no-op-c56f062ae49f)
