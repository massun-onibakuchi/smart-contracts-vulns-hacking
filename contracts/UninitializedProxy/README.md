## UUPS Uninitialized Proxy

The two most popular proxy patterns are the Transparent proxy and the UUPS proxy.

the main difference between them is where the upgrade logic resides. In the Transparent proxy, the upgrade logic is in the proxy. In the UUPS pattern, the proxy delegates all calls to the implementation, which handles both the business logic and upgrade logic.

If a implementation contract was uninitialized after a deployment or upgrade. That means an attacker would be able to proceed with the upgrade.

### References

This post is covering what is UUPS proxy and how it works.

[Wormhole Uninitialized Proxy Bugfix Review](https://medium.com/immunefi/wormhole-uninitialized-proxy-bugfix-review-90250c41a43a)

[OpenZeppelin's UUPSUpgradeable Vulnerability Post-mortem](https://forum.openzeppelin.com/t/security-advisory-initialize-uups-implementation-contracts/15301)
