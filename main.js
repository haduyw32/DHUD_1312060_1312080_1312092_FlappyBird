var state = {
    preload: function() { 
        game.load.image('bird', 'assets/bird2.png');
        game.load.image('pipe', 'assets/pipe.png');
        game.load.image('pipeBelow', 'assets/pipeBelow.png');
        game.load.image('pipeTop', 'assets/pipeTop.png');
        game.load.image('pipeTopBelow', 'assets/pipeTopBelow.png');
        game.load.image('background', 'assets/backgound.png');
        game.load.image('restartButton', 'assets/restartButton.png');
        game.load.image('scoreImage', 'assets/score.png');
        game.load.audio('fly', 'assets/fly.wav');
    },
    create: function() { 
        game.stage.backgroundImage = game.add.sprite(0, 0, 'background');
        game.physics.startSystem(Phaser.Physics.ARCADE);
        this.bird = game.add.sprite(100, 245, 'bird');
        this.restartButton = game.add.sprite(350, 245, 'restartButton'); 
        this.restartButton.inputEnabled = false;
        this.restartButton.visible = false;
        this.restartButton.events.onInputUp.add(function () {
            game.state.start('gameState'); 
        },this);
        this.game.input.onDown.add(function () {
            if(this.game.paused) {
                this.game.paused = false;
                game.state.start('gameState');
            }
            this.fly();
        },this);
        game.physics.arcade.enable(this.bird);
        this.bird.body.gravity.y = 1000;  
        var space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        space.onDown.add(this.fly, this);
        this.pipes = game.add.group(); 
        this.timer = game.time.events.loop(1500, this.addColumnPipes, this);
        this.score = 0;
        this.labelScore = game.add.text(20, 20, "0", { font: "30px Arial", fill: "#ffffff" });
        this.bird.anchor.setTo(-0.2, 0.5); 
        this.flySound = game.add.audio('fly');
    },
    update: function() {
        if (this.bird.y < 0 || this.bird.y > 490)
            this.stopGame();
        if (this.bird.angle < 20)
            this.bird.angle += 1; 
        game.physics.arcade.overlap(this.bird, this.pipes, this.stopGame, null, this);
    },

    fly: function() {
        this.bird.body.velocity.y = -350;
        var animation = game.add.tween(this.bird);
        animation.to({angle: -20}, 100);
        animation.start();
        if (this.bird.alive == false)
            return; 
        this.flySound.play(); 
    },
    stopGame: function() {
        this.game.paused = true;
        this.restartButton = game.add.sprite(370, 245, 'restartButton'); 
        this.restartButton.inputEnabled = true;
        this.restartButton.visible = true;
        this.labelScore.visible = false;
        this.labelScoreView = game.add.text(450, 120, this.score, { font: "60px Arial" , fill: "#d33d27" });
        this.ScoreImage = game.add.sprite(370, 160, 'scoreImage');
        count = 0;
    },
    addPipe: function(x, y, type) {
        var pipe = game.add.sprite(x, y, type);
        this.pipes.add(pipe);
        game.physics.arcade.enable(pipe);
        pipe.body.velocity.x = -200; 
        pipe.checkWorldBounds = true;
        pipe.outOfBoundsKill = true;
    },
    addColumnPipes: function() {
        var length = 800;
        var hole = Math.floor(Math.random() * 5) + 1;
        for (var i = 0; i < 8; i++)
            if (i < hole) {
                if (i == (hole - 1)) {
                    this.addPipe(length-2, i * 60, 'pipeTop');
                }
                else {
                    this.addPipe(length, i * 60, 'pipe');
                }
            }
            else if (i > hole + 1) {
                if (i == hole + 2) {
                    this.addPipe(length-2, i * 60, 'pipeTopBelow');
                }
                else {
                    this.addPipe(length, i * 60, 'pipeBelow');
                }
            }
        if (count > 1) {
            this.score += 1;
        }
        else {
            count++;
        }        
        this.labelScore.text = this.score;
    },
};
var game = new Phaser.Game(1024, 480);
var count = 0;
game.state.add('gameState', state); 
game.state.start('gameState');
