module.exports = class MatchService {
    constructor({ matches = [] }) {
        this.matches = matches
    }

    addMatch(players) {
        this.matches.push({ players })
    }
}
