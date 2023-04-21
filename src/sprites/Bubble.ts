import Phaser from 'phaser';
import gameOptions from '../helper/gameOptions';

// Bubble class to create speech bubbles
export default class Bubble extends Phaser.GameObjects.Container {

    // Constructor
    constructor(scene: Phaser.Scene, x: number, y: number, text: string) {

        super(scene, x, y);

        // parameters
        const textX = 0.05;         // x position where the text starts (top left, relative to game width)
        const textY = 0.05;         // y position where the text starts (top left, relative to game width)

        // text
        const style = gameOptions.textStyles[1];
        style.wordWrap = {                                      // set the width
                width: gameOptions.gameWidth - 2 * textX * gameOptions.gameWidth
            }

        const bubbleText = new Phaser.GameObjects.Text(scene,
            gameOptions.gameWidth * textX,
            gameOptions.gameWidth * textY,
            text,
            style
        );

        this.add(bubbleText);           // add it to the container

        // top
        const topSprite = new Phaser.GameObjects.Image(this.scene, 0, 0, 'bubble', 0).setOrigin(0);
        const elementHeight = topSprite.height;             // height of one element

        this.add(topSprite);                                // add to the container

        // middle elements
        let numElements = Math.ceil(bubbleText.height / elementHeight) - 1;

        if (numElements < 1) {
            numElements = 1;
        }

        for (let i = 0; i < numElements; i++) {

            this.add(new Phaser.GameObjects.Image(this.scene, 0, elementHeight * (i + 1), 'bubble', 1).setOrigin(0));

        }

        // bottom
        this.add(new Phaser.GameObjects.Image(this.scene, 0, elementHeight * (numElements + 1), 'bubble', 2).setOrigin(0));

        // ensure that the text is rendered last (so that it is on top)
        this.bringToTop(bubbleText);

    }

}