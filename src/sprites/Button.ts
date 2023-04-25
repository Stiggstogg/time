import Phaser from 'phaser';
import gameOptions from '../helper/gameOptions';

// Button class to create buttons
export default class Button extends Phaser.GameObjects.Container {

    button!: Phaser.GameObjects.Sprite;     // button sprite object
    private readonly textString: string;                    // text which is shown in the button
    private text!: Phaser.GameObjects.Text;         // text object with the button text
    private readonly textOffsetY: number;                   // offset of the text (slightly, relative to button height)

    // Constructor
    constructor(scene: Phaser.Scene, x: number, y: number, text: string) {

        super(scene, x, y);

        // initialize variables
        this.textString = text;
        this.textOffsetY = 0.13;

        // set button properties
        this.addButton();
        this.addText();

        // ensure that the text is rendered last (so that it is on top)
        this.bringToTop(this.text);

        // add sound when clicked
        this.addSound();

    }

    // add the text part
    addButton(): void {

        this.button = new Phaser.GameObjects.Sprite(this.scene,
            0,
            0,
            'button'
        );

        this.button.setInteractive();

        this.add(this.button);

    }

    // add the text part
    addText(): void {

        this.text = new Phaser.GameObjects.Text(this.scene,
            this.button.x,
            this.button.y - this.button.height * this.textOffsetY,
            this.textString,
            gameOptions.textStyles[3]
            ).setOrigin(0.5);

        this.add(this.text);

    }

    // add sound
    addSound() {

        const click = this.scene.sound.add('click');

        this.button.on('pointerdown', function() {
            click.play();
        })

    }

}