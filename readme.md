# Vara
`0xE1da44C0dA55B075aE8E2e4b6986AdC76Ac77d73`

---

Main protocol token, used to pay rewards.
This is the token that is accepted to be locked in the veNFT.

# GaugeFactory
`0xa337E9426d080970b026caFfb4a83D185b85A124`

---

Used to correctly create gauges contracts.

As gauges need a list of specific parameters, the factory should
be used to build this gauges correctly.

This contract is used by `Voter` contract to build gauges for gauges.

# BribeFactory
`0x7B14b7288D50810a6982149B107238065AA7fcb7`

---

Used to correctly create bribe contracts.

As bribes need a list of specific parameters, the factory should
be used to build this bribes correctly.

This contract is used by `Voter` contract to build bribes for gauges.

# PairFactory
`0xA138FAFc30f6Ec6980aAd22656F2F11C38B56a95`

---

Used to correctly create pair contracts.

This contract is used by Router/Router2 to create pair/pools contracts.

After pair pools contracts are created the router can deposit or swap
on pools.

Also, PairFactory contains the fees and a list of available pools to query.

# Router
`0x1bE24971f67F7f3E02E43F3Fb167EA55Cdc072C1`

---

Used to swap tokens from pools.

This is the original contract that does not support tokens with fee on transfer.

# Router2
`0xA7544C409d772944017BB95B99484B6E0d7B6388`

---

Used to swap tokens from pools.

This version support tokens with fee on transfer, and it is used in the app.

# VaraLibrary
`0xFDEd8097db44B6cE7d5a2c9228f2A9f46ad66fb8`

---

Math library internally used by Router calculations.

# VeArtProxy
`0x553796D20BB387E9b3F91Aa35fD289B753D63baF`

---

Used by veNFT to build the SVG image with token balance info
returned by tokenURI.

# VotingEscrow
`0x35361C9c2a324F5FB8f3aed2d7bA91CE1410893A`

---

This is the veNFT contract, an ERC721 contract that hold 
Vara tokens and provide the NFT with the lock.

The veNFT info is used in gauges/bribe system to pay user rewards.

# RewardsDistributor
`0x8825be873e6578F1703628281600d5887C41C55A`

---

This is an internal contract used by `Minter` contract that distribute
`Vara` rewards. 

# Voter
    `0x4eB2B9768da9Ea26E3aBe605c9040bC12F236a59`

---

Contract responsible to manage gauges and allow users to vote/reset
on gauges by nft id.

# WrappedExternalBribeFactory
`0x8af2f4Ae1DA95556fC1DaC3A74Cbf2E05e7006ab`

---

Used to create a wrapped external bribe contract. After the external bribe
fix, this don't need to be used anymore, but maybe used in the ui to avoid
breaking the app.

# Minter
`0x46a88F88584c9d4751dB36DA9127F12E4DCAD6B8`

---

The contract responsible for minting epoch Vara tokens to be distributed
during the epoch.

# VaraGovernor
`0xF5D177143C5C4705C59DedeA1B23B9d20488371C`

---

Can be used to create proposal and votes, like vote to whitelist a
new token to create a Gauge for example.

# MerkleClaim
`0xa77B82fDe72737EA659108f0fB10996CD3BE2987`

---

Used during the airdrop to allow users to claim airdrops from collected
wallet data.
