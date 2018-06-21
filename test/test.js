const assert = require('assert')
const chai = require('chai')

chai.should()

const fs = require('fs')
const mockData = JSON.parse(fs.readFileSync('./test/mock-data.json'))

const QueueService = require('../matchmaker/QueueService')
const MatchmakingService = require('../matchmaker/MatchmakingService')
const MatchService = require('../matchmaker/MatchService')

describe('MatchmakingService', function() {
    let queueService
    let matchService
    let matchmakingService

    before(function() {
        queueService = new QueueService({ pool: mockData })
        matchService = new MatchService()
        matchmakingService = new MatchmakingService({
            queueService,
            matchService,
            tickRate: 0.01 // Tickrate of 10ms (1000 * 0.01)
        })
    })

    describe('constructor', function() {
        it('should accept queueService argument', function() {
            matchmakingService.should.have.property('queueService')
        })

        it('should accept matchService argument', function() {
            matchmakingService.should.have.property('matchService')
        })

        it('should start interval loop', function() {
            matchmakingService.startInterval()
            matchmakingService.loop.should.exist
            matchmakingService.stop()
        })

        it('should calculate MMR range', function() {
            for (var i = 1; i <= 60; i++) {
                const result = matchmakingService.calculateRange(i, Math.random() * matchmakingService.maxRating)
                result.should.have.property('min')
                result.should.have.property('max')
                result.min.should.not.be.NaN
                result.max.should.not.be.NaN
            }
        })

        it('should match pre-defined mock data players', function() {
            matchmakingService.startIterative()

            queueService.pool.length.should.equal(1)
            matchService.matches.length.should.equal(2)
            matchService.matches.forEach(function(match, index) {
                match.players.should.exist
                match.players.should.be.instanceof(Array)
                match.players[0].should.exist
                match.players[1].should.exist
            })
            matchmakingService.stop()
        })
    })
})
