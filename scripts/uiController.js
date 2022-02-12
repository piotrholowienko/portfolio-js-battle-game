import { getRandomNumberBetween } from "./main.js";
import { Hero, Villain } from "./person.js";
import { addCharacterToLocalStorage } from "./gameController.js";

export class UiController {
  constructor(uiWrapperHtmlClass, gameController) {
    this.uiWrapper = document.querySelector(uiWrapperHtmlClass);
    this.gameController = gameController;
    this.personTemporaryData = null;
    this.characterIds = [];

    this.nameInput = this.uiWrapper.querySelector("#name");
    this.weaponInput = this.uiWrapper.querySelector("#weapon");
    this.strengthInput = this.uiWrapper.querySelector("#strength");
    this.hpInput = this.uiWrapper.querySelector("#hitpoints");
    this.selectTeamInput = this.uiWrapper.querySelector("#default_select");

    this.nameRandomButton = this.uiWrapper.querySelector("#random-name");
    this.weaponRandomButton = this.uiWrapper.querySelector("#random-weapon");
    this.strengthRandomButton =
      this.uiWrapper.querySelector("#random-strength");
    this.hpRandomButton = this.uiWrapper.querySelector("#random-hitpoints");
    this.randomCharacterButton =
      this.uiWrapper.querySelector("#random-character");
    this.addCharacterButton = this.uiWrapper.querySelector("#add-character");

    this.initAllEventListeners();
  }

  initAllEventListeners = () => {
    this.nameRandomButton.addEventListener("click", () => {
      this.fillNameInput(charName[getRandomNumberBetween(0, 24)]);
      console.log("Random Name button click");
    });

    this.weaponRandomButton.addEventListener("click", () => {
      this.fillWeaponInput(charWeapon[getRandomNumberBetween(0, 24)]);
      console.log("Random weapon button click");
    });

    this.strengthRandomButton.addEventListener("click", () => {
      this.fillStrengthInput(getRandomNumberBetween(1, 10));
      console.log("Strength Name button click");
    });

    this.hpRandomButton.addEventListener("click", () => {
      this.fillHpInput(getRandomNumberBetween(50, 100));
      console.log("Random hp button click");
    });

    this.addCharacterButton.addEventListener("click", async () => {
      const newCharacterData = this.readInputs();
      this.addCharacter(newCharacterData.character);
      addCharacterToLocalStorage(
        newCharacterData.team,
        newCharacterData.character
      );
      await this.loadCharacterInputs();
      this.fillAllInputs();
    });
    this.randomCharacterButton.addEventListener("click", async () => {
      await this.loadCharacterInputs();
      this.fillAllInputs();
    });
  };

  fillHpInput = (newHpValue) => {
    if (typeof newHpValue !== "number") return;
    this.hpInput.value = newHpValue;
  };

  fillStrengthInput = (newStrengthValue) => {
    if (typeof newStrengthValue !== "number") return;
    this.strengthInput.value = newStrengthValue;
  };

  fillWeaponInput = (newWeaponInput) => {
    if (typeof newWeaponInput !== "string") return;
    this.weaponInput.value = newWeaponInput;
  };

  fillNameInput = (newNameInput) => {
    if (typeof newNameInput !== "string") return;
    this.nameInput.value = newNameInput;
  };

  randomTeam = () => {
    const teamValue = Math.random();
    if (teamValue < 0.5) {
      this.selectTeamInput.value = "teamHero";
    } else {
      this.selectTeamInput.value = "teamVillain";
    }
  };
  loadCharacterInputs = async () => {
    let characterIndex;
    do {
      characterIndex = getRandomNumberBetween(1, 827);
    } while (this.characterIds.includes(characterIndex));

    const response = await fetch(
      `https://rickandmortyapi.com/api/character/${characterIndex}`
    );

    if (response.status === 200) {
      console.log("Status 200! Success.");
      const data = await response.json();
      this.personTemporaryData = {
        name: data.name,
        image: data.image,
        id: data.id,
      };
    } else {
      console.log("Status is not 200! Fail.");
    }
  };

  fillAllInputs = () => {
    this.fillHpInput(getRandomNumberBetween(50, 100));
    this.fillStrengthInput(getRandomNumberBetween(1, 10));
    this.fillWeaponInput(charWeapon[getRandomNumberBetween(0, 24)]);
    if (this.personTemporaryData !== null) {
      this.fillNameInput(this.personTemporaryData.name);
    }
    this.randomTeam();
  };

  readInputs = () => {
    const characterName = this.nameInput.value.trim();
    const characterWeapon = this.weaponInput.value.trim();
    const characterStrength = this.strengthInput.value.trim();
    const characterHp = this.hpInput.value.trim();
    const characterTeam = this.selectTeamInput.value;
    if (
      characterName !== "" ||
      characterWeapon !== "" ||
      characterStrength !== "" ||
      characterHp !== "" ||
      characterTeam !== ""
    ) {
      return this.createCharacterAndAddToTeam(
        characterName,
        characterWeapon,
        characterStrength,
        characterHp,
        characterTeam
      );
    }
    console.log("Wrong input value");
  };

  createCharacterAndAddToTeam = (
    characterName,
    characterWeapon,
    characterStrength,
    characterHp,
    characterTeam
  ) => {
    const characterData = {
      hitPoints: characterHp,
      name: characterName,
      strength: characterStrength,
      weapon: characterWeapon,
      picture: this.personTemporaryData.image,
    };

    const character = this.gameController.createCharacter(
      characterData,
      characterTeam
    );
    characterTeam === "teamHero"
      ? this.gameController.heroTeam.push(character)
      : this.gameController.villainTeam.push(character);
    this.characterIds.push(this.personTemporaryData.id);

    return { character, team: characterTeam };
  };

  removeCharacterFromTeam = (character) => {
    const team = character instanceof Hero ? "teamHero" : "teamVillain";
    if (team === "teamHero") {
      this.gameController.heroTeam = this.gameController.heroTeam.filter(
        (hero) => {
          return hero.id !== character.id;
        }
      );
    } else {
      this.gameController.villainTeam = this.gameController.villainTeam.filter(
        (villain) => {
          return villain.id !== character.id;
        }
      );
    }

    this.refreshTeams(
      this.gameController.heroTeam,
      this.gameController.villainTeam
    );
  };

  addCharacter = (character) => {
    character.htmlWrapper = this.addCharacterToWorld(character);
    const deleteButton = character.htmlWrapper.querySelector("#delete-char");
    deleteButton.addEventListener("click", () =>
      this.removeCharacterFromTeam(character)
    );
  };

  addCharacterToWorld = (character) => {
    const characterTeam =
      character instanceof Hero ? "teamHero" : "teamVillain";
    const teamWrapperId =
      characterTeam === "teamHero" ? "#hero-team" : "#villain-team";
    const teamWrapper = document.querySelector(teamWrapperId);
    const characterWrapper = document.createElement("div");

    characterWrapper.classList.add("character", "nes-container");
    characterWrapper.innerHTML = `    
            <h2 class='name' id='char-name'>${character.name}</h2>
            <button type='button' class='delete-char' id='delete-char'>X</button>
            <div class='avatar__wrapper'>
                <img class='avatar' src='${
                  character.picture !== null
                    ? character.picture
                    : "https://rickandmortyapi.com/api/character/avatar/87.jpeg"
                }' alt='hero-avatar'>
            </div>
            <div class='details__wrapper'>
                <p>Weapon: <span class='nes-text is-warning'>${
                  character.weapon
                }</span></p>
                <p>Strength: <span class='nes-text is-success'>${
                  character.strength
                }</span></p>
                <p>HitPoints: <span class='nes-text is-error'>${
                  character.hitPoints
                }</span></p>
            </div>
            <progress class='nes-progress is-error' value='${
              character.hitPoints
            }' max='${character.maxHitPoints}'></progress>
        `;

    teamWrapper.appendChild(characterWrapper);
    return characterWrapper;
  };

  refreshTeams = (teamHero, teamVillain) => {
    document.querySelector("#hero-team").innerHTML = "";
    document.querySelector("#villain-team").innerHTML = "";
    console.log(teamHero);
    console.log(teamVillain);

    [...teamHero, ...teamVillain].forEach((character) => {
      this.addCharacter(character);
    });
  };
}

const charWeapon = [
  "Brooks",
  "Rachel",
  "Edwards",
  "Christopher",
  "Perez",
  "Thomas",
  "Baker",
  "Sara",
  "Moore",
  "Chris",
  "Bailey",
  "Roger",
  "Johnson",
  "Marilyn",
  "Thompson",
  "Anthony",
  "Evans",
  "Julie",
  "Hall",
  "Paula",
  "Phillips",
  "Annie",
  "Hernandez",
  "Dorothy",
  "Murphy",
];
