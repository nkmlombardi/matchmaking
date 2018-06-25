# Matchmaking Service


## Scalability
[![Precursor](https://precursorapp.com/document/Matchmaking-Scalability-17592207367883.svg?auth-token=)](https://precursorapp.com/document/Matchmaking-Scalability-17592207367883)

This system would scale by implementing a keystore database (Redis) for storing queued players. This system would reach further scalability by sharding this keystore by MMR. Players would be placed in buckets, sorted by MMR. There would be a process running for each shard, searching for matches within the bucket, this would allow for parallel processing across the MMR range, and keeping the system from being single-threaded. If a player can't be matched within it's shard for a certain period of time, then it searches the shards around it for a match. This however, could create a race condition as the player could be matched in two shards at once. To alleviate this issue, a lock system could be put in place, where one matchmaking process can't attempt to match a player if another process is currently accessing the data. The size and number of the redis / MMR shards could be fine tuned to match the distrobution of players across the MMR spectrum to achieve maxium efficiency. In other words, there should be more, smaller shards in the middle area (2000-2500), than at the top of the MMR range (4000).
