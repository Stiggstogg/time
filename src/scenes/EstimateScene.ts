import Phaser from 'phaser';
import gameOptions from '../helper/gameOptions';
import {GameData} from '../helper/interfaces';

// "Estimate" scene: Scene where you estimate your time
export default class EstimateScene extends Phaser.Scene {

    private gameData!: GameData;
    private numbers!: Phaser.GameObjects.Text[];
    private expectedPoints!: Phaser.GameObjects.Text;

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

        // add time buttons
        this.addTimeButtons();

        // Add buttons
        this.addButtons();

    }

    // Update function for the game loop.
    update(_time: number, _delta: number): void {       // remove underscore if time and delta is needed

    }

    // Setup overview scene
    setupOverview() {

        this.scene.launch('Overview', this.gameData);                          // launch the overview scene
        this.scene.pause( 'Overview');                          // and pause it directly (it will be hidden automatically in its init() function

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

        // add the numbers to estimate the time
        const startTime = [1, 0 , 0];

        const distance = 0.2;               // horizontal distance between the numbers (relative to game width)
        const positionY = 0.5;              // vertical position (relative to game height)

        for (let i = 0; i < startTime.length; i++) {

            this.numbers.push(this.add.text(
                gameOptions.gameWidth * ((1 - (startTime.length - 1) * distance) / 2  + i * distance), gameOptions.gameHeight * positionY,
                startTime[i].toString(), gameOptions.textStyles[1]).setOrigin(0.5, 0.5));

        }

        // add the second unit
        const lastNumber = this.numbers[this.numbers.length - 1];
        this.add.text(lastNumber.x + gameOptions.gameWidth * distance * 0.75, lastNumber.y,
            's', gameOptions.textStyles[1]).setOrigin(0.5, 0.5);

        // add the expected points number
        this.expectedPoints = this.add.text(gameOptions.gameWidth * 0.5,gameOptions.gameHeight * 0.7,
            ' ', gameOptions.textStyles[1]).setOrigin(0.5, 0.5);                    // create text object
        this.updatePoints();        // update the expected points

    }

    // add buttons to change the time
    addTimeButtons() {

        const distance = 0.05           // vertical distance from the number (relative to game height)

        const positionYUp = this.numbers[0].y - this.numbers[0].height / 2 - distance * gameOptions.gameHeight;     // y position of the up button
        const positionYDown = this.numbers[0].y + this.numbers[0].height / 2 + distance * gameOptions.gameHeight;   // y position of the up button

        for (let i = 0; i < this.numbers.length; i++) {

            // up button
            const buttonUp = this.add.sprite(this.numbers[i].x, positionYUp, 'timechanger');

            buttonUp.setOrigin(0.5, 0);
            buttonUp.setInteractive();

            buttonUp.on('pointerdown', function(this: EstimateScene) {
                this.changeNumber(i, true);
            }, this);

            // down button
            const buttonDown = this.add.sprite(this.numbers[i].x, positionYDown, 'timechanger');

            buttonDown.setOrigin(0.5, 0);
            buttonDown.setAngle(180);
            buttonDown.setInteractive();

            buttonDown.on('pointerdown', function(this: EstimateScene) {
                this.changeNumber(i, false);
            }, this);

        }

    }

    // change number (i: index of the number which should be changed, b: does the button look up?)
    changeNumber(i: number, up: boolean): void {

        const numberValue = Number(this.numbers[i].text);

        let newNumber: number;

        if (numberValue == 0 && !up) {          // number is equals 0 and should go down -> 9
            newNumber = 9;
        }
        else if (numberValue == 9 && up) {      // number is equals 9 and should go up -> 0
            newNumber = 0;
        }
        else if (!up) {                         // number should go down
            newNumber = numberValue - 1;
        }
        else {                                  // number should go up
            newNumber = numberValue + 1;
        }

        this.numbers[i].setText(newNumber.toString());

        this.updatePoints();        // update the expected points

    }

    // Start game
    startFly() {

        this.scene.stop('Overview');        // stop the overview scene (which is currently paused)

        this.gameData.time = 0;                 // reset estimated time

        this.gameData.time = this.getEstimatedTime();

        // calculate and update estimated time in gameData
        this.gameData.expectedPoints = this.calculatePoints(this.getEstimatedTime());

        this.scene.start('Game', this.gameData);        // start first estimation scene with 0 points

    }

    // get the estimated time from the number strings
    getEstimatedTime(): number {

        let estimatedTime = 0;

        for (let i = 0; i < this.numbers.length; i++) {

            estimatedTime += Number(this.numbers[i].text) * 10**(this.numbers.length - 1 - i);

        }

        return estimatedTime;

    }

    // Show the overview while maintaining the estimation scene in the background
    showOverview() {

        this.scene.pause();
        this.scene.resume('Overview');
        this.scene.setVisible(true, 'Overview');

    }

    // Calculate the points you get based on the estimated time
    calculatePoints(estimatedTime: number): number {

        // get the par time from the level
        const levelNumber: number = this.gameData.level;                // get the number of the level
        const levelString: string = 'level' + levelNumber.toString();   // create the string with the level name (key to the loaded json)
        const parTime = this.cache.json.get(levelString).partime;  // get the data from the json

        // calculate slope and offset (y = a*x + b, point = slope * estimated time + offset)
        const slope = gameOptions.parTimePoints / (parTime - gameOptions.zeroPointTimeFactor * parTime);    // calculate the slope based on two points, 1: par time points, 2: time where you get zero points
        const offset = gameOptions.parTimePoints - slope * parTime;                                         // calculate the offset based on one point (par time points) and the slope (b = y - a * x)

        const points = Math.round(slope * estimatedTime + offset);              // calculate and return expected points

        if (points < 0) {
            return 0;
        }
        else {
            return points;
        }

    }

    // Update the expected points
    updatePoints() {

        this.expectedPoints.setText(this.calculatePoints(this.getEstimatedTime()).toString());

    }

}