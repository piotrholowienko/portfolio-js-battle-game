import { BattleGame } from './battleGame.js';

export function getRandomNumberBetween(min, max) {
    return Math.floor(Math.random() * (max - min * 1) + min);
}

const game = new BattleGame();
game.init();