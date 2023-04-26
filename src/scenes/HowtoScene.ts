import Phaser from 'phaser';
import gameOptions from '../helper/gameOptions';
import Bubble from "../sprites/Bubble";
import Button from "../sprites/Button";

// "How To Play" scene: Scene where the game is explained
export default class HowtoScene extends Phaser.Scene {

    private textsOverlord!: string[];
    private textsCreep!: string[];
    private bubblesOverlord!: Bubble[];
    private bubblesCreep!: Bubble[];
    private buttons!: Button[];
    private overlord!: Phaser.GameObjects.Image;
    private creep!: Phaser.GameObjects.Image;
    private distances!: number[];

    // Constructor
    constructor() {
        super({
            key: 'HowTo'
        });
    }

    // Initialize parameters
    init(): void {

        // initialize variables
        this.textsOverlord = [];
        this.textsCreep = [];
        this.bubblesOverlord = [];
        this.bubblesCreep = [];
        this.buttons = [];

    }

    // Shows the all objects of this scene
    create(): void {

        // fade in
        this.cameras.main.fadeIn(gameOptions.fadeInOutTime);

        // Create all texts
        this.createTexts();

        // Setup elements
        this.setupElements();

        // Add button actions
        this.addButtonActions();

    }

    // setup all elements of the scene (title, bubbles, figures and buttons)
    setupElements() {

        // background
        this.add.image(0, 0, 'backgroundEstimate').setOrigin(0).setDepth(0);

        // title
        this.add.text(
            gameOptions.gameWidth / 2,
            gameOptions.gameHeight * 0.05,
            'HOW?',
            gameOptions.textStyles[4]
        ).setOrigin(0.5, 0.5);

        // --------------------
        // Bubbles and figures
        // --------------------

        // distances for bubbles and overlord / creep
        const firstY = 0.08;                    // y position of the first bubble (relative to game height)
        const overlordX = 0.83;                 // x position of the overlord (relative to game width)
        const creepX = 0.17;                    // x position of the creep (relative to game width)
        this.distances = [                      // distances between the different elements (relative to game height)
            0.03,                               // Overlord bubble bottom and overlord middle
            -0.02,                              // Overlord bottom and creep bubble
            0.04,                               // Creep bubble (bottom) and creep
            0.095,                              // Creep bubble top and "Flying" button
            ];

        // 1st talk: First bubble for the overlord
        this.bubblesOverlord.push(this.add.existing(new Bubble(this,
            0,
            gameOptions.gameHeight * firstY,
            this.textsOverlord[0],
            'bottomRight')).setDepth(1));

        // Overlord
        this.overlord = this.add.image(
            gameOptions.gameWidth * overlordX,
            this.bubblesOverlord[0].bottomY + gameOptions.gameHeight * this.distances[0],
            'overlord'
        ).setDepth(2);

        // 1st talk: First bubble of the creep
        this.bubblesCreep.push(this.add.existing(new Bubble(this,
            0,
            this.overlord.y + this.overlord.height / 2 + gameOptions.gameHeight * this.distances[1],
            this.textsCreep[0],
            'bottomLeft')).setDepth(3));

        // Creep
        this.creep = this.add.image(
            gameOptions.gameWidth * creepX,
            this.bubblesCreep[0].bottomY + gameOptions.gameHeight * this.distances[2],
            'creep'
        ).setDepth(4);

        // 2nd talk: First bubble for the overlord
        this.bubblesOverlord.push(this.add.existing(new Bubble(this,
            0,
            gameOptions.gameHeight * firstY,
            this.textsOverlord[1],
            'bottomRight')).setDepth(1).setVisible(false));     // make it invisible (show it later when button "Flying is pressed"


        // 2nd: First bubble of the creep
        this.bubblesCreep.push(this.add.existing(new Bubble(this,
            0,                                                      // position will be set later!
            0,
            this.textsCreep[1],
            'bottomLeft')).setDepth(3).setVisible(false));     // make it invisible (show it later when button "Flying is pressed"

        // --------------------
        // Buttons
        // --------------------

        // add flying button
        this.buttons.push(this.add.existing(new Button(this,
            gameOptions.gameWidth * 0.5,
            this.bubblesCreep[0].y + gameOptions.gameHeight * this.distances[3],
            '...flying?'
        )).setDepth(5));

        // add the thanks button
        this.buttons.push(this.add.existing(new Button(this,
            gameOptions.gameWidth * 0.5,
            this.bubblesCreep[1].y + gameOptions.gameHeight * this.distances[3],
            'Thanks!'
        )).setDepth(5).setVisible(false));

    }

    // create the texts for the overlord and the creep
    createTexts() {

        // fixed text parts (mainly spaces)
        const buttonSpace = '\n\n\n\n';             // space needed for a button

        // overlord texts
        this.textsOverlord.push(
            'I will send you on ' + gameOptions.numLevels + ' missions into the outer space to find my lost birds.\n' +
            'Every mission consists of the following steps:\n\n' +
            ' 1. Time estimation\n' +
            '2. Flying\n\n' +
            'Time estimation:\n' +
            'In this phase you can study the map, where you will see your starting point and the location of the birds.\n' +
            'Then you will tell me how much time you will need to collect all birds and and I will offer you some CREEPZ DOLLARZ (CZD).\n\n' +
            'The faster you think you are the more I will offer!'
        );

        this.textsOverlord.push(
            'Flying:\n' +
            'Our spaceships fly always in circles. ' +
            'You only need to press one button (tap / click the screen or press SPACE) to change direction. ' +
            'The arrows show you where the remaining birds are.\n\n' +
            'Avoid space debris! I will charge you ' + gameOptions.collisionPenalty.toString() + ' CZD for every crash!\n\n' +
            'If you make it within time you will get the CZDs I offered.\n' +
            'If you fail you need to pay me half of what I offered and try again.\n\n' +
            'Try to complete all missions and earn as much CZDs as possible.\n\n' +
            'Good luck!'
        );

        // creep texts
        this.textsCreep.push(
            'What about...' + buttonSpace
        );

        this.textsCreep.push(
            'Alright!' + buttonSpace
        );

    }

    // add all the actions to the buttons
    addButtonActions() {

        // "Flying" button
        this.buttons[0].button.on('pointerdown', this.secondTalk, this)   // show the second talk

        // "Thanks" button
        this.buttons[1].button.on('pointerdown', this.backToHome, this)   // go back to the menu

    }

    // make elements of the first talk invisible and add second talk
    secondTalk() {

        // do the action as soon as the camerafadeout is complete
        this.cameras.main.once('camerafadeoutcomplete', function(this: HowtoScene) {

            // make bubbles and buttons of first talk invisible
            this.bubblesOverlord[0].setVisible(false);
            this.bubblesCreep[0].setVisible(false);
            this.buttons[0].setVisible(false);

            // make bubbles of second talk visible
            this.bubblesOverlord[1].setVisible(true);
            this.bubblesCreep[1].setVisible(true);
            this.buttons[1].setVisible(true);

            // adjust positions of the bubbles, overlord, creep and button
            this.overlord.setY(this.bubblesOverlord[1].bottomY + gameOptions.gameHeight * this.distances[0]);
            this.bubblesCreep[1].setY(this.overlord.y + this.overlord.height / 2 + gameOptions.gameHeight * this.distances[1]);
            this.creep.setY(this.bubblesCreep[1].calculateBottomY() + gameOptions.gameHeight * this.distances[2]);
            this.buttons[1].setY(this.bubblesCreep[1].y + gameOptions.gameHeight * this.distances[3]);

            this.cameras.main.fadeIn(gameOptions.fadeInOutTime);           // fade out the camera

        }, this);

        this.cameras.main.fadeOut(gameOptions.fadeInOutTime);           // fade out the camera

    }

    // Go back to home
    backToHome() {

        // do the action as soon as the camerafadeout is complete
        this.cameras.main.once('camerafadeoutcomplete', function(this: HowtoScene) {
            this.scene.start('Home');      // go back to the menu
        }, this);

        this.cameras.main.fadeOut(gameOptions.fadeInOutTime);           // fade out the camera



    }

}