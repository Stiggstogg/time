import Phaser from 'phaser';
import gameOptions from '../helper/gameOptions';
import {GameData} from '../helper/interfaces';
import eventsCenter from '../helper/eventsCenter';

// "GameUI" scene: Scene which shows the current time
export default class GameUIScene extends Phaser.Scene {

    private gameData!: GameData;
    private timeText!: Phaser.GameObjects.Text;     // text object which shows the current time
    private collisionsText!: Phaser.GameObjects.Text // text which shows the number of collisions
    private startTime!: number;                     // start time (in ms since Unix Epoch)
    private running!: boolean;                      // is the timer running
    private remainingTime!: number;                 // remaining time
    private collisionsCounter!: number;             // counts the number of collisions
    private warningSent!: boolean;                  // check if the 10 s warning was sent already

    // Constructor
    constructor() {
        super({
            key: 'GameUI'
        });
    }

    // Initialize parameters
    init(data: GameData): void {

        // get game data
        this.gameData = data;

        // initialize variables
        this.remainingTime = this.gameData.time!;       // set remaining time
        this.running = false;                           // set that the timer is not running yet
        this.collisionsCounter = 0;                    // set the collisions counter to 0
        this.warningSent = false;                       // warning was not sent already

    }

    // Shows the all objects of this scene
    create(): void {

        // fade in
        this.cameras.main.fadeIn(gameOptions.fadeInOutTime);

        // add UI on top
        this.add.image(0, 0, 'uiFly').setOrigin(0);

        // add texts
        this.addTexts();

        // setup all event handlers
        this.eventsHandlingSetup();

    }

    // Update function for the game loop.
    update(_time: number, _delta: number): void {       // remove underscore if time and delta is needed

        // update the timer
        if (this.running) {

            const timeDifference = new Date().getTime() - this.startTime;       // calculate the time difference since the timer was started (in ms)
            this.remainingTime = this.gameData.time! - timeDifference / 1000;      // calculate the remaining time

            this.setTimerText(this.remainingTime);

        }

        // check if time is up
        if (this.remainingTime <= 0) {

            this.timeUp();

        }

        // check if time is < 10 s and the warning was not sent already. If not send an event
        if (this.remainingTime < 10 && !this.warningSent) {

            this.warningSent = true;                                    // change the boolean so that the warning is only sent once
            eventsCenter.emit('warning', this.remainingTime);     // send the warning with the remaining time

        }

    }

    // add all texts
    addTexts() {

        // Stats position
        const statsY = 0.045;

        // Add text for the time
        this.timeText = this.add.text(
            gameOptions.gameWidth * 0.30,
            gameOptions.gameWidth * statsY,
            '',
            gameOptions.textStyles[5])
            .setOrigin(1, 0.5);
        this.setTimerText(this.remainingTime);

        // Add text for level
        const levelText = this.gameData.level.toString() + '/' + gameOptions.numLevels.toString();
        this.add.text(gameOptions.gameWidth * 0.5, gameOptions.gameWidth * statsY,
            levelText, gameOptions.textStyles[5]).setOrigin(0.5, 0.5);

        // Add collision test
        this.collisionsText = this.add.text(
            gameOptions.gameWidth * 0.88,
            gameOptions.gameWidth * statsY,
            this.collisionsCounter.toString(),
            gameOptions.textStyles[5])
            .setOrigin(1, 0.5);

    }

    // Start the timer
    startTimer() {

        this.running = true;                        // set the start of the timer to true

        this.startTime = new Date().getTime();      // get the time (in ms since Unix Epoch)

    }

    // Set timer text
    setTimerText(time: number) {

        const timeSuffix = ' s';

        this.timeText.setText(Math.ceil(time).toString() + timeSuffix);

    }

    // Action when time is up
    timeUp() {

        eventsCenter.emit('timeUp');

    }

    // setup all the events and make sure they are also cleaned up at the end
    eventsHandlingSetup() {

        // event to wait for the start of the game (when the user presses the first time the input)
        eventsCenter.once('startgame', this.startTimer, this);

        // event when the ship collides with blocks
        eventsCenter.on('blockCollide', function (this: GameUIScene) {

            this.increaseCollisions();

        }, this);

        // Cleanup the events when the scene is shut down
        this.events.once(Phaser.Scenes.Events.SHUTDOWN, function () {
            eventsCenter.off('startgame');
            eventsCenter.off('blockCollide');
        });

    }

    // increase collisions (counter and text)
    increaseCollisions() {

        // increase the collisions counter
        this.collisionsCounter += 1;

        // update the collisions text
        this.collisionsText.setText(this.collisionsCounter.toString());


    }

}