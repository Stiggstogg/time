// imports
import './style.css'
import Phaser from 'phaser'
import gameOptions from './helper/gameOptions'

// scene imports
import BootScene from './scenes/BootScene';
import LoadingScene from './scenes/LoadingScene';
import HomeScene from './scenes/HomeScene';
import HowtoScene from './scenes/HowtoScene';
import EstimateScene from "./scenes/EstimateScene";
import OverviewScene from "./scenes/OverviewScene";
import GameScene from './scenes/GameScene';
import GameUIScene from './scenes/GameUIScene';
import PointsScene from './scenes/PointsScene';
import EditorScene from "./scenes/EditorScene";


// Phaser 3 config
const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: gameOptions.gameWidth,
    height: gameOptions.gameHeight,
    scene: [BootScene, LoadingScene, HomeScene,
        HowtoScene,
        EstimateScene, OverviewScene,
        GameScene, GameUIScene,
        PointsScene,
        EditorScene],
    title: 'TIME',                  // Shown in the console
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    //pixelArt: true,                                     // if true pixel perfect rendering is used
    backgroundColor: '#000000',
    physics: {
        default: 'matter',
        matter: {
            gravity: {y:0},
            debug: {
                showBody: false,
                lineColor: 0x000000,
                showStaticBody: false,
                staticLineColor: 0x000000,
                lineThickness: 3
            }
        }
    }
};

new Phaser.Game(config);