## Lack of chainID validation allows signatures to be re-used across forks:fyDai 

## ToB’s Audit of Yield Protocol
> implements the draft ERC 2612 via the ERC20Permit contract it inherits from. This allows a third party to transmit a signature from a token holder that modifies the ERC20 allowance for a particular user. These signatures used in calls to permit in ERC20Permit do not account for chain splits. The chainID is included in the domain separator. However, it is not updatable and not included in the signed data as part of the permit call. As a result, if the chain forks after deployment, the signed message may be considered valid on both forks. 

> Recommendation: Short term, include the chainID opcode in the permit schema. This will make replay attacks impossible in the event of a post-deployment hard fork. Long term, document and carefully review any signature schemas, including their robustness to replay on different wallets, contracts, and blockchains. Make sure users are aware of signing best practices and the danger of signing messages from untrusted sources.

> High Risk severity finding from [ToB’s Audit of Yield Protocol](https://github.com/trailofbits/publications/blob/master/reviews/YieldProtocol.pdf)

Code [YDai commit 4422fd ERC20Permit.sol](https://github.com/yieldprotocol/fyDai/blob/4422fda75931f2bfea49f5041ec90dc026e5c03d/contracts/helpers/ERC20Permit.sol#L30-L38)

### Exploit Scenario

Ref: ToB's Audit

### Note

`DOMAIN_SEPARATOR`にchainIdが含まれているが、`permit`の署名されるデータには`chainId`は含まれていない。そのため、[EIP-2612#Security Considerations](https://eips.ethereum.org/EIPS/eip-2612#security-considerations)で指摘されているように、`DOMAIN_SEPARATOR`が`permit`の呼び出し毎にコントラクトで作られずに、コントラクトのデプロイ時で固定されてしまうと、チェーンスプリットの時に両方のチェーンでその署名は有効になり、リプレイ攻撃される危険性がある。リプレイ攻撃を防ぐために、`DOMAIN_SEPARATOR`の`chainId`がchainのフォークに対応して同一の値にならないようにするか、`permit`のパラメータに`chainId`を含める。

YFI
そもそもchainIdが含まれている理由は、ネットワーク間での署名のリプレイ攻撃の防止であるが、今回のケースのようにコントラクトのデプロイ時に固定されてしまうとデプロイ後のフォークでのリプレイ攻撃を防ぐことはできない。パラメータの存在意義を考えれば当然であるだろう。

[Opezeppelin draft-ERC20Permit.sol](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/a9f994f063b3c119f6fafd74ea7e51a5b5f98545/contracts/token/ERC20/extensions/draft-ERC20Permit.sol#L54)は、署名ごとに`block.chainId`でchainIdを取得し、`domainSeparator`を計算する。

### Lesson
`chainid`は決して定数ではないので、定数としてみなさない。コントラクトのデプロイ後にチェーンのフォークで変わる可能性がある。

### Similar cases

[Golem - gnt2](https://github.com/golemfactory/gnt2/issues/138)
