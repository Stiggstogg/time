import Phaser from 'phaser';
import gameOptions from '../helper/gameOptions';

// "GameUI" scene: Scene which shows the current time
export default class GameUIScene extends Phaser.Scene {

    private estimatedTime!: number;                // time which was estimated
    private timeText!: Phaser.GameObjects.Text;    // text object which shows the current time
    private startTime!: number;                             // start time (in ms since Unix Epoch)
    private running!: boolean;                              // is the timer running

    // Constructor
    constructor() {
        super({
            key: 'GameUI'
        });
    }

    // Initialize parameters
    init(data: { time: number }): void {

        // get game data
        this.estimatedTime = data.time;                     // get estimated time

        // set that the timer is not running yet
        this.running = false;

    }

    // Shows the all objects of this scene
    create(): void {

        // Add text for the time
        this.timeText = this.add.text(gameOptions.gameWidth * 0.2, gameOptions.gameWidth * 0.2, this.estimatedTime.toString(), gameOptions.textStyles[1]).setOrigin(1, 0.5);

        this.startTimer();

    }

    // Update function for the game loop.
    update(_time: number, _delta: number): void {       // remove underscore if time and delta is needed

        // update the timer
        if (this.running) {

            const timeDifference = new Date().getTime() - this.startTime;       // calculate the time difference since the timer was started (in ms)
            const remainingTime = this.estimatedTime - timeDifference / 1000;      // calculate the remaining time

            this.timeText.setText(Math.round(remainingTime).toString() + ' s');

        }



    }

    // Start the timer
    startTimer() {

        this.running = true;                        // set the start of the timer to true

        this.startTime = new Date().getTime();      // get the time (in ms since Unix Epoch)


    }


}