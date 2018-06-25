const assert = require('assert')
const chai = require('chai')

chai.should()

const fs = require('fs')
const mockData = JSON.parse(fs.readFileSync('./test/mock-data.json'))

const QueueService = require('../matchmaker/QueueService')

describe('QueueService', function() {
    let queueService
    let emptyQueueService

    before(function() {
        queueService = new QueueService({ pool: mockData })
        emptyQueueService = new QueueService({})
    })

    describe('constructor', function() {
        it('should accept queueService argument', function() {
            queueService.should.have.property('pool')
            queueService.pool.length.should.not.equal(0)
        })

        it('should be able to add a player', function() {
            emptyQueueService.addPlayer(mockData[0])
            emptyQueueService.pool.length.should.not.equal(0)
        })

        it('should be able to delete a player', function() {
            emptyQueueService.deletePlayer(emptyQueueService.pool[0])
            emptyQueueService.pool.length.should.equal(0)
        })
    })
})
