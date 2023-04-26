import Phaser from 'phaser';
import WebFontFile from "../helper/WebFontFile";

// images
import bgImg from '../assets/images/background.png';
import shipImg from '../assets/images/ship.png';
import blockImg from '../assets/images/block.png';
import objectiveImg from '../assets/images/objective.png';
import placeholderImg from '../assets/images/placeholder.png';
import indicatorImg from '../assets/images/indicator.png';
import timeChangerImg from '../assets/images/timechanger.png';
import backgroundMapImg from '../assets/images/backgroundMap.png';
import frameMapImg from '../assets/images/frameMap.png';
import backgroundMenuImg from '../assets/images/backgroundMenu.png';
import backgroundEstimateImg from '../assets/images/backgroundEstimate.png';
import bubbleImg from '../assets/images/bubble.png';
import bubbleArrowImg from '../assets/images/bubble-arrow.png';
import overlordImg from '../assets/images/overlord.png';
import creepImg from '../assets/images/creep.png';
import birdImg from '../assets/images/bird.png';
import birdSmallImg from '../assets/images/birdSmall.png';
import buttonImg from '../assets/images/button.png';
import particleImg from '../assets/images/particle.png';
import uiFlyImg from '../assets/images/uiFly.png';

// audio
import clickAudio from '../assets/audio/click.mp3';
import mapAudio from '../assets/audio/map.mp3';
import musicAudio from '../assets/audio/music.mp3';
import birdAudio from '../assets/audio/bird.mp3';
import engineAudio from '../assets/audio/engine.mp3';
import crashAudio from '../assets/audio/crash.mp3';
import warningAudio from '../assets/audio/warning.mp3';

// Levels
import level0Json from '../assets/json/level0.json';
import level1Json from '../assets/json/level1.json';
import level2Json from '../assets/json/level2.json';
import level3Json from '../assets/json/level3.json';
import level4Json from '../assets/json/level4.json';
import level5Json from '../assets/json/level5.json';


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
        this.load.image('indicator', indicatorImg);
        this.load.image('backgroundMap', backgroundMapImg);
        this.load.image('frameMap', frameMapImg);
        this.load.image('backgroundMenu', backgroundMenuImg);
        this.load.image('backgroundEstimate', backgroundEstimateImg);
        this.load.image('overlord', overlordImg);
        this.load.image('creep', creepImg);
        this.load.image('bird', birdImg);
        this.load.image('birdSmall', birdSmallImg);
        this.load.image('button', buttonImg);
        this.load.image('particle', particleImg);
        this.load.image('bubbleArrow', bubbleArrowImg);
        this.load.image('uiFly', uiFlyImg);

        // load sprite sheets
        this.load.spritesheet('bubble', bubbleImg, {frameWidth: 540, frameHeight: 29});
        this.load.spritesheet('timeChanger', timeChangerImg, {frameWidth: 55, frameHeight: 59});

        // load audio
        this.load.audio('click', clickAudio);
        this.load.audio('map', mapAudio);
        this.load.audio('music', musicAudio);
        this.load.audio('bird', birdAudio);
        this.load.audio('engine', engineAudio);
        this.load.audio('crash', crashAudio);
        this.load.audio('warning', warningAudio);

        // load json
        this.load.json('level0', level0Json);
        this.load.json('level1', level1Json);
        this.load.json('level2', level2Json);
        this.load.json('level3', level3Json);
        this.load.json('level4', level4Json);
        this.load.json('level5', level5Json);

        // load fonts
        this.load.addFile(new WebFontFile(this.load, 'Orbitron'));

    }

    // Add the animations and change to "Home" scene, directly after loading
    create() {

        this.scene.start('Home');

        // Debug stuff

        //this.scene.start('Points', {level: 2, points: 300, time: 100, expectedPoints: 2000, collisions: 2, successful: false});
        //this.scene.start('HowTo');
        /*this.scene.start('Points', {level: 1, points: 0, time: 0,
            expectedPoints: 3000,
            collisions: 2,
            successful: true
        });*/
    }

}