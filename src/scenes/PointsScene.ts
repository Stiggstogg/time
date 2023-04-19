import Phaser from 'phaser';
import gameOptions from '../helper/gameOptions';
import {GameData} from '../helper/interfaces';

// "Points" scene: Scene where the points you got in the last level are shown
export default class PointsScene extends Phaser.Scene {

    private gameData!: GameData;

    // Constructor
    constructor() {
        super({
            key: 'Points'
        });
    }

    // Initialize parameters
    init(): void {

    }

    // Shows the all objects of this scene
    create(): void {

        // Add title
        this.add.text(gameOptions.gameWidth / 2, gameOptions.gameHeight * 0.2, 'Points', gameOptions.textStyles[0]).setOrigin(0.5, 0.5);

        // Add buttons
        this.addButtons();

    }

    // Add buttons including controls
    addButtons() {

        // button to show the overview
        const buttonNext = this.add.text(gameOptions.gameWidth / 2, gameOptions.gameHeight * 0.6,
             'Continue', gameOptions.textStyles[1]);
        buttonNext.setOrigin(0.5, 0.5);                                                           // set position
        buttonNext.on('pointerdown', function(this: PointsScene) { this.next() }, this);      // add touch control

    }


    // Go to the next level or repeat the failed level
    next() {

        // TODO: Go back to menu when finished!

        if (this.gameData.successful) {
            this.scene.start('Game', this.gameData);        // go to the estimation scene of the next level TODO: increase level
        }
        else {
            this.scene.start('Game', this.gameData);        // go to the estimation scene of this level
        }

    }

}