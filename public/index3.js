var app = new PIXI.Application({
    width: 300, height: 150, backgroundColor: 0x55AAFF, resolution: (window.devicePixelRatio || 1) * 1 ,
});

document.body.appendChild(app.view);

app.stop();

PIXI.Loader.shared
    .add('spritesheet', 'assets/anim/squirrel.json')
    .add('maple', 'assets/img/autumn_maple.png')
    .load(onAssetsLoaded);

var keys = {};

for (var i = 8; i<223; i++) {
    keys[i] = false;
}
document.addEventListener('keydown', function(event) {
    keys[event.keyCode] = true;
});
document.addEventListener('keyup', function(event) {
    keys[event.keyCode] = false;
});

class Character extends PIXI.Container {
    constructor(spritesheet, autoUpdate = true) {
        super();
        this.sheet = spritesheet;
        this._currState = undefined;
        this._frame = 0;
        this.sprites = {};
        // TODO: More robust frame duration management
        this.animationSpeed = 0.1;
        this.anchor = new PIXI.ObservablePoint(function () {
            Object.entries(this.sprites).forEach(function (sprite) {
                sprite._anchor.set(this.anchor);
            }, this);
        }, this);
    }

    // Sets the animation state of the character. If no frame number is provided, current frame is wrapped to fit next animation state.
    setState(state, frame = undefined) {
        // verify animation exists in the sprite
        if(!this.sprites[state]){
            console.error("Animation '"+state+"' does not exist in character")
            return -1;
        }
        // return if already in correct state
        if(this.currState == state){
            return;
        }
        // hide current animation
        if(this.currState){
            this.sprites[this.currState].visible = false;
        }
        // update state
        this.currState = state;
        // set frame number if provided
        if(frame){
            this._frame = frame;
        }
        // wrap current frame if no frame number specified
        this._frame = this._frame % this.sprites[this.currState].totalFrames;
        // show and play animation
        this.sprites[this.currState].visible = true;
        this.sprites[this.currState].gotoAndPlay(this._frame);
    }

    play() {
        this.sprites[this.currState].play();
    }
    stop() {
        this.sprites[this.currState].stop();
    }

    get currFrame() {

    }
    set currFrame(num) {
        
    }
    get currTime() {
        
    }
    set currTime(time) {
        
    }

    // Adds animations to character from TexturePacker-style sheet.
    loadTexturePackerFrames(frame_duration) {
        Object.entries(this.sheet.animations).forEach(function ([key, value]) {
            this.sprites[key] = this.addChild(new PIXI.AnimatedSprite(value));
            this.sprites[key].visible = false;
            this.sprites[key].anchor = this.anchor;
            this.sprites[key].animationSpeed = this.animationSpeed;
        }, this);
    }

    // Adds animations to character from Aseprite-style sheet. WARNING: This may rely on PIXI Spritesheet class internals.
    loadAsepriteFrames() {
        Object.entries(this.sheet.data.meta.frameTags).forEach(function ([key, value]) {
            // setup list of frames of the animation
            var frames = [];
            
            if (value.direction == "forward" || value.direction == "pingpong") {
                for (var i = value.from; i<value.to+1; i++){
                    // get name of frame in spritesheet
                    var frameKey = this.sheet._frameKeys[i];
                    // push texture onto list of frames
                    for(var t = 0; t < this.sheet._frames[frameKey].duration; t+=50) {
                        frames.push(this.sheet.textures[frameKey]);
                    }
                }
            } else if (value.direction == "reverse" || value.direction == "pingpong") {
                for (var i = value.to; i>value.from-1; i--){
                    if (value.direction == "pingpong" && i == value.to) {
                        continue;
                    }
                    // get name of frame in spritesheet
                    var frameKey = this.sheet._frameKeys[i];
                    // push texture onto list of frames
                    for(var t = 0; t < this.sheet._frames[frameKey].duration; t+=50) {
                        frames.push(this.sheet.textures[frameKey]);
                    }
                }
            }
            // add animation to character
            this.sprites[value.name] = this.addChild(new PIXI.AnimatedSprite(frames, false));
            // initialize visibility to false
            this.sprites[value.name].visible = false;
            this.sprites[value.name].anchor = this.anchor;
        }, this);
    }

    update(){
        this._frame = (this._frame+1) % this.sprites[this.currState].totalFrames;
        this.sprites[this.currState].gotoAndStop(this._frame);
    }
}

var sqrl;
function onAssetsLoaded() {
    // create an array to store the textures
    var explosionTextures = [];
    var i;

    var sheet = PIXI.Loader.shared.resources["spritesheet"].spritesheet;
    var maple_texture = PIXI.Texture.from("maple");
    sheet.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST; 
    maple_texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST; 


    for (var i = 0; i<10; i++) {
        var maple = new PIXI.Sprite(maple_texture);
        maple.anchor.set(.5, 1);
        maple.x = Math.floor((Math.random())*400);
        console.log(app.stage.width);
        maple.y = 124;
        maple.scale.set(2*Math.round(Math.random())-1, 1);
        app.stage.addChild(maple);
    }
    
    sqrl = new Character(sheet);
    sqrl.x = 300;
    sqrl.y = 120;
    sqrl.anchor.set(0.5,1);
    sqrl.scale.set(1);
    sqrl.loadAsepriteFrames();
    sqrl.setState("idle");
    app.stage.addChild(sqrl);

    // start animating
    app.start();
}

var dt = 0;
app.ticker.maxFPS = 24;
var vy = 0;

app.ticker.add(function (delta){

    sqrl.update();

    if(sqrl.y<120) {
        vy += .5;
        if(vy>0){
            sqrl.setState("fall");
        }
    } else if(sqrl.y==120) {
        vy = 0;

        if (keys[37] || keys[39]) {
            sqrl.setState("run");
        } else {
            sqrl.setState("idle")
        }    
        if (keys[38] && vy >= 0) {
            sqrl.setState("jump");
            vy = -7;
        }
    } else {
        sqrl.y = 120;
        vy = 0;
    }

    console.log(vy);
    if (keys[37]) {
        sqrl.x -= 2;
        sqrl.scale.x = -1;
    } else if (keys[39]) {
        sqrl.x += 2;
        sqrl.scale.x = 1;
    }

    sqrl.y += vy;
});
