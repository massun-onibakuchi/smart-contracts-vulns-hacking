## Lack of Zero address check allows anyone to mint new MATIC tokens

## Polygon Bug Fix Postmortem

A critical vulnerability in Polygon on December 3 2021 reported by Whitehat Leon Spacewalker.

### Vulnerability Analysis

The one of the difference between Ether and MATIC is its standard. It is the native gas-paying asset of the Polygon network, but it is also a contract deployed on Polygon. This contract is the `MRC20` contract. You can check [here](https://polygonscan.com/address/0x0000000000000000000000000000000000001010).
The `MRC20` standard would be used mainly for the possibility of transferring MATIC gaslessly.

Gasless MATIC transfers are facilitated by the `transferWithSig()` function. It accepts a signature as parameters. and the contract extracts the token owner's address using a wrapper function of built-in `ecrecovery` . but its `ecrecover` returns zero address if a packed signature does not have length 65. This means we don’t need a valid signature to proceed with the attack.

```solidity
function transferWithSig(
  bytes calldata sig,
  uint256 amount,
  bytes32 data,
  uint256 expiration,
  address to
) external returns (address from);

```

About built-in `ecrecover` function, see `Note` section.

### Note

Bult-in `ecrecover` is a pre-compiled contract.

According to [Solidity doc](https://docs.soliditylang.org/en/v0.8.7/units-and-global-variables.html#mathematical-and-cryptographic-functions),

> recover the address associated with the public key from elliptic curve signature or **return zero on error**. The function parameters correspond to ECDSA values of the signature:

```
r = first 32 bytes of signature
s = second 32 bytes of signature
v = final 1 byte of signature
```

**If r, s, or v aren't correct length, it returns zero addresss.**

### Lesson

- `ecrecover`はエラー時にrevertせずにZero addressを返す。帰り値がzero addressでないことをチェックしろ。
- ビルトインの`ecrecover`を安全に使うことは、バグを避けるために暗号に関する深い知識が必要かもしれない。OpenZeppelin のライブライリの`ecrecover`の wrapper を使うことを推奨する。

### Exploit Scenario

You can check an article from immunefi for more information in [References](#references).
An exploit PoC is [here](../../test/Ecrecover.test.ts)

1. Create a byte string of length anything other than 65. Due to the check in `ecrecovery`, if a packed signature does not have length 65, it will return the zero address. This means we don’t need a valid signature to proceed with the attack.
2. `amount` passed to the function can be any amount, but we can use the full balance of the MRC20 contract
3. `to` address will be an attacker address
4. After `from` is recovered from the invalid signature (this is the zero address because we passed an invalid signature), `_transferFrom()` is called
5. As the balances are not checked for the `from` and `to`, contract makes a `_transfer()` call
6. `_transfer()` only checks if the recipient isn’t the MRC20 contract itself and transfers all the amount to the attacker from the MRC20 contract
   Enjoy the profit of all the MATIC tokens

### References

[Polygon Lack Of Balance Check Bugfix Postmortem — $2.2m Bounty](https://medium.com/immunefi/polygon-lack-of-balance-check-bugfix-postmortem-2-2m-bounty-64ec66c24c7d)

[Pre-compiled contracts In Geth code](https://github.com/ethereum/go-ethereum/blob/master/core/vm/contracts.go)
