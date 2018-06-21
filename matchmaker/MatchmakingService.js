// import LogScale from 'log-scale'
const LogScale = require('log-scale')

module.exports = class MatchmakingService {
    constructor({ queueService, matchService, tickRate, maxIntervals = 60 }) {
        if (!queueService || !matchService) new Error('Missing dependent services from MatchMaking Service.')

        this.queueService = queueService
        this.matchService = matchService
        this.maxIntervals = maxIntervals
        this.maxRating = 4000
        this.minRating = 1
        this.tickRate = tickRate || 5 // seconds

        this.logScale = new LogScale(this.minRating, this.maxRating)
    }

    startInterval() {
        this.loop = setInterval(() => {
            this.match()
        }, this.tickRate * 1000)
    }

    startIterative() {
        let i = 0

        while (this.queueService.pool.length >= 0) {
            i++
            this.match()
            if (i >= 100) break
        }
    }

    stop() {
        clearInterval(this.loop)
    }

    calculateRange(interval, rating) {
        const pivot = this.logScale.linearToLogarithmic((interval * this.tickRate) / this.maxIntervals)

        return {
            min: Math.max(Math.min((rating - pivot), this.maxRating), this.minRating),
            max: Math.max(Math.min((rating + pivot), this.maxRating), this.minRating)
        }
    }

    match() {
        console.log('Searching for player match...')

        this.queueService.pool.forEach((maker, i) => {
            maker.intervals++
            const { min, max } = this.calculateRange(maker.intervals, maker.rating)

            console.log(`${maker.intervals} | ${maker.id}[${maker.rating}] searching within ${min}-${max} rating...`)

            this.queueService.pool.some((taker) => {
                if (maker.id === taker.id) return

                if (taker.rating >= min && taker.rating <= max) {
                    console.log(`Match found between ${maker.id}[${maker.rating}] and ${taker.id}[${taker.rating}]`)

                    // Remove maker from pool
                    this.queueService.pool.splice(i, 1)

                    // Taker index has changed, so find it, then remove from pool
                    const takerIndex = this.queueService.pool.findIndex((player) => player.id === taker.id)
                    this.queueService.pool.splice(takerIndex, 1)

                    this.matchService.addMatch([maker, taker])

                    // Return true to break out of loop
                    return true
                }
            })
        })

        console.log(`Search completed, ${this.queueService.pool.length} unmatched players remain.`)
    }
}
