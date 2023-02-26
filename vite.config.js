export default {
    base: './',                         // set the base path (otherwise it will not work on itch.io!)
    build: {
        chunkSizeWarningLimit: 1500,   // increase chunk size warning limit from 500 KiB to 1500 as phaser is pretty big
        assetsInlineLimit: 0,           // avoids that referenced assets (pictures) are inlined as base64 URLs, as Phaser does not support them!
    }
}