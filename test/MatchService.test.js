const assert = require('assert')
const chai = require('chai')

chai.should()

const fs = require('fs')
const mockData = JSON.parse(fs.readFileSync('./test/mock-data.json'))

const MatchService = require('../matchmaker/MatchService')

describe('MatchService', function() {
    let matchService

    before(function() {
        matchService = new MatchService({})
    })

    describe('constructor', function() {
        it('should be able to add a match', function() {
            matchService.addMatch([mockData[0], mockData[1]])
            matchService.matches.length.should.not.equal(0)
        })
    })
})
