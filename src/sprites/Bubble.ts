import Phaser from 'phaser';
import gameOptions from '../helper/gameOptions';

// Bubble class to create speech bubbles
export default class Bubble extends Phaser.GameObjects.Container {

    private readonly textString: string;                    // text which is shown in the bubble
    private readonly textX: number;                         // x position where the text starts (top left, relative to game width)
    private readonly arrowX: number                         // x position of the arrow from the edge (depending if left or right, relative to game width)
    private numElements!: number;                           // number of bubble elements needed for the text
    public text!: Phaser.GameObjects.Text;                 // text object
    private top!: Phaser.GameObjects.Image;                 // top element of the bubble
    private readonly middle: Phaser.GameObjects.Image[];            // middle elements of the bubble
    private bottom!: Phaser.GameObjects.Image;              // bottom element of the bubble
    private arrow!: Phaser.GameObjects.Image;               // arrow of the bubble

    // Constructor
    constructor(scene: Phaser.Scene, x: number, y: number, text: string, arrowPosition: string) {

        super(scene, x, y);

        // initialize variables
        this.textString = text;
        this.middle = [];

        // set parameters
        this.textX = 0.05;
        this.arrowX = 0.35;

        // add elements
        this.addTop();
        this.addText();
        this.addMiddle();
        this.addBottom();
        this.addArrow(arrowPosition);

        // ensure that the text is rendered last (so that it is on top)
        this.bringToTop(this.text);

    }

    // add the text part
    addText(): void {

        // set the style (add word wrapping
        const style = gameOptions.textStyles[2];
        style.wordWrap = {                                                          // set the width
            width: gameOptions.gameWidth - 2 * this.textX * gameOptions.gameWidth
        }

        this.text = new Phaser.GameObjects.Text(this.scene,
            gameOptions.gameWidth * this.textX,
            this.top.height,                                                        // the text should directly start below the top
            this.textString,
            style
        );

        this.add(this.text);           // add it to the container

    }

    // add the top part of the bubble
    addTop(): void {

        this.top = new Phaser.GameObjects.Image(this.scene, 0, 0, 'bubble', 0).setOrigin(0);
        this.add(this.top);                                 // add to the container

    }

    // add the middle parts of the bubble
    addMiddle(): void {

        this.numElements = Math.ceil(this.text.height / this.top.height);         // calculate how many middle elements are needed

        for (let i = 0; i < this.numElements; i++) {

            this.middle.push(new Phaser.GameObjects.Image(this.scene, 0, this.top.height * (i + 1), 'bubble', 1).setOrigin(0));

        }

        this.add(this.middle);              // add all elements to the container

    }

    // add the bottom part of the bubble
    addBottom(): void {

        this.bottom = new Phaser.GameObjects.Image(this.scene, 0, this.top.height * (this.numElements + 1), 'bubble', 0)
            .setOrigin(0)
            .setFlipY(true);                   // flip it for the bottom


        this.add(this.bottom);                 // add it to the container

    }

    // add the arrow of the bubble
    addArrow(position: string): void {

        // initialize positions and flip (fits for 'topLeft')
        let x = gameOptions.gameWidth * this.arrowX;
        let y = this.top.y;
        let flipX = false;
        let flipY = false;
        let originX = 0;

        if (position == 'topRight') {

            x = gameOptions.gameWidth * (1 - this.arrowX);
            flipX = true;
            originX = 1;

        }
        else if (position == 'bottomLeft') {

            y = this.bottom.y;
            flipY = true

        }
        else if (position == 'bottomRight') {

            x = gameOptions.gameWidth * (1 - this.arrowX);
            y = this.bottom.y;
            flipX = true;
            flipY = true;
            originX = 1;

        }

        this.arrow = new Phaser.GameObjects.Image(this.scene, x, y, 'bubbleArrow')
            .setOrigin(originX, 0)
            .setFlip(flipX, flipY);


        this.add(this.arrow);                 // add it to the container

    }

}