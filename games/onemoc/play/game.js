"use strict";
(function () {
    var tweetScore;
    var MENU = 1;
    var HOWTOPLAY = 2;
    var GAME = 3;
    var gameState = MENU;
    var gameStartTime = 0;
    var TILEW = 32;
    var TILEH = 32;
    var w = 1024;
    var h = 768;
    var indicatorTexture = PIXI.Texture.fromImage("assets/indicator.png");
    var ballsTexture = PIXI.Texture.fromImage("assets/balls.png");
    var tilesTexture = PIXI.Texture.fromImage("assets/tiles.png");
    var menuStage = new PIXI.Stage(0x000000, false);
    var stage = new PIXI.Stage(0x000000, false);
    var renderer = PIXI.autoDetectRenderer(w, h);
    renderer.view.style.display = "block";

    var ballTextures = [];
    for (var i=0; i<4; ++i)
        ballTextures[i] = new PIXI.Texture(ballsTexture, { x:TILEW*i, y:0, width:TILEW, height:TILEH });

    var tileTextures = [];
    for (var i=0; i<4; ++i)
        tileTextures[i] = new PIXI.Texture(tilesTexture, { x:TILEW*i, y:0, width:TILEW, height:TILEH });

    function getRandomColor() {
        return 1 + Math.floor(2.99*Math.random());
    }

    var clock = new function() {
        var self = this;
        var sprites = [];
        var colors = [];
        var lastTime = -1;
        var clockTime = 0;
        var currentColor = 0;
        var running = true;

        var container = new PIXI.DisplayObjectContainer();
        stage.addChild(container);

        var arrowSpr = PIXI.Sprite.fromImage("assets/arrow.png");
        arrowSpr.position.x = 0;
        arrowSpr.position.y = 0;
        container.addChild(arrowSpr);

        function shuffleColors() {
            for (var i=0; i<10; ++i) {
                if (sprites[i]) {
                    container.removeChild(sprites[i]);
                    delete sprites[i];
                }
            }

            if (gameState == HOWTOPLAY) {
                colors = howToPlay.getColorsForClock();
            }
            else {
                var color = getRandomColor();
                for (var i=0; i<10; ++i) {
                    colors[i] = color;
                    if (i & 1) {
                        var newColor;
                        do {
                            newColor = getRandomColor();
                        } while (newColor == color);
                        color = newColor;
                    }
                }
            }

            for (var i=0; i<10; ++i) {
                sprites[i] = new PIXI.Sprite(tileTextures[colors[i]]);
                sprites[i].position.x = TILEW;
                sprites[i].position.y = i*TILEH + TILEH/2;
                container.addChild(sprites[i]);
            }
        }

        self.hideClock = function() {
            container.visible = false;
        }
        self.showClock = function() {
            container.visible = true;
        }
        self.reset = function() {
            shuffleColors();

            running = true;
            lastTime = -1;
            clockTime = 0;
            currentColor = 0;
        }
        self.currentColor = function() {
            return colors[currentColor];
        }
        self.stop = function() {
            running = false;
            lastTime = -1;
        }
        self.start = function() {
            running = true;
        }
        self.clockTime = function() {
            return clockTime;
        }
        self.update = function(time) {
            if (!container.visible)
                return;

            container.position.x = w/2 - tiles.w()*TILEW/2 - TILEW*2.5;
            container.position.y = h/2 - tiles.h()*TILEH/2 - TILEH;

            if (running) {
                if (lastTime < 0)
                    lastTime = time;

                clockTime += (time - lastTime) / 1000.0;
                lastTime = time;

                if (clockTime > 10) {
                    nextRound();
                }
            }

            arrowSpr.position.y = clockTime * arrowSpr.height;
            currentColor = Math.floor(clockTime);
            if (currentColor > 9)
                currentColor = 9;
        }

        function nextRound() {
            if (!score.nextRound()) {
                gameOver();
            }
            else {
                clockTime = 0;
                lastTime = -1;

                shuffleColors();
                tiles.clearTiles();
                player.fillTiles();
                player.resetCombo();
                tiles.regenerate();
            }
        }

        function gameOver() {
            clock.stop();
            player.gameOver();
        }

        return self;
    }

    function FadeTile(spriteSrc) {
        var self = this;
        var sprite = new PIXI.Sprite(spriteSrc.texture);
        sprite.position.x = spriteSrc.position.x + TILEW/2;
        sprite.position.y = spriteSrc.position.y + TILEH/2;
        sprite.pivot.x = TILEW/2;
        sprite.pivot.y = TILEH/2;
        spriteSrc.parent.addChild(sprite);

        var tween = new TWEEN.Tween({ scale: 1 })
            .to({ scale: 0 }, 1000)
            .easing(TWEEN.Easing.Exponential.Out)
            .onUpdate(function() {
                sprite.scale.x = this.scale;
                sprite.scale.y = this.scale;
            })
            .onComplete(function() {
                sprite.parent.removeChild(sprite);
            })
            .start();

        return self;
    }

    var tiles = new function() {
        var self = this;
        var data_w = 9;
        var data_h = 9;
        var data = [];
        var sprites = [];
        var container = new PIXI.DisplayObjectContainer();
        stage.addChild(container);

        var c = 0;
        for (var i=0; i<data_h; ++i) {
            for (var j=0; j<data_w; ++j, ++c) {
                sprites[c] = new PIXI.Sprite(tileTextures[0]);
                sprites[c].position.x = j*TILEW;
                sprites[c].position.y = i*TILEH;
                container.addChild(sprites[c]);
            }
        }

        function clear() {
            for (var i=0; i<data_h; ++i)
                for (var j=0; j<data_w; ++j)
                    data[i*data_w + j] = 0;
        }

        function put(u, v, value) {
            if (u >= 0 && v >= 0 && u < self.w() && v < self.h()) {
                if (value == 0 || data[v*data_w + u] == 0)
                    data[v*data_w + u] = value;
            }
        }

        self.reset = function() {
            clear();
        }
        self.clearTiles = function() {
            var c = 0;
            for (var i=0; i<data_h; ++i)
                for (var j=0; j<data_w; ++j, ++c)
                    new FadeTile(sprites[c]);

            clear();
        }
        self.update = function(time) {
            container.position.x = w/2 - data_w*TILEW/2;
            container.position.y = h/2 - data_h*TILEH/2;
        }
        self.container = function() {
            return container;
        }
        self.w = function() { return data_w; }
        self.h = function() { return data_h; }
        self.cx = function() { return Math.floor(data_w / 2); }
        self.cy = function() { return Math.floor(data_h / 2); }
        self.getAt = function(u, v) {
            return data[v*data_w + u];
        }
        self.fillPos = function(u, v) {
            var color = [];

            if (gameState == HOWTOPLAY) {
                color = howToPlay.getColorsForFill();
            }
            else {
                for (var i=0; i<4; ++i)
                    color[i] = getRandomColor();
            }

            put(u, v, 0);
            put((u-1), v, color[0]);
            put((u+1), v, color[1]);
            put(u, (v-1), color[2]);
            put(u, (v+1), color[3]);
        }
        self.regenerate = function() {
            var c = 0;
            for (var i=0; i<data_h; ++i) {
                for (var j=0; j<data_w; ++j, ++c) {
                    sprites[c].setTexture(tileTextures[data[c]]);
                }
            }
        }

        return self;
    }

    var player = new function() {
        var self = this;
        var x, y;
        var lastColor;
        var comboCounter;
        var failCounter;
        var gameOver;
        var gameOverText;
        var ballSprite = new PIXI.Sprite(ballTextures[0]);
        stage.addChild(ballSprite);

        self.reset = function() {
            if (gameOverText) {
                if (gameOverText.parent)
                    gameOverText.parent.removeChild(gameOverText);
                gameOverText = null;
            }

            gameOver = false;
            x = 0;
            y = 0;
            lastColor = -1;
            comboCounter = 0;
            failCounter = 0;

            ballSprite.position.x = 0;

            self.fillTiles();
        }
        self.pos = function() {
            return ballSprite.position;
        }
        self.fillTiles = function() {
            tiles.fillPos(x+tiles.cx(),
                          y+tiles.cy());
            tiles.regenerate();
        }
        self.update = function(time) {
            ballSprite.setTexture(ballTextures[clock.currentColor()]);

            if (ballSprite.position.x == 0) {
                ballSprite.position.x = tiles.container().position.x + (tiles.cx()+x)*TILEW;
                ballSprite.position.y = tiles.container().position.y + (tiles.cy()+y)*TILEH;
            }

            if (gameOverText) {
                gameOverText.position.x = w/2 - gameOverText.width/2;
                gameOverText.position.y = h/2 - gameOverText.height/2;
            }

            if (tweetScore.style.display == "block") {
                tweetScore.style.left = (w/2 - tweetScore.offsetWidth/2) + "px";
                tweetScore.style.top = (h/2 + tweetScore.offsetHeight*2) + "px";
            }
        }
        self.up = function() { move(x, y-1); }
        self.down = function() { move(x, y+1); }
        self.left = function() { move(x-1, y); }
        self.right = function() { move(x+1, y); }
        self.resetCombo = function() {
            lastColor = -1;
            comboCounter = 0;
        }
        self.updateByResize = function() {
            tiles.update();
            ballSprite.position.x = tiles.container().position.x + (tiles.cx()+x)*TILEW;
            ballSprite.position.y = tiles.container().position.y + (tiles.cy()+y)*TILEH;
        }
        self.gameOver = function() {
            tweetScore.style.display = "block";
            tweetScore.href =
                "https://twitter.com/home?status=I've+made+" +
                score.points() +
                "+points+on+ONEMOC+http://davidcapello.com/games/onemoc/+cc+@davidcapello";

            gameOver = true;
            gameOverText = new PIXI.Text("YOU HAVE MADE\n" +
                                         score.points() + " POINTS",
                                         { strokeThickness: 2,
                                           stroke: "#000",
                                           fill: "#fff",
                                           align: "center" });
            stage.addChild(gameOverText);
        }

        function canMove(u, v) {
            u += tiles.cx();
            v += tiles.cy();
            return (u >= 0 && v >= 0 && u < tiles.w() && v < tiles.h());
        }

        function move(u, v) {
            if (!gameOver && canMove(u, v)) {
                x = u;
                y = v;

                new TWEEN.Tween({ x: ballSprite.position.x,
                                  y: ballSprite.position.y })
                .to({ x: tiles.container().position.x + (tiles.cx()+x)*TILEW,
                      y: tiles.container().position.y + (tiles.cy()+y)*TILEH }, 100)
                .onUpdate(function() {
                    ballSprite.position.x = this.x;
                    ballSprite.position.y = this.y;
                })
                .start();

                var color = tiles.getAt(x+tiles.cx(), y+tiles.cy());
                if (clock.currentColor() == color) {
                    if (color == lastColor)
                        comboCounter++;
                    else {
                        comboCounter = 1;
                    }
                    lastColor = color;

                    score.addScore(10 * comboCounter);
                    failCounter = 0;
                }
                else {
                    lastColor = -1;
                    failCounter++;
                    score.removeScore(20 * failCounter);
                }

                self.fillTiles();
            }
        }

        return self;
    }

    function ScoreDecorator(text, color, pos) {
        var self = this;
        var text;

        text = new PIXI.Text(text, { strokeThickness: 2,
                                     stroke: "#000",
                                     fill: color,
                                     align: "center" });
        text.position.x = pos.x;
        text.position.y = pos.y-TILEH/2;
        stage.addChild(text);

        var tween = new TWEEN.Tween({ x: text.position.x,
                                      y: text.position.y })
            .to({ y: text.position.y-TILEH*0.75 }, 250)
            .easing(TWEEN.Easing.Exponential.Out)
            .onUpdate(function() {
                text.position.x = this.x;
                text.position.y = this.y;
            })
            .chain(new TWEEN.Tween({}).to({}, 100)
                   .onComplete(function() {
                       stage.removeChild(text);
                   }))
            .start();

        return self;
    }

    var score = new function() {
        var self = this;
        var container = new PIXI.DisplayObjectContainer();
        stage.addChild(container);
        var text;
        var score;
        var round;

        self.nextRound = function() {
            if (round == 6)
                return false;
            round++;
            return true;
        }
        self.reset = function() {
            score = 0;
            round = 1;
        }
        self.addScore = function(bonus) {
            score += bonus;
            new ScoreDecorator("+" + bonus, "#fff", player.pos());
        }
        self.removeScore = function(bonus) {
            score -= bonus;
            new ScoreDecorator("-" + bonus, "#f00", player.pos());
        }
        self.update = function(time) {
            if (text) {
                container.removeChild(text);
                text = null;
            }
            text = new PIXI.Text("TIME: " + Math.ceil(clock.clockTime()) + "\n" +
                                 "SCORE: " + score + "\n" +
                                 "ROUND: " + round + "/6",
                                 { fill: "#fff" });
            text.position.x = 4;
            text.position.y = 4;
            container.addChild(text);
        }
        self.points = function() {
            return score;
        }
    }

    var menu = new function() {
        var self = this;
        var title = new PIXI.Text("ONEMOC: 1 MINUTE OF COLORS",
                                 { strokeThickness: 4,
                                   stroke: "#ff0",
                                   fill: "#00",
                                   align: "center" })
        var copy = new PIXI.Text("(C) 2013 DAVID CAPELLO",
                                 { strokeThickness: 4,
                                   stroke: "#ff0",
                                   fill: "#00",
                                   align: "center" })
        var text = new PIXI.Text("PRESS ENTER\nCLICK OR TAP TO START",
                                 { strokeThickness: 4,
                                   stroke: "#ff0",
                                   fill: "#00",
                                   align: "center" });
        menuStage.addChild(title);
        menuStage.addChild(copy);
        menuStage.addChild(text);
        var y = 0;

        function update() { y = this.y; }

        self.update = function(time) {
            title.position.x = w/2 - title.width/2;
            title.position.y = h/2 - title.height*2;
            copy.position.x = w/2 - copy.width/2;
            copy.position.y = h - copy.height;
            text.position.x = w/2 - text.width/2;
            text.position.y = h/2 + Math.sin(Math.PI*time/1000)*16;
        }
    }

    var howToPlay = new function() {
        var self = this;
        var clockCalls = 0;
        var fillCalls = 0;
        var colorsForFill = [[ 1, 2, 1, 3 ],
                             [ 2, 1, 3, 2 ],
                             [ 1, 1, 2, 2 ],
                             [ 3, 1, 1, 1 ],
                             [ 1, 2, 1, 3 ],
                             [ 3, 3, 3, 3 ],
                             [ 2, 2, 2, 2 ],
                             [ 3, 3, 3, 3 ],
                             [ 2, 2, 2, 2 ] ];
        var colorsForClock = [[ 1, 1, 2, 2, 3, 3, 1, 1, 2, 2 ]];
        var movementClick = 0;
        var movementClicks = [ 0, 3, 6, 8, 9,
                               12, 13, 15, 18, 20,
                               22, 24, 26, 28, 30,
                               31, 32, 33 ];
        var movements = [
            // 1-5
            function() {
                showText("YOU ARE THIS THING");
                indicate(0, 32, 0, 0);
            },
            function() {
                clock.showClock();
                indicate(0, 0, -tiles.w()/2*TILEW, -tiles.h()/2*TILEW);
                showText("THIS INDICATES\nYOUR CURRENT COLOR");
            },
            function() {
                indicate(-tiles.w()/2*TILEW, -tiles.h()/2*TILEW,
                         -tiles.w()/2*TILEW, -tiles.h()/2);
                showText("IT CHANGES EVERY TWO SECONDS");
            },
            function() {
                clock.stop();
            },
            function() {
                indicate(-tiles.w()/2*TILEW, -tiles.h()/2, 0, 0);
                showText("USE ARROWS OR\nTAP A DIRECTION TO WALK");
            },
            // 6-10
            function() {
                deindicate();
                down();
            },
            function() {
                showText("WALK THROUGH THE SAME COLOR\nTO WIN POINTS!");
            },
            function() {
                down();
            },
            function() {
                showText("YOU LOSE POINTS\nIF YOU TOUCH OTHER COLORS");
            },
            function() {
                right();
            },
            // 11-15
            function() {
                up();
            },
            function() {
                hideText();
                clock.start();
            },
            function() {
                clock.stop();
                showText("MORE POINTS\nFOR MORE STEPS");
            },
            right,
            down,
            // 16-20
            left,
            left,
            function() {
                showText("ARE YOU READY?\nPRESS ENTER, CLICK OR TAP")
            }
        ];
        var container = new PIXI.DisplayObjectContainer();
        stage.addChild(container);
        var title = new PIXI.Text("HOW TO PLAY",
                                  { strokeThickness: 4,
                                    stroke: "#ff0",
                                    fill: "#00",
                                    align: "center" })
        var indicator = new PIXI.Sprite(indicatorTexture);
        var text;
        indicator.visible = false;
        container.addChild(indicator);
        container.addChild(title);

        function deindicate() {
            indicator.visible = false;
        }
        function indicate(startX, startY, x, y) {
            var tween = new TWEEN.Tween({ x:startX, y:startY })
                .to({ x:x, y:y }, 1000)
                .easing(TWEEN.Easing.Exponential.Out)
                .onUpdate(function() {
                    indicator.position.x = w/2 + this.x;
                    indicator.position.y = h/2 + this.y;
                })
                .start();

            indicator.visible = true;
        }

        function hideIndicator() {
            indicator.visible = false;
        }

        function hideText() {
            if (text)
                container.removeChild(text);
            text = null;
        }

        function showText(t) {
            if (text)
                container.removeChild(text);
            text = new PIXI.Text(t, { strokeThickness: 4,
                                      stroke: "#ff0",
                                      fill: "#00",
                                      align: "center" });
            positionText();
            container.addChild(text);
        }

        self.reset = function(state) {
            clockCalls = 0;
            fillCalls = 0;
            movementClick = 0;

            if (state == HOWTOPLAY) {
                clock.hideClock();
                stage.addChild(container);
            }
            else if (state == GAME) {
                clock.showClock();
                if (container.parent)
                    container.parent.removeChild(container);
            }
        }
        self.update = function(time) {
            title.position.x = w/2 - title.width/2;
            title.position.y = h/2 - TILEH*tiles.h()/2 - title.height;
            title.visible = (Math.sin(2 * Math.PI * time / 1000) > 0);

            if (text)
                positionText();

            if (time > movementClicks[movementClick] * 1000) {
                movements[movementClick]();
                movementClick++;
            }
        }
        self.getColorsForClock = function() {
            return colorsForClock[clockCalls++];
        }
        self.getColorsForFill = function() {
            return colorsForFill[fillCalls++];
        }

        function positionText() {
            text.position.x = w/2 - text.width/2;
            text.position.y = h/2 + TILEH*tiles.h()/2;
        }
        return self;
    }

    function startGame(newState) {
        gameState = newState;
        gameStartTime = -1;

        clock.reset();
        tiles.reset();
        score.reset();
        player.reset();
        howToPlay.reset(newState);
    }

    function init() {
        tweetScore = document.getElementById("tweet");
        window.addEventListener("keydown", anyKey);

        Hammer(renderer.view)
            .on("swipeleft", left)
            .on("swiperight", right)
            .on("swipeup", up)
            .on("swipedown", down)
            .on("tap", function(ev) {
                if (gameState == MENU) {
                    startGame(HOWTOPLAY);
                }
                else if (gameState == HOWTOPLAY) {
                    startGame(GAME);
                }
                else if (gameState == GAME &&
                         ev.gesture.touches &&
                         ev.gesture.touches.length > 0) {
                    var dx = ev.gesture.touches[0].pageX - (player.pos().x+TILEW/2);
                    var dy = ev.gesture.touches[0].pageY - (player.pos().y+TILEH/2);
                    if (Math.abs(dx) > Math.abs(dy)) {
                        if (dx < 0) left();
                        else right();
                    }
                    else {
                        if (dy < 0) up();
                        else down();
                    }
                }
            });

        document.body.appendChild(renderer.view);

        resize();
        requestAnimationFrame(update);
    }

    function resize() {
        w = window.innerWidth - 16;
        h = window.innerHeight - 16;
        player.updateByResize();
        renderer.resize(w, h);
    }

    function update(time) {
        switch (gameState) {
            case MENU:
                menu.update(time);
                renderer.render(menuStage);
                break;
            case HOWTOPLAY:
            case GAME:
                if (gameStartTime < 0)
                    gameStartTime = time;
                var t = time - gameStartTime;

                if (gameState == HOWTOPLAY)
                    howToPlay.update(t);

                score.update(t);
                clock.update(t);
                tiles.update(t);
                player.update(t);
                renderer.render(stage);
                break;
        }

        requestAnimFrame(update);
        TWEEN.update();
    }

    function up() { if (isPlaying()) player.up(); }
    function down() { if (isPlaying()) player.down(); }
    function left() { if (isPlaying()) player.left(); }
    function right() { if (isPlaying()) player.right(); }

    function isPlaying() {
        return (gameState == HOWTOPLAY ||
                gameState == GAME);
    }

    function anyKey(ev) {
        switch (gameState) {
            case MENU:
                if (ev.keyCode == 13 || ev.keyCode == 32)
                    startGame(HOWTOPLAY);
                break;
            case HOWTOPLAY:
                if (ev.keyCode == 13 || ev.keyCode == 32 ||
                    ev.keyCode == 27) {
                    startGame(GAME);
                }
                break;
            case GAME:
                switch (ev.keyCode) {
                    case 37: left(); break;
                    case 38: up(); break;
                    case 39: right(); break;
                    case 40: down(); break;
                    case 27:
                        gameState = MENU;
                        tweetScore.style.display = "none";
                        break;
                }
                break;
        }
    }

    document.addEventListener("DOMContentLoaded", function(event) {
        init();
    });

    resize();
    window.onresize = resize;
    window.onorientationchange = resize;
})();
