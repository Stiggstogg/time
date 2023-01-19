import Phaser from 'phaser';

// Sprite class
export default class Sponge extends Phaser.GameObjects.Sprite {

    private readonly speed: number;

    // Constructor
    constructor(scene: Phaser.Scene, x: number, y: number) {

        super(scene, x, y, 'sponge');
        this.setInteractive();

        this.on('pointerdown', this.click);

        this.speed = 10;     // movement speed of the sprite

    }

    // Action which should happen when the sprite is clicked
    click(_pointer: Phaser.Input.Pointer): void {               // remove underscore if pointer is used
        console.log('spongibongy');
        this.scene.scene.start('Home');
    }

    // Move the sprite
    move(direction: string): void {

        switch(direction) {
            case 'up':                   // movement up
                this.y -= this.speed;
                break;
            case 'down':                 // movement down
                this.y += this.speed;
                break;
            case 'left':                 // movement left
                this.x -= this.speed;
                break;
            default:                     // movement right (by default)
                this.x += this.speed;
                break;
        }

    }

}