## msg.value reused vulnerability
using `msg.value` in complex systems is hard. It’s a global variable that you can’t change and persists across delegate calls. 

### Lesson

[Rari Capital - Solcurity](https://github.com/Rari-Capital/solcurity#code)
> `C28` - Don't use `msg.value` in a loop.

> `C29` - Don't use `msg.value` if recursive delegatecalls are possible (like if the contract inherits `Multicall`/`Batchable`).

> `C30` - Don't assume `msg.sender` is always a relevant user.

If the protocol is complex, wrapping ETH to WETH is worth considering.

### Actual cases

SushiSwap Miso      
[Samczsun - Two Rights Might Make A Wrong](https://samczsun.com/two-rights-might-make-a-wrong/)

[Mudit Gupta's Blog - A peek inside the MISO war room – $350m incident response story](https://mudit.blog/miso-war-room/)

> The batch function works by making multiple DELEGATECALLs to itself (the Auction contract). An interesting aspect about DELEGATECALL is that they use the same global context as the parent call so every DELEGATECALL has the same msg.value that the parent call had.

[Opyn ETH Put exploit](https://medium.com/opyn/opyn-eth-put-exploit-post-mortem-1a009e3347a8)

### References

[Making Opyn SAFU — Secureum #6](https://secureum.substack.com/p/making-opyn-safu-secureum-6)

[Detecting MISO and Opyn’s msg.value reuse vulnerability with Slither](https://blog.trailofbits.com/2021/12/16/detecting-miso-and-opyns-msg-value-reuse-vulnerability-with-slither/)

[PeckShield - Opyn hacks root cause analysis](https://peckshield.medium.com/opyn-hacks-root-cause-analysis-c65f3fe249db)
