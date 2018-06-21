module.exports = class PlayerQueue {
    constructor({ pool }) {
        this.pool = pool || []
    }

    addPlayer(player) {
        player.intervals = 1
        if (this.pool.indexOf(player) === -1) this.pool.push(player)
    }

    deletePlayer(player) {
        const index = this.pool.indexOf(player)
        this.pool.splice(index, 1)
    }
}
