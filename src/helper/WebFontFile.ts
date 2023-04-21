import Phaser from 'phaser';
import WebFontLoader from 'webfontloader';

export default class WebFontFile extends Phaser.Loader.File {

    private readonly fontNames: string | string[];
    private readonly service: string;

    /*
     * WebFont Loader from: https://blog.ourcade.co/posts/2020/phaser-3-google-fonts-webfontloader/
     * Loads web fonts before text is created (in 'Loading' scene preload) by using 'Web Font Loader' library and
     * Phasers 'File' class
     * Loader: Loader which handles loading all external content
     * fontNames: Name of the font(s) we want to load
     * service: Source / service from where we want to load the font
     */
    constructor(loader: Phaser.Loader.LoaderPlugin, fontNames: string | string[], service = 'google')
    {
        super(loader, {
            type: 'webfont',            // types of the file we are loading
            key: fontNames.toString()   // unique (within its file type) key
        })

        this.fontNames = Array.isArray(fontNames) ? fontNames : [fontNames] // add the font names as array (create an array if it is only a single font name)
        this.service = service              // add the service
    }

    /**
     * Loads the font(s).
     */
    load()
    {

        // create the configuration for the WebFontLoader
        const config: {[index: string]: any} = {                    // {[index: string]: any} was added to avoid typescript errors (say that strings are allowed as index)
            active: () => {                                         // 'active' function which is triggered when the fonts have rendered (are loaded)
                this.loader.nextFile(this, true)             // tell phaser that it is loaded
            }
        }

        // add the fonts (based on the service chosen)
        switch (this.service)
        {
            case 'google':                                          // loading of google fonts
                config['google'] = {
                    families: this.fontNames                        // add fonts to the 'google' config
                }
                break
            default:
                throw new Error('Unsupported font service')         // throw error if the service is not supported
        }

        WebFontLoader.load(config);                                 // load the web font(s) using the Web Font Loader
    }
}