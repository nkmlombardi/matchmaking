module.exports = class MatchService {
    constructor() {
        this.matches = []
    }

    addMatch(players) {
        this.matches.push({ players })
    }
}
