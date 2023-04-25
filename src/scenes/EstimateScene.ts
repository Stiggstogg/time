import Phaser from 'phaser';
import gameOptions from '../helper/gameOptions';
import {GameData} from '../helper/interfaces';
import Bubble from "../sprites/Bubble";
import Button from "../sprites/Button";

// "Estimate" scene: Scene where you estimate your time
export default class EstimateScene extends Phaser.Scene {

    private gameData!: GameData;
    private numbers!: Phaser.GameObjects.Text[];
    private expectedPoints!: Phaser.GameObjects.Text;
    private textOverlord1!: string;
    private textOverlord2!: string;
    private textCreep!: string;
    private buttonMap!: Button;
    private buttonGo!: Button;
    private bubble2!: Bubble;
    private bubble3!: Bubble;

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

        // texts
        this.textOverlord1 = 'I hope you are ready. ' +
            'I have located a few birds. Have a look at the...\n\n\n\n' +
            'How long will it take?'

        this.textCreep = 'I can do it in... \n\n\n\n\n\n'

        this.textOverlord2 = 'Ok, if you do it in this time I pay you\n\n'

    }

    // Shows the all objects of this scene
    create(): void {

        // Setup overview scene
        this.setupOverview();

        // setup elements
        this.setupElements();

        // add numbers
        this.addNumbers();

        // add time buttons
        this.addTimeButtons();

        // Add buttons
        this.addButtonActions();



    }

    // Update function for the game loop.
    update(_time: number, _delta: number): void {       // remove underscore if time and delta is needed

    }

    // Setup overview scene
    setupOverview() {

        this.scene.launch('Overview', this.gameData);                          // launch the overview scene
        this.scene.pause( 'Overview');                          // and pause it directly (it will be hidden automatically in its init() function

    }

    // Setup elements
    setupElements() {

        // background
        this.add.image(0, 0, 'backgroundEstimate').setOrigin(0).setDepth(0);

        // title
        this.add.text(
            gameOptions.gameWidth / 2,
            gameOptions.gameHeight * 0.05,
            'Mission ' + this.gameData.level.toString() + '/' + gameOptions.numLevels.toString(),
            gameOptions.textStyles[4]
        ).setOrigin(0.5, 0.5);

        // --------------------
        // Bubbles and figures
        // --------------------

        // distances for bubbles and overlord / creep
        const firstY = 0.08;        // y position of the first bubble (relative to game height)
        const distanceY1 = [         // distances between the different elements (relative to game)
            0.22,                   // bubble 1 and overlord 1
            0.02,                   // overlord 1 and bubble 2
            0.25,                   // bubble 2 and creep 1
            0.02,                   // creep 1 and bubble 3
            0.17,                   // bubble 3 and overlord 2
            0.02,                   // overlord 2 and bubble 4
            0.18                    // bubble 4 and creep 2
        ];

        // first bubble for the overlord
        const bubble1 = this.add.existing(new Bubble(this,
            0,
            gameOptions.gameHeight * firstY,
            this.textOverlord1,
            'bottomRight'));

        // add the overlord
        const overlord1 = this.add.image(
            gameOptions.gameWidth * 0.83,
            bubble1.y + gameOptions.gameHeight * distanceY1[0],
            'overlord'
        );

        // add the creep bubble
        this.bubble2 = this.add.existing(new Bubble(this,
            0,
            overlord1.y + gameOptions.gameHeight * distanceY1[1],
            this.textCreep,
            'bottomLeft'));

        // add the creep
        const creep1 = this.add.image(
            gameOptions.gameWidth * 0.17,
            this.bubble2.y + gameOptions.gameHeight * distanceY1[2],
            'creep'
        );

        // second bubble for the overlord
        this.bubble3 = this.add.existing(new Bubble(this,
            0,
            creep1.y + gameOptions.gameHeight * distanceY1[3],
            this.textOverlord2,
            'bottomRight'));

        // add the overlord
        const overlord2 = this.add.image(
            gameOptions.gameWidth * 0.83,
            this.bubble3.y + gameOptions.gameHeight * distanceY1[4],
            'overlord'
        );

        // add the creep bubble
        const bubble4 = this.add.existing(new Bubble(this,
            0,
            overlord2.y + gameOptions.gameHeight * distanceY1[5],
            '\n\n\n',
            'bottomLeft'));

        // add the creep
        this.add.image(
            gameOptions.gameWidth * 0.17,
            bubble4.y + gameOptions.gameHeight * distanceY1[6],
            'creep'
        );

        // --------------------
        // Buttons
        // --------------------

        // distances
        const distanceY2 = [         // distances between the different elements (relative to game)
            0.115,                   // bubble 1 and "map" button
            0.075                    // bubble 4 and "GO" button
        ];

        // add map button
        this.buttonMap = this.add.existing(new Button(this,
            gameOptions.gameWidth * 0.5,
            bubble1.y + gameOptions.gameHeight * distanceY2[0],
            '...map!'
        ));

        // add map button
        this.buttonGo = this.add.existing(new Button(this,
            gameOptions.gameWidth * 0.5,
            bubble4.y + gameOptions.gameHeight * distanceY2[1],
            'LET\'S FLY!'
        ));

    }

    // add all the actions to the buttons
    addButtonActions() {

        // "Map" button
        this.buttonMap.button.on('pointerdown', this.showOverview, this)   // Show the overview

        // "Go" button
        this.buttonGo.button.on('pointerdown', this.startFly, this)   // start flying (game scene)

    }

    // add the numbers
    addNumbers() {

        // add the numbers to estimate the time
        const startTime = [1, 0 , 0];

        const distance = 0.19;               // horizontal distance between the numbers (relative to game width)
        const startX = 0.39;                 // start position of the first number (relative to game width)
        const positionY = this.bubble2.y + gameOptions.gameHeight * 0.125;              // vertical position (absolute position)

        for (let i = 0; i < startTime.length; i++) {

            this.numbers.push(this.add.text(
                gameOptions.gameWidth * (startX + i * distance), positionY,
                startTime[i].toString(), gameOptions.textStyles[1]).setOrigin(0.5, 0.5));

        }

        // add the second unit
        const lastNumber = this.numbers[this.numbers.length - 1];
        this.add.text(lastNumber.x + gameOptions.gameWidth * distance * 0.75, lastNumber.y,
            's', gameOptions.textStyles[1]).setOrigin(0.5, 0.5);

        // add the expected points number
        this.expectedPoints = this.add.text(gameOptions.gameWidth * 0.5,
            this.bubble3.y + gameOptions.gameHeight * 0.08,
            ' ', gameOptions.textStyles[1]).setOrigin(0.5, 0.5);                    // create text object
        this.updatePoints();        // update the expected points

    }

    // add buttons to change the time
    addTimeButtons() {

        const distance = 0.008;           // vertical distance from the number (relative to game height)

        const positionYUp = this.numbers[0].y - this.numbers[0].height / 2 - distance * gameOptions.gameHeight;     // y position of the up button
        const positionYDown = this.numbers[0].y + this.numbers[0].height / 2 + distance * gameOptions.gameHeight;   // y position of the up button

        // sound
        const click = this.sound.add('click');

        for (let i = 0; i < this.numbers.length; i++) {

            // up button
            const buttonUp = this.add.sprite(this.numbers[i].x, positionYUp, 'timeChanger', 0);

            buttonUp.setOrigin(0.5, 1);
            buttonUp.setInteractive();

            buttonUp.on('pointerdown', function(this: EstimateScene) {
                this.changeNumber(i, true);
                click.play();
            }, this);

            // down button
            const buttonDown = this.add.sprite(this.numbers[i].x, positionYDown, 'timeChanger', 1);

            buttonDown.setOrigin(0.5, 0);
            buttonDown.setInteractive();

            buttonDown.on('pointerdown', function(this: EstimateScene) {
                this.changeNumber(i, false);
                click.play();
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

        this.expectedPoints.setText(this.calculatePoints(this.getEstimatedTime()).toString() + ' CZD!');

    }

}