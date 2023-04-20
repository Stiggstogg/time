import Phaser from 'phaser';
import gameOptions from '../helper/gameOptions';

// "Overview" scene: Scene where you see the overview of the level
export default class OverviewScene extends Phaser.Scene {

    // Constructor
    constructor() {
        super({
            key: 'Overview'
        });
    }

    // Initialize parameters
    init(): void {

        // make this scene directly invisible when it is started (needs to be done like that as start / launch makes it visible again)
        this.scene.setVisible(false);

    }

    // Shows the all objects of this scene
    create(): void {

        // add background
        this.add.image(0, 0, 'background').setOrigin(0);

        // Add title
        this.add.text(gameOptions.gameWidth / 2, gameOptions.gameHeight * 0.2, 'Overview', gameOptions.textStyles[0]).setOrigin(0.5, 0.5);

        // Add buttons
        this.addButtons();

    }

    // Update function for the game loop.
    update(_time: number, _delta: number): void {       // remove underscore if time and delta is needed


    }


    // Add buttons including controls
    addButtons() {

        // button to back to the estimation scene
        const buttonBack = this.add.text(gameOptions.gameWidth / 2, gameOptions.gameHeight * 0.8,
            'Go back', gameOptions.textStyles[1]);
        buttonBack.setOrigin(0.5, 0.5);                                                                     // set position
        buttonBack.setInteractive();
        buttonBack.on('pointerdown', function(this: OverviewScene) { this.backToEstimate() }, this);      // add touch control

    }

    // Go back to the estimation scene
    backToEstimate() {

        this.scene.pause();
        this.scene.setVisible(false);
        this.scene.resume('Estimate');

    }

}