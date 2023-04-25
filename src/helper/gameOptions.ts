// CONFIGURABLE GAME OPTIONS
// changing these values will affect gameplay

class GameOptions {

    public readonly gameWidth: number;
    public readonly gameHeight: number;
    public readonly uiHeight: number;
    private readonly worldFactor: number;
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
    public readonly indicatorDistance: number;
    public readonly textStyles: Phaser.Types.GameObjects.Text.TextStyle[];
    public readonly numLevels: number;
    public readonly parTimePoints: number;
    public readonly zeroPointTimeFactor: number;
    public readonly collisionPenalty: number;


    constructor() {

        // ---------------------
        // Game and world area
        // ---------------------

        // Width and height of the game (canvas)
        this.gameWidth = 540;
        this.gameHeight = 1140;

        // Height of the UI (in the game scene)
        this.uiHeight = 50;

        // factor to calculate the world size
        this.worldFactor = 3;

        // Width and height of the world
        this.worldWidth = this.gameWidth * this.worldFactor;
        this.worldHeight = this.gameHeight * this.worldFactor;

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

        // ---------------------
        // Indicator properties
        // ---------------------
        this.indicatorDistance = 0.05               // distance of the indicator from the boundary (relative to game width)

        // ---------------------
        // Levels
        // ---------------------
        this.numLevels = 2;                         // number of levels


        // ---------------------
        // Text styles
        // ---------------------

        this.textStyles = [];

        // Text style 0: Title
        this.textStyles.push({
            fontFamily: 'Orbitron',
            fontSize: '100px',
            color: '#FFFF00',
            fontStyle: 'bold'
        });

        // Text style 1:Bubble text but highlighted
        this.textStyles.push({
            fontFamily: 'Orbitron',
            fontSize: '32px',
            color: '#000000',
            fontStyle: 'bold'
        });

        // Text style 2: Text in bubbles
        this.textStyles.push({
            fontFamily: 'Orbitron',
            fontSize: '24px',
            color: '#000000',
            fontStyle: ''
        });

        // Text style 3: Text on buttons
        this.textStyles.push({
            fontFamily: 'Orbitron',
            fontSize: '32px',
            color: '#ffffff',
            fontStyle: 'bold'
        });

        // Text style 4: Text for titles in the different screens
        this.textStyles.push({
            fontFamily: 'Orbitron',
            fontSize: '48px',
            color: '#ffffff',
            fontStyle: 'bold'
        });

        // Text style 5: Fly UI text
        this.textStyles.push({
            fontFamily: 'Orbitron',
            fontSize: '32px',
            color: '#ffffff',
            fontStyle: 'bold'
        });

        // Text style 6: Text on the map
        this.textStyles.push({
            fontFamily: 'Orbitron',
            fontSize: '96px',
            color: '#000000',
            fontStyle: 'bold'
        });

        // Text style 7: Explanation text on the map
        this.textStyles.push({
            fontFamily: 'Orbitron',
            fontSize: '72px',
            color: '#5e432d',
            fontStyle: 'bold'
        });

        // -----------------------------
        // Parameters for point system
        // -----------------------------

        this.parTimePoints = 4723;          // the amount of points you will get when you exactly estimate the par time
        this.zeroPointTimeFactor = 2;       // if multiplied with the par time, this is the time where you will get exactly 0 points
        this.collisionPenalty = 100;            // the amount of points you loose when you crash


    }

}

export default new GameOptions();