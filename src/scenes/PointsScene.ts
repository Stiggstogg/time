import Phaser from 'phaser';
import gameOptions from '../helper/gameOptions';
import {GameData} from '../helper/interfaces';
import Bubble from "../sprites/Bubble";
import Button from "../sprites/Button";

// "Points" scene: Scene where the points you got in the last level are shown
export default class PointsScene extends Phaser.Scene {

    private gameData!: GameData;
    private levelPoints!: number;
    private collisionPoints!: number;
    private newPoints!: number;
    private bubbleOverlord!: Bubble;
    private bubbleCreep!: Bubble;
    private overlordString!: string;
    private creepString!: string;
    private buttonStrings!: string[];
    private buttonOne!: Button;
    private buttonTwo!: Button;
    private state!: string;
    private missionString!: string;
    private missionTextColor!: string;

    // Constructor
    constructor() {
        super({
            key: 'Points'
        });
    }

    // Initialize parameters
    init(data: GameData): void {

        // get game data
        this.gameData = data;

    }

    // Shows the all objects of this scene
    create(): void {

        // stop engine sound in case it is still running (happens sometimes, seems to be a bug)
        this.sound.get('engine').stop();

        // fade in
        this.fadeInColor();

        // calculate points
        this.calculatePoints();

        // define state (done, accomplished, failed) and adapt objects accordingly
        this.defineStateAndTexts();

        // Setup elements
        this.setupElements();

        // Add texts
        this.addPointsTexts();

        // add actions to buttons
        this.addButtonActions();

    }

    // define the state of this level and adapt texts and buttons accordingly
    defineStateAndTexts() {

        const lastLevel = this.gameData.level == gameOptions.numLevels;

        const startSpace = '\n\n\n';                                // space at the top for the accomplished / failed message
        const pointsSpace = '\n\n\n\n\n\n\n\n\n\n';                 // string for the space which needs to be left for the points
        const buttonSpace = '\n\n\n\n';

        if (lastLevel && this.gameData.successful) {                        // Level was successful and it was the last one

            this.state = 'done';                                                // set the state to 'done'

            // mission string and color
            this.missionString = 'ACCOMPLISHED!'
            this.missionTextColor = Phaser.Display.Color.RGBToString(
                gameOptions.fadeColorSuccess[0],
                gameOptions.fadeColorSuccess[1],
                gameOptions.fadeColorSuccess[2]);

            // overlord string
            this.overlordString = startSpace +
                'Congratulations!\n' +
                'You completed all ' + gameOptions.numLevels.toString() + ' missions!\n\n' +
                'Let\'s look at your balance:' +
                pointsSpace + 'Thank you for your service!'

            // creep string
            this.creepString = 'It has been an honour, my lord!\n' +
                'It fills me with pride every time I can serve you. I hope we will conquer some more worlds and save more birds!' + buttonSpace;

            // button string
            this.buttonStrings = [
                'BYE!',                             // this one will not be used
                'BYE!'
            ];


        }
        else if (!lastLevel && this.gameData.successful) {                  // successful but there are still some levels

            this.state = 'good';                                                // set the state to 'good'

            // mission string
            this.missionString = 'Excellent!'
            this.missionTextColor = Phaser.Display.Color.RGBToString(
                gameOptions.fadeColorSuccess[0],
                gameOptions.fadeColorSuccess[1],
                gameOptions.fadeColorSuccess[2]);

            // overlord string
            this.overlordString = startSpace +
                'Well done!\n' +
                'You completed mission ' + this.gameData.level.toString() + '.\n\n' +
                'Let\'s look at your balance:' +
                pointsSpace;

            // creep string
            this.creepString = 'Let\'s go to the...' + buttonSpace +
            'or...' + buttonSpace;

            // button string
            this.buttonStrings = [
                '...next mission!',
                '...give up!'
            ];

        }
        else {                                                             // not successful (repeat level)

            this.state = 'failed';                                                // set the state to 'failed'

            // mission string
            this.missionString = 'Failed!'
            this.missionTextColor = Phaser.Display.Color.RGBToString(
                gameOptions.fadeColorFail[0],
                gameOptions.fadeColorFail[1],
                gameOptions.fadeColorFail[2]);

            // overlord string
            this.overlordString = startSpace +
                'I am disappointed!\n' +
                'You failed mission ' + this.gameData.level.toString() + '.\n\n' +
                'Let\'s look at your balance:' +
                pointsSpace;

            // creep string
            this.creepString = 'I am sorry! I will...' + buttonSpace +
                'or...' + buttonSpace;

            this.buttonStrings = [
                '...try again!',
                '...give up!'
            ];

        }

    }

    // setup all elements of the scene (title, bubbles, figures and buttons)
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
        const firstY = 0.08;                    // y position of the first bubble (relative to game height)
        const overlordX = 0.83;                 // x position of the overlord (relative to game width)
        const creepX = 0.17;                    // x position of the creep (relative to game width)
        const distances = [                      // distances between the different elements (relative to game height)
            0.03,                               // Overlord bubble bottom and overlord middle
            -0.02,                              // Overlord bottom and creep bubble
            0.04,                               // Creep bubble (bottom) and creep
            0.095,                              // Creep bubble top and "Flying" button
        ];

        // first bubble for the overlord
        this.bubbleOverlord = this.add.existing(new Bubble(this,
            0,
            gameOptions.gameHeight * firstY,
            this.overlordString,
            'bottomRight'));

        // add the overlord
        const overlord = this.add.image(
            overlordX * gameOptions.gameWidth,
            this.bubbleOverlord.bottomY + gameOptions.gameHeight * distances[0],
            'overlord'
        );

        // add the creep bubble
        this.bubbleCreep = this.add.existing(new Bubble(this,
            0,
            overlord.y + overlord.height / 2 + gameOptions.gameHeight * distances[1],
            this.creepString,
            'bottomLeft'));

        // add the creep
        this.add.image(
            creepX  * gameOptions.gameWidth,
            this.bubbleCreep.bottomY + gameOptions.gameHeight * distances[2],
            'creep'
        );

        // --------------------
        // Mission text
        // --------------------

        this.add.text(this.bubbleOverlord.text.x,
            this.bubbleOverlord.y + this.bubbleOverlord.text.y,
            this.missionString,
            gameOptions.textStyles[4])
            .setOrigin(0, 0)
            .setColor(this.missionTextColor);

        // --------------------
        // Buttons
        // --------------------

        // distances
        const distanceY2 = [            // distances between the different elements (relative to game)
            0.095,                      // creep bubble and first button
            0.10                       // first and second button
        ];



        // create the buttons based on the state

        // first button
        this.buttonOne = this.add.existing(new Button(this,
            gameOptions.gameWidth * 0.5,
            this.bubbleCreep.y + gameOptions.gameHeight * distanceY2[0],
            this.buttonStrings[0]
        ));

        // second button
        this.buttonTwo = this.add.existing(new Button(this,
            gameOptions.gameWidth * 0.5,
            this.buttonOne.y + gameOptions.gameHeight * distanceY2[1],
            this.buttonStrings[1]
        ));


    }

    // fade in with the right color, based on success or not
    fadeInColor() {

        // initialize colors
        let red = 0;
        let green = 0;
        let blue = 0;

        if (this.gameData.successful) {          // successful

            // set colors for fade out (here: red)
            red = gameOptions.fadeColorSuccess[0];
            green = gameOptions.fadeColorSuccess[1];
            blue = gameOptions.fadeColorSuccess[2];

        }
        else {

            // set color for fade out (here: green
            red = gameOptions.fadeColorFail[0];
            green = gameOptions.fadeColorFail[1];
            blue = gameOptions.fadeColorFail[2];

        }

        this.cameras.main.fadeIn(gameOptions.fadeInOutTime, red, green, blue);

    }

    // calculate the points
    calculatePoints() {

        // calculate the points you get from completing the level or failing it!
        if (this.gameData.successful) {                                                 // level completed
            this.levelPoints = this.gameData.expectedPoints!;
        }
        else {                                                                          // level failed
            this.levelPoints = Math.round(- this.gameData.expectedPoints! / 2);
        }

        // calculate the points from the collisions
        this.collisionPoints = - this.gameData.collisions! * gameOptions.collisionPenalty;

        // calculate the new points
        this.newPoints = this.gameData.points + this.levelPoints + this.collisionPoints;

    }


    // add all texts
    addPointsTexts() {

        const startY = this.bubbleOverlord.bottomY - gameOptions.gameHeight * 0.23;         // absolute y position where the points start
        const spaceY = 0.04;        // space between the different points (relative to game height)
        const posX = 0.95;           // x position where the points are added (right aligned)

        // Points
        this.add.text(this.bubbleOverlord.text.x,
            startY,
            'Before:',
            gameOptions.textStyles[1]).setOrigin(0, 0.5);

        this.add.text(gameOptions.gameWidth * posX,
            startY,
            this.gameData.points.toString() + ' CZD',
            gameOptions.textStyles[1]).setOrigin(1, 0.5);

        // Level points
        this.add.text(this.bubbleOverlord.text.x,
            startY + gameOptions.gameHeight * spaceY,
            'Mission:',
            gameOptions.textStyles[1]).setOrigin(0, 0.5);

        let levelPointsText = this.levelPoints.toString()  + ' CZD';

        if (this.levelPoints >= 0) {                                // add a plus when it is positive
            levelPointsText = '+' + this.levelPoints.toString() + ' CZD';
        }

        this.add.text(gameOptions.gameWidth * posX,
            startY + gameOptions.gameHeight * spaceY,
            levelPointsText,
            gameOptions.textStyles[1]).setOrigin(1, 0.5);

        // Collision points
        this.add.text(this.bubbleOverlord.text.x,
            startY + gameOptions.gameHeight * spaceY * 2,
            'Crashes:',
            gameOptions.textStyles[1]).setOrigin(0, 0.5);

        let collisionPointsText = this.collisionPoints.toString()  + ' CZD';

        if (this.collisionPoints >= 0) {                                // add a plus when it is positive
            collisionPointsText = '+' + this.collisionPoints.toString()  + ' CZD';
        }
        this.add.text(gameOptions.gameWidth * posX,
            startY + gameOptions.gameHeight * spaceY * 2,
            collisionPointsText,
            gameOptions.textStyles[1]).setOrigin(1, 0.5);

        // final points
        this.add.line(0,0,
            this.bubbleOverlord.text.x,
            startY + gameOptions.gameHeight * spaceY * 2.75,
            gameOptions.gameWidth - this.bubbleOverlord.text.x,
            startY + gameOptions.gameHeight * spaceY * 2.75,
            0x000000)
            .setOrigin(0)
            .setLineWidth(2);

        this.add.text(this.bubbleOverlord.text.x,
            startY + gameOptions.gameHeight * spaceY * 3.5,
            'Total:',
            gameOptions.textStyles[1]).setOrigin(0, 0.5);

        this.add.text(gameOptions.gameWidth * posX,
            startY + gameOptions.gameHeight * spaceY * 3.5,
            this.newPoints.toString()  + ' CZD',
            gameOptions.textStyles[1]).setOrigin(1, 0.5);

    }


    // Add correct actions to the buttons
    addButtonActions(): void {

        if (this.state == 'done') {                                             // Level was successful and it was the last one

            this.buttonOne.destroy();                                           // destroy button one as it is not needed

            this.buttonTwo.button.on('pointerdown', this.startMenu, this);  // back to menu

        }
        else if (this.state == 'good') {                                        // successful but there are still some levels

            // button one
            this.buttonOne.button.on('pointerdown', function(this: PointsScene) {

                this.gameData.level += 1;                                       // set the level to the next one

                this.gameData.points = this.newPoints;

                this.startEstimate();

            }, this);

            // button two
            this.buttonTwo.button.on('pointerdown', this.startMenu, this);  // back to menu

        }
        else {                                                                      // not successful (repeat level)

            // button one
            this.buttonOne.button.on('pointerdown', function(this: PointsScene) {

                this.gameData.points = this.newPoints;

                this.startEstimate();

            }, this);

            // button two
            this.buttonTwo.button.on('pointerdown', this.startMenu, this);      // back to menu

        }
    }

    // start the menu scene
    startMenu() {

        // do the action as soon as the camerafadeout is complete
        this.cameras.main.once('camerafadeoutcomplete', function(this: PointsScene) {

            this.scene.start('Home');                                   // go back to menu

        }, this);

        this.cameras.main.fadeOut(gameOptions.fadeInOutTime);           // fade out the camera

    }

    // start the estimation scene
    startEstimate() {

        // do the action as soon as the camerafadeout is complete
        this.cameras.main.once('camerafadeoutcomplete', function(this: PointsScene) {

            this.scene.start('Estimate', this.gameData);         // go back the estimation scene (same level)

        }, this);

        this.cameras.main.fadeOut(gameOptions.fadeInOutTime);           // fade out the camera

    }

}
