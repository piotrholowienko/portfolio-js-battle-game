export  class Person {
    constructor(hitPoints = 0, strength = 0) {
        this.id = `_` + Math.random().toString(36).substr(2, 9);
        this.name = '';
        this.hitPoints = hitPoints;
        this.strength= strength;
        this.htmlWrapper = null;
        this.maxHitPoints = hitPoints;

    }

    isAlive() {
        return this.hitPoints > 0;
    }

    setHitPoints(hp = 0) {
        this.hitPoints = hp > 0 ? hp : 0;


    }

    attack(target, power) {
        const damageFactor = Math.round(this.strength * 0.2);
        const damage = target.hitPoints - (power + damageFactor);
        target.setHitPoints(damage);

    }
}

export class Hero extends Person {
    constructor(hitPoints, strength) {
        super(hitPoints);
        this.strength= strength
    }
}

export class Villain extends Person {
    constructor(hitPoints, strength) {
        super(hitPoints);
        this.strength = strength
    }
}

