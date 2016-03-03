window.setTimeout(function() {
    'use strict';
    console.log("game loading");

    //  命名空间构造函数
    function Namespace() {
        //  可以直接调用构造函数生成对象
        if (!(this instanceof Namespace)) {
            return new Namespace();
        }

        return this;
    }

    //  命名空间添加内部属性
    Namespace.prototype.createChain = function(nsString, callback) {
        var parts = nsString.split("."),
            undefined,
            parent = this,
            i = 0,
            len = 0;

        for (i = 0, len = parts.length; i < len; i++) {
            if (parent[parts[i]] === undefined) {
                parent[parts[i]] = {};
            }

            parent = parent[parts[i]];
        }

        if (typeof callback === "function") {
            callback();
        }

        return this;
    }

    //  一些工具函数命名空间
    var Util = Namespace();

    Util.createChain("Event.addHandler", function() {
        Util.Event.addHandler = function(element, type, handler) {
            if (element.addEventListener) {
                Util.Event.addHandler = function(element, type, handler) {
                    element.addEventListener(type, handler, false);
                }
            } else if (element.attachEvent) {
                Util.Event.addHandler = function(element, type, handler) {
                    element.addHandler("on" + type, handler);
                }
            } else {
                Util.Event.addHandler = function(element, type, handler) {
                    element["on" + type] = handler;
                }
            }

            Util.Event.addHandler(element, type, handler);
        }

    });

    Util.createChain("Event.removeHandler", function() {
        Util.Event.removeHandler = function(element, type, handler) {
            if (element.removeEventListener) {
                Util.Event.removeHandler = function(element, type, handler) {
                    element.removeEventListener(type, handler, false);
                }
            } else if (element.detachEvent) {
                Util.Event.removeHandler = function(element, type, handler) {
                    element.detachEvent("on" + type, handler);
                }
            } else {
                Util.Event.removeHandler = function(element, type, handler) {
                    element["on" + type] = null;
                }
            }

            Util.Event.removeHandler(element, type, handler);
        }
    });

    Util.createChain("Event.getEvent", function() {
        Util.Event.getEvent = function(event) {
            return event || window.event;
        }
    });

    Util.createChain("Event.getTarget", function() {
        Util.Event.getTarget = function(event) {
            return event.target || event.srcElement;
        }
    });

    Util.createChain("Event.stopPropagation", function() {
        Util.Event.stopPropagation = function(event) {
            if (typeof event.stopPropagation === "function") {
                Util.Event.stopPropagation = function(event) {
                    event.stopPropagation();
                }
            } else {
                Util.Event.stopPropagation = function(event) {
                    event.cancelBubble = true;
                }
            }

            Util.Event.stopPropagation(event);
        }
    });

    Util.createChain("Event.preventDefault", function() {
        Util.Event.preventDefault = function(event) {
            if (typeof event.preventDefault === "function") {
                Util.Event.preventDefault = function(event) {
                    event.preventDefault();
                }
            } else {
                Util.Event.preventDefault = function(event) {
                    event.returnValue = false;
                }
            }

            Util.Event.preventDefault(event);
        }
    });

    Util.createChain("Event.getCharCode", function() {
        Util.Event.getCharCode = function(event) {
            return typeof event.charCode === "number" ? event.charCode : event.keyCode;
        }
    })

    Util.createChain("Dom.editClassName", function() {
        Util.Dom.editClassName = function(element, option, classString) {
            if (element.classList) {
                Util.Dom.editClassName = function(element, option, classString) {
                    try {
                        element.classList[option](classString);
                    } catch (error) {
                        throw new Error("Edit className Error.");
                    }
                }
            } else {
                Util.Dom.editClassName = function(element, option, classString) {
                    var className = element.className.split(/\s+/),
                        isContains = false,
                        i = 0,
                        len = 0;

                    if (option === "add") {
                        className.push(classString);
                    } else {
                        for (i = 0, len = className; i < len; i++) {
                            if (className[i] === classString) {
                                isContains = true;
                                break;
                            }
                        }

                        if (option === "remove") {
                            className = isContains ? className.splice(i, 1) : className;
                        } else if (option === "contains") {
                            return isContains;
                        } else if (option === "toggle") {
                            className = isContains ? className.splice(i, 1) : className.push(classString);
                        } else {
                            throw new Error("Edit className Error.");
                        }
                    }

                    element.className = className.join(" ");
                }
            }
        }
    });

    Util.createChain("Dom.getComputedStyle", function() {
        Util.Dom.getComputedStyle = function(element) {
            if (typeof window.getComputedStyle === "function") {
                Util.Dom.getComputedStyle = function(element) {
                    return window.getComputedStyle(element, null);
                }
            } else {
                Util.Dom.getComputedStyle = function(element) {
                    return element.currentStyle;
                }
            }

            return Util.Dom.getComputedStyle(element);
        }
    });

    function Player(keyCode, name) {
        var i = 0,
            len = 0;

        if (!(this instanceof Player)) {
            return new Player(keyCode, name);
        }
        if (Object.prototype.toString(keyCode) !== "[object object]") {
            keyCode = {
                "UP": 87,
                "RIGHT": 68,
                "DOWN": 83,
                "LEFT": 65,
            };
        }

        this.speedLevel = 0;
        this.score = 0;
        this.keyCode = keyCode;
        this.name = name ? name : "S_" + (Math.random()).toString().slice(2);
    }

    Player.prototype.flushSpeedLevel = function() {
        console.log(this.speedLevel);
        if (this.score > this.speedLevel * this.speedLevel * 100) {
            this.speedLevel++;

        }
    };

    var snake = {
        "element": (function() {
            var snakeBody = document.getElementById("game").getElementsByClassName("snake-body");

            return Array.prototype.slice.call(snakeBody);
        }()),
        "position": {
            "x": [-1, -1, -1, -1, -1],
            "y": [-1, -1, -1, -1, -1]
        },
        "bodySize": (function() {
            var getComputedStyle = Util.Dom.getComputedStyle,
                snakeBodyStyle = getComputedStyle(document.getElementsByClassName("snake-body")[0]),
                snakeBodyWidth = parseInt(snakeBodyStyle.width),
                snakeBodyHeight = parseInt(snakeBodyStyle.height);

            return {
                "width": snakeBodyWidth,
                "height": snakeBodyHeight
            };
        }()),
        "generateNewBody": function() {
            var snakeBodyElem = this.element[this.element.length - 1],
                newBody = snakeBodyElem.cloneNode(true);

            return newBody;

        }
    };

    var bean = {
        "element": (function() {
            return document.getElementById("bean");
        }()),
        "position": {
            "x": -1,
            "y": -1
        },
        "size": (function() {
            var getComputedStyle = Util.Dom.getComputedStyle,
                beanStyle = getComputedStyle(document.getElementById("bean")),
                beanWidth = parseInt(beanStyle.width),
                beanHeight = parseInt(beanStyle.height);

            return {
                "width": beanWidth,
                "height": beanHeight
            };
        }()),
    };

    var scorePanel = {
        "element": (function() {
            var name = document.getElementById("player-name"),
                score = document.getElementById("player-score");
            return {
                "name": name,
                "score": score
            };
        }()),
        "flushScore": function(player) {
            scorePanel.element.name.innerHTML = player.name;
            scorePanel.element.score.innerHTML = player.score;
        }

    }

    var gameZone = {
        "size": (function() {
            var getComputedStyle = Util.Dom.getComputedStyle,
                gameZoneStyle = getComputedStyle(document.getElementById("game-zone")),
                gameZoneWidth = parseInt(gameZoneStyle.width),
                gameZoneHeight = parseInt(gameZoneStyle.height);

            return {
                "width": gameZoneWidth,
                "height": gameZoneHeight
            };
        }()),
        "cellSize": {
            "x": 0,
            "y": 0,
            "metaWidth": 0,
            "metaHeight": 0
        }
    }

    var gameControl = {
        "participants": [],
        "SNAKEDIRECTION": ["UP", "RIGHT", "DOWN", "LEFT"],
        "INITIALSPEED": 800,
        "MAXSPEEDLEVEL": 10,
        "init": function() {
            var eventUtil = Util.Event,
                player = new Player();

            this.participants.push({
                "player": player,
                "snake": snake,
                "currentDirection": "LEFT",
                "nextDirection": "LEFT"
            });
            this.calculateGameZoneCellSize();
            this.generateSnake();
            this.generateBean();
            eventUtil.addHandler(window, "keydown", this.keyPress);

            this.timeout = window.setTimeout(function() {
                gameControl.snakeRuning();
            }, this.INITIALSPEED);
        },
        "calculateGameZoneCellSize": function() {
            gameZone.cellSize.metaWidth = Math.max(bean.size.width, snake.bodySize.width);
            gameZone.cellSize.metaHeight = Math.max(bean.size.height, snake.bodySize.height);
            gameZone.cellSize.x = Math.floor(gameZone.size.width / gameZone.cellSize.metaWidth);
            gameZone.cellSize.y = Math.floor(gameZone.size.height / gameZone.cellSize.metaHeight);
        },
        "generateSnake": function() {
            var snakeElem = snake.element,
                snakePosition = snake.position,
                positionStart = this.getEmptyCell(),
                positionEnd = {},
                i = 0,
                len = 0;

            len = snakeElem.length;
            positionEnd.x = positionStart.x + len - 1;
            positionEnd.y = positionStart.y;

            while (!this.isEmptyCell(positionEnd)) {
                positionStart = this.getEmptyCell();
                positionEnd.x = positionStart.x + len - 1;
                positionEnd.y = positionStart.y;
                console.log(positionStart);
            }

            for (i = 0, len = snakeElem.length; i < len; i++) {
                this.putElement2Cell(snakeElem[i], positionStart);
                snakePosition.x[i] = positionStart.x;
                snakePosition.y[i] = positionStart.y;
                positionStart.x++;
            }

            console.log("Generate Snake Success");

        },
        "snakeGrowUp": function(position) {
            var game = document.getElementById("game-zone"),
                newBody = snake.generateNewBody();


            game.appendChild(newBody);
            snake.element.push(newBody);
            snake.position.x.push(position.x);
            snake.position.y.push(position.y);


            this.putElement2Cell(newBody, position);
        },
        "snakeRuning": function() {
            var that = gameControl,
                direction = that.participants[0].nextDirection,
                snakePosition = snake.position,
                newPosition = {},
                oldPosition = {},
                maxX = gameZone.cellSize.x,
                maxY = gameZone.cellSize.y,
                speedInterval = that.INITIALSPEED / (that.MAXSPEEDLEVEL + 1),
                speed = that.INITIALSPEED - that.participants[0].player.speedLevel * speedInterval;

            that.timeout = window.setTimeout(function() {
                that.snakeRuning();
            }, speed);

            if (direction === that.SNAKEDIRECTION[0]) {
                newPosition.x = snakePosition.x[0];
                newPosition.y = snakePosition.y[0] - 1;
            } else if (direction === that.SNAKEDIRECTION[1]) {
                newPosition.x = snakePosition.x[0] + 1;
                newPosition.y = snakePosition.y[0];
            } else if (direction === that.SNAKEDIRECTION[2]) {
                newPosition.x = snakePosition.x[0];
                newPosition.y = snakePosition.y[0] + 1;
            } else if (direction === that.SNAKEDIRECTION[3]) {
                newPosition.x = snakePosition.x[0] - 1;
                newPosition.y = snakePosition.y[0];
            }

            newPosition.x = newPosition.x < 0 ? newPosition.x + maxX : (newPosition.x >= maxX ? newPosition.x - maxX : newPosition.x);
            newPosition.y = newPosition.y < 0 ? newPosition.y + maxY : (newPosition.y >= maxY ? newPosition.y - maxY : newPosition.y);

            if (that.isGameOver(newPosition)) {
                that.gameOver();
            }

            that.participants[0].currentDirection = that.participants[0].nextDirection;

            oldPosition.x = snakePosition.x[snakePosition.x.length - 1];
            oldPosition.y = snakePosition.y[snakePosition.y.length - 1];

            that.putElement2Cell(snake.element[snake.element.length - 1], newPosition);

            snakePosition.x[snakePosition.x.length - 1] = newPosition.x;
            snakePosition.y[snakePosition.y.length - 1] = newPosition.y;

            snakePosition.x = that.exchangSnakeBody(snakePosition.x);
            snakePosition.y = that.exchangSnakeBody(snakePosition.y);
            snake.element = that.exchangSnakeBody(snake.element);

            if (that.isEatBean(newPosition)) {
                that.increaseScore();
                scorePanel.flushScore(that.participants[0].player);
                that.participants[0].player.flushSpeedLevel();
                that.generateBean();
                that.snakeGrowUp(oldPosition);
            }
            // this.snakeGrowUp(oldPosition);




        },
        "exchangSnakeBody": function(arr) {
            var temp = arr.pop();
            return [temp].concat(arr);
        },
        "generateBean": function() {
            var beanElem = bean.element,
                beanPosition = bean.position,
                position = this.getEmptyCell();

            this.putElement2Cell(beanElem, position);
            beanPosition.x = position.x;
            beanPosition.y = position.y;

            console.log("Generate Bean Success");
        },
        "getEmptyCell": function() {
            var gameZoneCell = gameZone.cellSize,
                position = {
                    "x": Math.floor(Math.random() * gameZoneCell.x),
                    "y": Math.floor(Math.random() * gameZoneCell.y)
                };

            while (!this.isEmptyCell(position)) {
                position.x = Math.floor(Math.random() * gameZoneCell.x);
                position.y = Math.floor(Math.random() * gameZoneCell.y);
            }

            return position;
        },
        "isEmptyCell": function(position) {
            var x = position.x,
                y = position.y,
                snakePosition = snake.position,
                beanPosition = bean.position,
                gameZoneCell = gameZone.cellSize,
                i = 0,
                len = 0;

            if (x < 0 || y < 0 || x >= gameZoneCell.x || y >= gameZoneCell.y) {
                return false;
            }

            if (x === beanPosition.x && y === beanPosition.y) {
                return false;
            }

            for (i = 0, len = snakePosition.x.length; i < len; i++) {
                if (x === snakePosition.x[i] && y === snakePosition.y[i]) {
                    return false;
                }
            }

            return true;
        },
        "putElement2Cell": function(element, position) {
            var gameZoneCell = gameZone.cellSize;

            element.style.left = position.x * gameZoneCell.metaWidth + "px";
            element.style.top = position.y * gameZoneCell.metaHeight + "px";
        },
        "keyPress": function(event) {
            var eventUtil = Util.Event,
                that = gameControl,
                pressKey = eventUtil.getEvent(event).keyCode,
                participant = that.participants[0],
                playerDirection = "",
                playerKey = "";

            for (playerKey in participant.player.keyCode) {
                if (pressKey === participant.player.keyCode[playerKey]) {
                    playerDirection = participant.currentDirection;
                    if (playerDirection === that.SNAKEDIRECTION[0] && playerKey !== that.SNAKEDIRECTION[2]) {
                        participant.nextDirection = playerKey;
                    } else if (playerDirection === that.SNAKEDIRECTION[1] && playerKey !== that.SNAKEDIRECTION[3]) {
                        participant.nextDirection = playerKey;
                    } else if (playerDirection === that.SNAKEDIRECTION[2] && playerKey !== that.SNAKEDIRECTION[0]) {
                        participant.nextDirection = playerKey;
                    } else if (playerDirection === that.SNAKEDIRECTION[3] && playerKey !== that.SNAKEDIRECTION[1]) {
                        participant.nextDirection = playerKey;
                    }
                    return true;
                }
            }
        },
        "isGameOver": function(newPosition) {
            var that = gameControl,
                snakePosition = that.participants[0].snake.position,
                i = 0,
                len = 0;

            for (i = 0, len = snakePosition.x.length; i < len; i++) {
                if (newPosition.x === snakePosition.x[i] && newPosition.y === snakePosition.y[i]) {
                    return true;
                }
            }

            return false;
        },
        "isEatBean": function(newPosition) {
            if (newPosition.x === bean.position.x && newPosition.y === bean.position.y) {
                return true;
            }

            return false;
        },
        "increaseScore": function() {
            var that = gameControl,
                player = that.participants[0].player;

            player.score += (100 * (player.speedLevel + 1));
        },
        "gameOver": function() {
            var eventUtil = Util.Event,
                that = gameControl;

            eventUtil.removeHandler(window, "keyup", that.keyPress);

            window.clearTimeout(that.timeout);
            console.log(that.timeout);

            alert("Game Over");
        }

    }

    gameControl.init();


}, 0);
