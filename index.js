// import PlayerQueue from './matchmaker/PlayerQueue'
// import MatchmakingService from './matchmaker/MatchmakingService'

const fs = require('fs')

const mockData = JSON.parse(fs.readFileSync('./test/mock-data.json'))

const QueueService = require('./matchmaker/QueueService')
const MatchmakingService = require('./matchmaker/MatchmakingService')
const MatchService = require('./matchmaker/MatchService')

const queueService = new QueueService({ pool: mockData })
const matchService = new MatchService({})
const matchmakingService = new MatchmakingService({
    queueService,
    matchService,
    tickRate: 3
})

// Test MMR range calculation
// for (var i = 1; i <= 60; i++) {
//     console.log(matchmakingService.calculateRange(i, 2000))
// }

matchmakingService.startInterval()
