import Phaser from 'phaser';
import bgImg from '../assets/images/background.png';
import shipImg from '../assets/images/ship.png';
import blockImg from '../assets/images/block.png';
import objectiveImg from '../assets/images/objective.png';
import placeholderImg from '../assets/images/placeholder.png';
import level1Json from '../assets/json/level1.json';

// "Loading" scene: Loads all assets and shows a progress bar while loading
export default class LoadingScene extends Phaser.Scene {

    private gameWidth!: number;
    private gameHeight!: number;

    // constructor
    constructor() {
        super({
            key: 'Loading'
        });

    }

    // Initialize parameters
    init(): void {

        // get game width and height
        this.gameWidth = Number(this.sys.game.config.width);
        this.gameHeight = Number(this.sys.game.config.height);
        
    }

    // Load all assets (for all scenes)
    preload(): void {

        // show logo
        this.add.sprite(this.gameWidth/2, this.gameHeight/2, 'logo').setScale(1, 1); // logo is already preloaded in 'Boot' scene

        // text
        this.add.text(this.gameWidth/2, this.gameHeight * 0.20, 'CLOWNGAMING', {fontSize: '70px', color: '#FFFF00', fontStyle: 'bold'}).setOrigin(0.5);
        this.add.text(this.gameWidth/2, this.gameHeight * 0.73, 'Loading', {fontSize: '30px', color: '#27FF00'}).setOrigin(0.5);

        // progress bar background (e.g grey)
        const bgBar = this.add.graphics();
        const barW = this.gameWidth * 0.3;            // progress bar width
        const barH = barW * 0.1;          // progress bar height
        const barX = this.gameWidth / 2 - barW / 2;       // progress bar x coordinate (origin is 0, 0)
        const barY = this.gameHeight * 0.8 - barH / 2   // progress bar y coordinate (origin is 0, 0)
        bgBar.setPosition(barX, barY);
        bgBar.fillStyle(0xF5F5F5, 1);
        bgBar.fillRect(0, 0, barW, barH);    // position is 0, 0 as it was already set with ".setPosition()"

        // progress bar
        const progressBar = this.add.graphics();
        progressBar.setPosition(barX, barY);

        // listen to the 'progress' event (fires every time an asset is loaded and 'value' is the relative progress)
        this.load.on('progress', function(value: number) {

            // clearing progress bar (to draw it again)
            progressBar.clear();

            // set style
            progressBar.fillStyle(0x27ff00, 1);

            // draw rectangle
            progressBar.fillRect(0, 0, value * barW, barH);

        }, this);

        // load images
        this.load.image('background', bgImg);
        this.load.image('ship', shipImg);
        this.load.image('block', blockImg);
        this.load.image('objective', objectiveImg);
        this.load.image('placeholder', placeholderImg);

        // load audio
        //this.load.audio('miss', 'assets/audio/Pew.mp3');

        // load json
        this.load.json('level1', level1Json);

    }

    // Add the animations and change to "Home" scene, directly after loading
    create() {
        this.scene.start('Game', {
            level: 1
        });   // TODO: Change to menu scene as soon as it is ready
    }

}