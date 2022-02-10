import { GameController } from './gameController.js';
import { UiController } from './uiController.js';
import {Hero, Villain} from './person.js';

export class BattleGame {
    constructor() {
        this.gameController = new GameController();
        this.uiController = new UiController('.ui__wrapper', this.gameController);
        this.readInitialGameState();
    }

    init() {
        const startBattleButton = document.querySelector('#start-battle');
        startBattleButton.addEventListener('click', () => {
            this.gameController.startBattle(this.uiController.refreshTeams);
        });

        document.querySelector('#villainWins').innerHTML = localStorage.getItem('winnerVillain');
        document.querySelector('#heroWins').innerHTML = localStorage.getItem('winnerHero');
    }


    readInitialGameState(){
        let localHeroTeam = localStorage.getItem('teamHero');
        let localVillainTeam = localStorage.getItem('teamVillain');

        if (localHeroTeam !== null) {
            localHeroTeam = JSON.parse(localHeroTeam);
            localHeroTeam = localHeroTeam.map(hero => this.gameController.createCharacter(hero, 'teamHero'));
            this.gameController.heroTeam.push(...localHeroTeam);
        }

        if (localVillainTeam !== null) {
            localVillainTeam = JSON.parse(localVillainTeam);
            localVillainTeam = localVillainTeam.map(villain => this.gameController.createCharacter(villain, 'teamVillain'));
            this.gameController.villainTeam.push(...localVillainTeam);
        }

        this.uiController.refreshTeams(this.gameController.heroTeam, this.gameController.villainTeam);
    }
}
