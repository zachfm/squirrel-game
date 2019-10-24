var app = new PIXI.Application({
    antialias: false,
    roundPixels: false
});
document.body.appendChild(app.view);

app.stop();

PIXI.loader
    .add('spritesheet', 'assets/anim/squirrel.json')
    .load(onAssetsLoaded);


function loadAnim(sheet) {
    var texture = PIXI.Texture.fromFrame('squirrel ' + (i + 1) + '.aseprite');
}
function onAssetsLoaded() {
    // create an array to store the textures
    var explosionTextures = [];
    var i;

    for (i = 0; i < 14; i++) {
        var texture = PIXI.Texture.fromFrame('squirrel ' + (i + 1) + '.aseprite');
        explosionTextures.push(texture);
    }

    for (i = 0; i < 50; i++) {
        // create an explosion AnimatedSprite
        var explosion = new PIXI.extras.AnimatedSprite(explosionTextures);
        explosion.animationSpeed = .1;
        explosion.x = Math.round(Math.random() * app.screen.width/8)*8;
        explosion.y = Math.round(Math.random() * app.screen.height/8)*8;
        explosion.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST; 
        //explosion.anchor.set(0.5);
        explosion.scale.set(8);
        explosion.gotoAndPlay(Math.round(Math.random() * 14));
        app.stage.addChild(explosion);
    }

    // start animating
    app.start();
}
