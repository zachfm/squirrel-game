const app = new PIXI.Application({ backgroundColor: 0x1099bb });
document.body.appendChild(app.view);


function setup() {
    let sheet = PIXI.Loader.shared.resources["assets/anim/examplesheet.json"].spritesheet;
    // create a new Sprite from an image path.
    const bunny_texture = PIXI.Texture.from('assets/items/dead_goldfish.png');
    var bunny = new PIXI.Sprite(bunny_texture);
    var squirrel = new PIXI.AnimatedSprite(sheet.textures['squirrel 13.aseprite']);
    // center the sprite's anchor point
    bunny.anchor.set(0.5);

    // move the sprite to the center of the screen
    bunny.x = app.screen.width / 2;
    bunny.y = app.screen.height / 2;

    var circle = new PIXI.Graphics();
    circle.beginFill(0x5cafe2);
    circle.drawRect(0, 0, 80,80);
    circle.x = 320;
    circle.y = 180;
    squirrel.x = 200;
    squirrel.y = 100;

    console.log(bunny.x)

    app.stage.addChild(bunny);
    app.stage.addChild(squirrel);
    //app.stage.addChild(circle);

    app.ticker.add(() => {
        // just for fun, let's rotate mr rabbit a little
        bunny.rotation += 0.1;
        circle.rotation += .1;

    });
}

PIXI.Loader.shared
    .add("assets/anim/squirrel.json")
    .add("assets/anim/squirrel.png")
    .load(setup);


