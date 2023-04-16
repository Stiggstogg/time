// CONFIGURABLE GAME OPTIONS
// changing these values will affect gameplay

class GameOptions {

    public readonly gameWidth: number;
    public readonly gameHeight: number;
    public readonly widthFactor: number;
    private readonly heightFactor: number;
    public readonly worldWidth: number;
    public readonly worldHeight: number;
    public readonly shipSpeed: number;
    public readonly shipRotationSpeed: number;
    public readonly shipFrictionAir: number;
    public readonly shipBounce: number;
    public readonly shipTumblingTime: number;
    public readonly shipSaveZoneFactor: number;
    private readonly shipTumblingRotationFactor: number;
    public readonly shipTumblingRotationSpeed: number;


    constructor() {

        // ---------------------
        // Game and world area
        // ---------------------

        // Width and height of the game (canvas)
        this.gameWidth = 540;
        this.gameHeight = 1140;

        // factor to calculate the world width
        this.widthFactor = 3;
        this.heightFactor = this.widthFactor;

        // Width and height of the world
        this.worldWidth = this.gameWidth * this.widthFactor;
        this.worldHeight = this.gameHeight * this.heightFactor;

        // ---------------------
        // Ship properties
        // ---------------------

        // standard parameters (when flying)
        this.shipSpeed = 3;                         // speed of the ship
        this.shipRotationSpeed = 0.03;              // speed of the rotation
        this.shipFrictionAir = 0;                   // air friction of the ship while it is moving
        this.shipBounce = 0;                        // bounce of the ship
        this.shipTumblingTime = 500;                // amount of time the ship will tumple in ms
        this.shipTumblingRotationFactor = 20;        // factor of how much faster the ship rotates when it is tumbling
        this.shipTumblingRotationSpeed = this.shipRotationSpeed * this.shipTumblingRotationFactor;  // how fast the ship rotates when it is tumbling
        this.shipSaveZoneFactor = 1.3;              // Size of the circle which defines the safe zone for a ship after it collided

    }

}

export default new GameOptions();