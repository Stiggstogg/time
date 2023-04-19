import Phaser from 'phaser';
import gameOptions from '../helper/gameOptions';
import {GameData} from '../helper/interfaces';

// "Estimate" scene: Scene where you estimate your time
export default class EstimateScene extends Phaser.Scene {

    private gameData!: GameData;
    private numbers!: Phaser.GameObjects.Text[];

    // Constructor
    constructor() {
        super({
            key: 'Estimate'
        });
    }

    // Initialize parameters
    init(data: GameData): void {

        // get game data
        this.gameData = data;

        // initialize properties
        this.numbers = [];

    }

    // Shows the all objects of this scene
    create(): void {

        // Setup overview scene
        this.setupOverview();

        // Add title
        this.add.text(gameOptions.gameWidth / 2, gameOptions.gameHeight * 0.2, 'Estimate', gameOptions.textStyles[0]).setOrigin(0.5, 0.5);

        // add numbers
        this.addNumbers();

        // Add buttons
        this.addButtons();

    }

    // Update function for the game loop.
    update(_time: number, _delta: number): void {       // remove underscore if time and delta is needed

        console.log('Estimate is running!');

    }

    // Setup overview scene
    setupOverview() {

        this.scene.launch('Overview');                          // launch the overview scene
        this.scene.pause( 'Overview');                          // hide overview scene


    }

    // Add buttons including controls
    addButtons() {

        // button to show the overview
        const buttonOverview = this.add.text(gameOptions.gameWidth / 2, gameOptions.gameHeight * 0.8,
            'Show Level', gameOptions.textStyles[1]);
        buttonOverview.setOrigin(0.5, 0.5)                                  // set position
        buttonOverview.setInteractive();                                      // make interactive
        buttonOverview.on('pointerdown', this.showOverview, this);      // add touch control


        // button to start flying
        const buttonFly = this.add.text(gameOptions.gameWidth / 2, gameOptions.gameHeight * 0.9,
            'Let\'s GO!', gameOptions.textStyles[1]);
        buttonFly.setOrigin(0.5, 0.5);                                  // set position
        buttonFly.setInteractive();                                         // make interactive
        buttonFly.on('pointerdown', this.startFly, this);               // add touch control

    }

    // add the numbers
    addNumbers() {

        const startTime = [1, 0 , 0];

        for (let i = 0; i < startTime.length; i++) {

            this.numbers.push(this.add.text(
                gameOptions.gameWidth * (0.3 + i * 0.2), gameOptions.gameHeight * 0.5,
                startTime[i].toString(), gameOptions.textStyles[1]).setOrigin(0.5, 0.5));

        }

    }

    // Start game
    startFly() {

        this.scene.stop('Overview');        // stop the overview scene (which is currently paused)

        // TODO: Change currently everything is hardcoded
        this.gameData.time = 100;
        this.gameData.expectedPoints = 1000;

        this.scene.start('Game', this.gameData);        // start first estimation scene with 0 points

    }

    // Show the overview while maintaining the estimation scene in the background
    showOverview() {

        this.scene.pause();
        this.scene.resume('Overview');
        this.scene.setVisible(true, 'Overview');


    }

}