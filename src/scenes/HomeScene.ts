import Phaser from 'phaser';
import gameOptions from '../helper/gameOptions';
import Bubble from '../sprites/Bubble';
import Button from "../sprites/Button";

// "Home" scene: Main game menu scene
export default class HomeScene extends Phaser.Scene {

    private titleText!: string;
    private textOverlord!: string;
    private textCreep!: string;
    private buttonGo!: Button;
    private buttonHow!: Button;


    // Constructor
    constructor() {
        super({
            key: 'Home'
        });
    }

    // Initialize parameters
    init(): void {

        // title text
        this.titleText = 'Birds!';

        // texts
        this.textOverlord = 'I am the mighty OVERLORD!\n\n' +
            'I invaded earth and built many G5 towers. ' +
            'Unfortunately, because of the electromagnetic radiation my SPY BIRDS got lost and flew into space.\n' +
            'The faster you find them the more CREEPZ DOLLARZ (CZD) you will get!\n\n' +
            'Who will take over this noble task?';

        this.textCreep = 'Me, my mighty OVERLORD!\n\n\n\n' +
            'Can you show me... \n\n\n\n'

    }

    // Shows the home screen and waits for the user to select a menu entry
    create(): void {

        // Create all the elements for the menu
        this.createElements();

        // Add the button actions
        this.addButtonActions();

    }

    // Create all menu elements (buttons, bubbles, title,...)
    createElements() {

        // background
        this.add.image(0, 0, 'backgroundMenu').setOrigin(0).setDepth(0);

        // title
        this.add.text(
            gameOptions.gameWidth / 2,
            gameOptions.gameHeight * 0.1,
            this.titleText,
            gameOptions.textStyles[0]).setOrigin(0.5);

        // add overlord bubble
        this.add.existing(new Bubble(this,
            0,
            gameOptions.gameHeight * 0.15,
            this.textOverlord,
            'bottomRight'));


        // add the overlord
        this.add.image(
            gameOptions.gameWidth * 0.83,
            gameOptions.gameHeight * 0.55,
            'overlord'
        );

        // add the bird
        this.add.image(
            gameOptions.gameWidth * 0.3,
            gameOptions.gameHeight * 0.625,
            'bird'
        ).setOrigin(0.5, 1);

        // add the creep bubble
        this.add.existing(new Bubble(this,
            0,
            gameOptions.gameHeight * 0.61,
            this.textCreep,
            'bottomLeft'));

        // add the creep
        this.add.image(
            gameOptions.gameWidth * 0.17,
            gameOptions.gameHeight * 0.92,
            'creep'
        );

        // add the lets go go button
        this.buttonGo = this.add.existing(new Button(this,
            gameOptions.gameWidth * 0.5,
            gameOptions.gameHeight * 0.7,
            'LET\'S GO!'
        ));

        // add the lets go button
        this.buttonHow = this.add.existing(new Button(this,
            gameOptions.gameWidth * 0.5,
            gameOptions.gameHeight * 0.81,
            '...how?'
        ));

    }

    // add all the actions to the buttons
    addButtonActions() {

        // "Let's Go" button
        this.buttonGo.button.on('pointerdown', this.startGame, this)   // start the game when this button is pressed

        // "how?" button
        this.buttonHow.button.on('pointerdown', this.startHowTo, this)   // go to the tutorial when this button is pressed

    }

    // Start game
    startGame() {

        this.scene.start('Estimate', {level: 1, points: 0});        // start first estimation scene with 0 points

    }

    // Start How To Play
    startHowTo() {

        this.scene.start('HowTo');      // start "How to Play" scene

    }

}