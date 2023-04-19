import Phaser from 'phaser';
import gameOptions from '../helper/gameOptions';
import {GameData} from '../helper/interfaces';

// "How To Play" scene: Scene where the game is explained
export default class HowtoScene extends Phaser.Scene {

    private gameData!: GameData;

    // Constructor
    constructor() {
        super({
            key: 'Howto'
        });
    }

    // Initialize parameters
    init(): void {

    }

    // Shows the all objects of this scene
    create(): void {

        // Add title
        this.add.text(gameOptions.gameWidth / 2, gameOptions.gameHeight * 0.2, 'Estimate', gameOptions.textStyles[0]).setOrigin(0.5, 0.5);

        // Add buttons
        this.addButtons();

    }

    // Add buttons including controls
    addButtons() {

        // button to show the overview
        // const buttonOverview = this.add.text(gameOptions.gameWidth / 2, gameOptions.gameHeight * 0.6,
        //     'Show Level', gameOptions.textStyles[1]);
        // buttonOverview.setOrigin(0.5, 0.5);                                                                     // set positon
        // buttonOverview.on('pointerdown', function(this: EstimateScene) { this.showOverview() }, this);      // add touch control

    }


    // Start game
    startFly() {

        this.gameData.time = 100;           // TODO: Change the time! It is now hardcoded

        this.scene.start('Game', this.gameData);        // start first estimation scene with 0 points

    }

    // Start How To Play
    showOverview() {

        this.scene.start('Overview');      // start "How to Play" scene

    }

}