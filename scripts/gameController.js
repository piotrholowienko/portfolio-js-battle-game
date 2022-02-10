import { Hero, Person, Villain } from './person.js';
import { getRandomNumberBetween } from './main.js';

function isTeamAlive(team) {
    let teamIsAlive = false;
    for (const element of team) {
        if (element.isAlive()) {
            teamIsAlive = true;
        }
    }
    return teamIsAlive;
}

function setBattleResultToLocalStorage(teamKey) {
    const teamItem = localStorage.getItem(teamKey);
    if (teamItem !== null) {
        localStorage.setItem(teamKey, parseInt(teamItem) + 1);
    } else {
        localStorage.setItem(teamKey, 1);
    }
}

export function addCharacterToLocalStorage(characterTeam, character) {
    const teamItem = localStorage.getItem(characterTeam);
    if (teamItem === null) {
        localStorage.setItem(characterTeam, JSON.stringify([character]));
    } else {
        const parseItem = JSON.parse(teamItem);
        parseItem.push(character);
        localStorage.setItem(characterTeam, JSON.stringify(parseItem));
    }
}


export class GameController {
    constructor() {
        this.heroTeam = [];
        this.villainTeam = [];
    }

    startBattle = async (refreshCallback) => {
        while (isTeamAlive(this.heroTeam) && isTeamAlive(this.villainTeam)) {
            const attackerTeam = Math.random() < 0.5 ? this.heroTeam : this.villainTeam;
            const defenderTeam = attackerTeam.find(person => person instanceof Hero) !== undefined ? this.villainTeam : this.heroTeam;
            const attackerIndex = getRandomNumberBetween(0, attackerTeam.length - 1);
            const defenderIndex = getRandomNumberBetween(0, defenderTeam.length - 1);

            this.duel(attackerTeam[attackerIndex], defenderTeam[defenderIndex], attackerTeam, defenderTeam, attackerIndex, defenderIndex);
            refreshCallback(this.heroTeam, this.villainTeam);

            await timeout(100);
        }

        const teamKey = this.heroTeam.length < 1 ? 'winnerVillain' : 'winnerHero';

        setBattleResultToLocalStorage(teamKey);

        document.querySelector('#villainWins').innerHTML = localStorage.getItem('winnerVillain');
        document.querySelector('#heroWins').innerHTML = localStorage.getItem('winnerHero');

        console.log('END', this.heroTeam, this.villainTeam);
    };

    duel(attacker, defender, attackerTeam, defenderTeam, attackerIndex, defenderIndex) {
        if (!(attacker instanceof Person) || !(defender instanceof Person)) {
            console.log('Attacker or defender are not instance of Person Class');
            return;
        }

        attacker.attack(defender, getRandomNumberBetween(10, 25));

        if (!defender.isAlive()) {
            defenderTeam.splice(defenderIndex, 1);
        }

        if (!isTeamAlive(defenderTeam)) {
            return;
        }

        defender.attack(attacker, getRandomNumberBetween(10, 25));
        if (!attacker.isAlive()) {
            attackerTeam.splice(attackerIndex, 1);
        }

    }

    createCharacter = (characterData, characterTeam) => {
        const character = characterTeam === 'teamHero' ? new Hero(characterData.hitPoints) : new Villain(characterData.hitPoints);
        character.name = characterData.name;
        character.strength = characterData.strength;
        character.weapon = characterData.weapon;
        character.picture = characterData.picture;
        return character;
    };
}

const timeout = async time => await new Promise(resolve => setTimeout(resolve, time));
