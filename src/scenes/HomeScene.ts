import Phaser from 'phaser';
import gameOptions from '../helper/gameOptions';
import Bubble from '../sprites/Bubble';

// "Home" scene: Main game menu scene
export default class HomeScene extends Phaser.Scene {

    private title!: Phaser.GameObjects.Text;
    private titleText!: string;
    private menuEntries!: string[];
    private inactiveStyle!: Phaser.Types.GameObjects.Text.TextStyle;
    private activeStyle!: Phaser.Types.GameObjects.Text.TextStyle;
    private selected!: number;
    private items!: Phaser.GameObjects.Text[];


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

        // menu entries
        this.menuEntries = [
            'FLY',
            'How to Play',
        ];

        this.inactiveStyle = {
            fontFamily: 'Arial',
            fontSize: '40px',
            color: '#ffff00',
            fontStyle: '',
        }

        this.activeStyle = {
            fontFamily: 'Arial',
            fontSize: '50px',
            color: '#0000ff',
            fontStyle: 'bold',
        }

        // initialize empty parameters
        this.selected = 0;
        this.items = [];

    }

    // Shows the home screen and waits for the user to select a menu entry
    create(): void {

        // Add background and images
        this.addBackgroundImages();

        // Create the menu with its entries
        this.createMenu(this.menuEntries);

        // Add keyboard inputs
        this.addKeys();

        // Add mobile controls
        this.addMobileControls();

    }

    // Adds the background and images
    addBackgroundImages() {

        // background
        this.add.image(0, 0, 'backgroundMenu').setOrigin(0).setDepth(0);

        // title
        this.title = this.add.text(
            gameOptions.gameWidth / 2,
            gameOptions.gameHeight * 0.1,
            this.titleText,
            gameOptions.textStyles[0]).setOrigin(0.5);

        // add first bubble
        this.add.existing(new Bubble(this,
            0,
            gameOptions.gameHeight * 0.2,
            'Hallo, I am the mighty OVERLORD and there is absolutely nothing to see here! We are just testing'
            ));


        // add the overlord
        this.add.image(
            gameOptions.gameWidth / 2,
            gameOptions.gameHeight * 0.5,
            'overlord'
        );

    }

    // Creates the menu with its entries and sets the styles for it
    createMenu(menuEntries: string[]): void {

        // start position and y space between the entries
        const start = {x: gameOptions.gameWidth / 2, y: this.title.y + gameOptions.gameHeight * 0.7};      // start position
        const ySpace = gameOptions.gameHeight * 0.1;                                         // ySpace between the entries

        // create menu items (loop through each item)

        let menuItemTemp: Phaser.GameObjects.Text;


        for (let i = 0;i < menuEntries.length; i++) {

            menuItemTemp = this.add.text(start.x, start.y + i * ySpace, menuEntries[i]);    // create menu entry
            menuItemTemp.setOrigin(0.5);                                                    // set origin
            menuItemTemp.setInteractive();                                                      // enable touch (controls will be set later

            this.items.push(menuItemTemp);

        }

        this.highlightSelected();         // highlight the selected entry
    }

    // Select the next menu entry (when clicking down)
    selectNext(): void {

        // select the next, or if it is the last entry select the first again
        if (this.selected >= this.items.length - 1) {
            this.selected = 0;              // select the first entry
        }
        else {
            this.selected++;                // select the previous entry
        }

        // highlight the selected entry
        this.highlightSelected();

    }

    // Select the previous menu entry (when clicking up)
    selectPrevious(): void {

        // select the previous, or if it is the first entry select the last again
        if (this.selected <= 0) {
            this.selected = this.items.length -1;   // select the last entry
        }
        else {
            this.selected--;                        // select the previous entry
        }

        // highlight the selected entry
        this.highlightSelected();

    }

     // Highlights the selected entry (changing the styles of the deselected and selected entries)
    highlightSelected(): void {

        for (let i in this.items) {
            this.items[i].setStyle(this.inactiveStyle);         // change the style of all entries to the inactive style
        }

        this.items[this.selected].setStyle(this.activeStyle);   // change the style of the selected entry to the active style

    }

     // Add keyboard input to the scene.
    addKeys(): void {

        // up and down keys (moving the selection of the entries)
        this.input.keyboard?.addKey('Down').on('down', function(this: HomeScene) { this.selectNext() }, this);
        this.input.keyboard?.addKey('S').on('down', function(this: HomeScene) { this.selectNext() }, this);
        this.input.keyboard?.addKey('Up').on('down', function(this: HomeScene) { this.selectPrevious() }, this);
        this.input.keyboard?.addKey('W').on('down', function(this: HomeScene) { this.selectPrevious() }, this);

        // enter and space key (confirming a selection)
        this.input.keyboard?.addKey('Enter').on('down', function(this: HomeScene) { this.spaceEnterKey() }, this);
        this.input.keyboard?.addKey('Space').on('down', function(this: HomeScene) { this.spaceEnterKey() }, this);

    }

    addMobileControls() {

        this.items[0].on('pointerdown', this.startGame, this);      // start game when the first entry is selected
        this.items[1].on('pointerdown', this.startHowTo, this);      // start game when the second entry is selected

    }

    // Action which happens when the enter or space key is pressed.
    spaceEnterKey() {

        switch(this.selected) {
            case 0:                 // start the game when the first entry is selected ("Start")
                this.startGame();
                break;
            case 1:                 // start the "Howto" scene when the "How To Play" entry is selected
                this.startHowTo();
                break;
            default:
                this.startGame();   // start the game by default
                break;
        }

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