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

        const pointsSpace = '\n\n\n\n\n\n\n\n\n\n';                 // string for the space which needs to be left for the points
        const buttonSpace = '\n\n\n\n';

        if (lastLevel && this.gameData.successful) {                        // Level was successful and it was the last one

            this.state = 'done';                                                // set the state to 'done'

            this.overlordString = 'Congratulations!\n' +
                'You completed all ' + gameOptions.numLevels.toString() + 'missions!\n\n' +
                'Let\'s look at your balance:' +
                pointsSpace +
                'Thank you for your service!';

            this.creepString = 'It has been an honour my lord!' + buttonSpace;

            this.buttonStrings = [
                'BYE!'
            ];


        }
        else if (!lastLevel && this.gameData.successful) {                  // successful but there are still some levels

            this.state = 'good';                                                // set the state to 'good'

            this.overlordString = 'Good!\n' +
                'You completed mission ' + gameOptions.numLevels.toString() + '.\n\n' +
                'Let\'s look at your balance:' +
                pointsSpace;

            this.creepString = 'Let\'s go to the...' + buttonSpace +
            'or...' + buttonSpace;

            this.buttonStrings = [
                '...next level!',
                '...give up!'
            ];

        }
        else {                                                             // not successful (repeat level)

            this.state = 'failed';                                                // set the state to 'failed'

            this.overlordString = 'I am disappointed!\n' +
                'You failed mission ' + this.gameData.level.toString() + '.\n\n' +
                'Let\'s look at your balance:' +
                pointsSpace;

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
        const firstY = 0.08;        // y position of the first bubble (relative to game height)
        const distanceY1 = [        // distances between the different elements (relative to game height)
            0.085,                  // overlord and bottom of the text of the first bubble
            0.06,                   // overlord and second bubble
            0.08,                   // bottom of the text of the second bubble and creep
        ];

        // first bubble for the overlord
        this.bubbleOverlord = this.add.existing(new Bubble(this,
            0,
            gameOptions.gameHeight * firstY,
            this.overlordString,
            'bottomRight'));

        // add the overlord
        const overlord = this.add.image(
            gameOptions.gameWidth * 0.83,
            this.bubbleOverlord.y + this.bubbleOverlord.text.height + gameOptions.gameHeight * distanceY1[0],
            'overlord'
        );

        // add the creep bubble
        this.bubbleCreep = this.add.existing(new Bubble(this,
            0,
            overlord.y + gameOptions.gameHeight * distanceY1[1],
            this.creepString,
            'bottomLeft'));

        // add the creep
        this.add.image(
            gameOptions.gameWidth * 0.17,
            this.bubbleCreep.y + this.bubbleCreep.text.height + gameOptions.gameHeight * distanceY1[2],
            'creep'
        );

        // --------------------
        // Buttons
        // --------------------

        // distances
        const distanceY2 = [            // distances between the different elements (relative to game)
            0.095,                      // creep bubble and first button
            0.10                       // first and second button
        ];

        // first button
        this.buttonOne = this.add.existing(new Button(this,
            gameOptions.gameWidth * 0.5,
            this.bubbleCreep.y + gameOptions.gameHeight * distanceY2[0],
            this.buttonStrings[0]
        ));

        // second button (if available)
        if (this.buttonStrings.length > 1) {

            this.buttonTwo = this.add.existing(new Button(this,
                gameOptions.gameWidth * 0.5,
                this.buttonOne.y + gameOptions.gameHeight * distanceY2[1],
                this.buttonStrings[1]
            ));

        }

    }

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

        const startY = this.bubbleOverlord.y + gameOptions.gameHeight * 0.185;         // absolute y position where the points start
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

            this.buttonOne.button.on('pointerdown', function(this: PointsScene) {

                this.gameData.points = this.newPoints;
                this.scene.start('Home');                                   // go back to menu

            }, this);

        }
        else if (this.state == 'good') {                                        // successful but there are still some levels

            // button one
            this.buttonOne.button.on('pointerdown', function(this: PointsScene) {

                this.gameData.level += 1;                                       // set the level to the next one

                this.gameData.points = this.newPoints;
                this.scene.start('Estimate', this.gameData);               // go back the estimation scene (next level)

            }, this);

            // button two
            this.buttonTwo.button.on('pointerdown', function(this: PointsScene) {

                this.scene.start('Home');                                   // go back to menu

            }, this);

        }
        else {                                                                      // not successful (repeat level)

            // button one
            this.buttonOne.button.on('pointerdown', function(this: PointsScene) {

                this.gameData.points = this.newPoints;
                this.scene.start('Estimate', this.gameData);               // go back the estimation scene (same level)

            }, this);

            // button two
            this.buttonTwo.button.on('pointerdown', function(this: PointsScene) {

                this.scene.start('Home');                                   // go back to menu

            }, this);

        }
    }

}
