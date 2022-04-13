## Underhanded Solidity

The order of evaluation of sub-expressions. In Solidity, the order of evaluation of sub-expressions is unspecified. This may result in unexpected behavior.

### Bug Analysis

code is [here](./EvaluationOrderTrick.sol)

#### Bug-1

Documented in the Solidity [docs](https://docs.soliditylang.org/en/v0.8.7/control-structures.html?highlight=require#revert).

> The `require` function is evaluated just as any other function. This means that all arguments are evaluated before the function itself is executed. In particular, in `require(condition, f())` the function f is executed even if condition is true.

#### Bug-2

Credit - Underhanded Solidity Contest 2022 🥇 First Place: [Tynan Richards](https://blog.soliditylang.org/2022/04/09/announcing-the-underhanded-contest-winners-2022/#:~:text=%F0%9F%A5%87%20First%20Place%3A-,Tynan%20Richards,-commentary%20by%20Duncan)


> In Solidity, the order of evaluation of sub-expressions is unspecified. This means that in `f(g(), h())`, `g()` might get evaluated before `h()` or `h()` might get evaluated before `g()`. Practically, this order is predictable, but Solidity code shouldn’t depend on that behavior between compiler versions. In most circumstances `g()` is evaluated before `h()` (left-to-right order), which is also the behavior that most languages specify in their standards. However, in the case of emitting an event with indexed arguments, the arguments are evaluated right-to-left.

### References

[Announcing the Winners of the Underhanded Solidity Contest 2022](https://blog.soliditylang.org/2022/04/09/announcing-the-underhanded-contest-winners-2022/)
