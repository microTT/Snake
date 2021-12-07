window.setTimeout(function() {
    'use strict';
    console.log("game loading");

    /**
     * 包含一些库函数
     * @module Util
     */
    var Util = {};

    /**
     * 命名空间创建属性链 方法
     * @method createChain
     * @for Util
     * @chainable
     * @param  {String}   nsString   命名空间属性链链，链直接以属性开始
     * @param  {Function} [callback] 创建完成后的回调函数
     * @return {Namespace}            返回调用对象本身
     * @example
     *     MyNameSpace.createChain("myProtype.protype", function() {
     *         alert("create success!");
     *     });
     */
    Util.createChain = function(nsString, callback) {
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


    /**
     * 一些与事件相关的库函数
     * @class Event
     */
    Util.createChain("Event");

    /**
     * 为DOM元素绑定事件，动态定义函数，第一次运行时进行浏览器能力检测并重定义函数
     * @method  addHandler
     * @for Event
     * @param {HTMLElement} element 要绑定事件的DOM对象
     * @param {String} type    绑定事件的类型
     * @param {Function} handler 事件处理函数
     * @return {HTMLElement}        进行事件绑定的DOM对象
     */
    Util.Event.addHandler = function(element, type, handler) {
        if (element.addEventListener) {
            Util.Event.addHandler = function(element, type, handler) {
                element.addEventListener(type, handler, false);
                return element;
            }
        } else if (element.attachEvent) {
            Util.Event.addHandler = function(element, type, handler) {
                element.addHandler("on" + type, handler);
                return element;
            }
        } else {
            Util.Event.addHandler = function(element, type, handler) {
                element["on" + type] = handler;
                return element;
            }
        }

        Util.Event.addHandler(element, type, handler);

        return element;
    }

    /**
     * 为DOM元素移除事件，动态定义函数，第一次运行时进行浏览器能力检测并重定义函数
     * @method  removeHandler
     * @for Event
     * @param  {HTMLElement} element 要移除事件绑定的DOM对象
     * @param  {String} type    移除绑定事件的类型
     * @param  {Function} handler 移除的事件处理函数
     * @return {HTMLElement}         要移除事件绑定的DOM对象
     */
    Util.Event.removeHandler = function(element, type, handler) {
        if (element.removeEventListener) {
            Util.Event.removeHandler = function(element, type, handler) {
                element.removeEventListener(type, handler, false);
                return element;
            }
        } else if (element.detachEvent) {
            Util.Event.removeHandler = function(element, type, handler) {
                element.detachEvent("on" + type, handler);
                return element;
            }
        } else {
            Util.Event.removeHandler = function(element, type, handler) {
                element["on" + type] = null;
                return element;
            }
        }

        Util.Event.removeHandler(element, type, handler);

        return element;
    }


    /**
     * 获取事件Event对象，为了兼容获取IE下的 DOM0级 事件方法的 event 对象。
     * IE下 DOM0级 事件对象为 window 对象的一个属性即 window.event, 其他情况下 event 作为一个参数传给事件处理函数。
     * @method getEvent
     * @for Event
     * @param  {Event} event 事件处理函数获得的事件对象
     * @return {Event}       经过检测得到的真正的事件对象
     */
    Util.Event.getEvent = function(event) {
        return event || window.event;
    }

    /**
     * 获得发生事件的目标DOM对象。
     * 该对象保存在IE事件对象的 srcElement 属性中，其他情况在 target 属性中
     * @method  getTarget
     * @for Event
     * @param  {Event} event 事件对象
     * @return {HTMLElement}       发生事件的目标DOM对象
     */
    Util.Event.getTarget = function(event) {
        return event.target || event.srcElement;
    }



    /**
     * 阻止事件继续向DOM树顶级冒泡。兼容IE,动态定义函数，第一次运行时进行浏览器能力检测并重新定义函数
     * @method stopPropagation
     * @for Event
     * @param  {Event} event 事件对象
     * @return {HTMLElement}       事件的目标DOM元素
     */
    Util.Event.stopPropagation = function(event) {
        if (typeof event.stopPropagation === "function") {
            Util.Event.stopPropagation = function(event) {
                event.stopPropagation();
                return Util.Event.getTarget(event);
            }
        } else {
            Util.Event.stopPropagation = function(event) {
                event.cancelBubble = true;
                return Util.Event.getTarget(event);
            }
        }

        Util.Event.stopPropagation(event);

        return Util.Event.getTarget(event);
    }

    /**
     * 阻止浏览器事件的默认行为。兼容IE，动态定义函数，第一次运行时进行浏览器能力检测并重新定义函数
     * @method preventDefault
     * @for  Event
     * @param  {Event} event 事件对象
     * @return {HTMLElement}       事件的目标DOM元素
     */
    Util.Event.preventDefault = function(event) {
        if (typeof event.preventDefault === "function") {
            Util.Event.preventDefault = function(event) {
                event.preventDefault();
                return Util.Event.getTarget(event);
            }
        } else {
            Util.Event.preventDefault = function(event) {
                event.returnValue = false;
                return Util.Event.getTarget(event);
            }
        }

        Util.Event.preventDefault(event);

        return Util.Event.getTarget(event);
    }

    /**
     * 获取键盘事件的按键编码。兼容IE。
     * @method  getCharCode
     * @for Event
     * @param  {Event} event 事件对象
     * @return {Number}       按键编码
     */
    Util.Event.getCharCode = function(event) {
        return typeof event.charCode === "number" ? event.charCode : event.keyCode;
    }

    /**
     * 与Dom操作有关的库函数
     * @class Dom
     */
    Util.createChain("Dom");

    /**
     * 编辑DOM对象的className。使用最新的HTML5的classList对象操作对象className,若浏览器不支持则采用“手动”处理的方式。
     * 动态定义函数，第一次运行时进行浏览器能力检测并重新定义函数。
     * @method editClassName
     * @for Dom
     * @param  {HTMLElement} element     要进行类名操作的DOM对象
     * @param  {String} option      操作类型，只能为["add", "remove", "contains", "toggle"]中的一个，若不为要求字符串其中之一则抛出错误。
     * @param  {[String]} classString 要进行编辑的类名
     * @return {HTMLElement|Boolean}             若option为"contains",则返回一个Boolean表示检测包含的结果，若为其他操作则返回类名操作的DOM对象
     */
    Util.Dom.editClassName = function(element, option, classString) {
        if (element.classList) {
            Util.Dom.editClassName = function(element, option, classString) {
                var optionResult = false;
                try {
                    optionResult = element.classList[option](classString);
                    if (optionResult === undefined) {
                        return element;
                    } else {
                        return optionResult;
                    }
                } catch (error) {
                    throw new Error("Edit className Error.");
                }
            }
        } else {
            Util.Dom.editClassName = function(element, option, classString) {
                var className = element.className.split(/\s+/),
                    optionResult = false,
                    i = 0,
                    len = 0;

                if (option === "add") {
                    className.push(classString);
                } else {
                    for (i = 0, len = className; i < len; i++) {
                        if (className[i] === classString) {
                            optionResult = true;
                            break;
                        }
                    }

                    if (option === "remove") {
                        className = optionResult ? className.splice(i, 1) : className;
                    } else if (option === "contains") {
                        return optionResult;
                    } else if (option === "toggle") {
                        className = optionResult ? className.splice(i, 1) : className.push(classString);
                    } else {
                        throw new Error("Edit className Error.");
                    }
                }

                element.className = className.join(" ");

                return element;
            }
        }
    }

    /**
     * 获得Dom元素最终计算后的style。
     * 兼容IE，为动态定义函数，第一次运行时进行浏览器能力检测并重新定义函数
     * @method  getComputedStyle
     * @for Dom
     * @param  {HTMLElement} element 要获取style的DOM对象
     * @return {CSSStyleDeclaration}         DOM对象的style对象
     */
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

    /**
     * @module Snake Game
     */

    /**
     * 玩家 类型，
     * @class  Player
     * @constructor
     * @param {String} [name=S_(random())]    玩家的昵称，可选参数
     * @param {Object} [keyCode={"UP": 87, "RIGHT": 68, "DOWN": 83, "LEFT": 65,}] 必须包含"UP", "RIGHT", "DOWN", "LEFT",属性的对象。即表示玩家的键位,可选参数
     * @param {Number} [keyCode.UP=87] 向上的键位编码
     * @param {Number} [keyCode.RIGHT=68] 向右的键位编码
     * @param {Number} [keyCode.DOWN=83] 向下的键位编码
     * @param {Number} [keyCode.left=65] 想做的键位编码
     * @example
     *     var Tom = new player("Tom");
     *     var Jerry = Player();
     */
    function Player(name, keyCode) {
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

        /**
         * 玩家的游戏等级，涉及到每次的得分和游戏速度
         * @property SpeedLevel
         * @for Player
         * @type {Number}
         */
        this.speedLevel = 0;

        /**
         * 玩家的分数
         * @property score
         * @for Player
         * @type {Number}
         */
        this.score = 0;

        /**
         * 玩家的键位，必须包含四个属性"UP", "RIGHT", "DOWN", "LEFT",且每个属性的类型为 Number， 表示键位的编码
         * 可由用户自定义，若用户未输入，则使用默认的"W、A、S、D"，来控制方向
         * @property keyCode
         * @for  Player
         * @type {[Object]}
         */
        this.keyCode = keyCode;

        /**
         * 玩家的昵称
         * 可由用户自定义，若用户未输入，则自动生成以 S_ 为前缀，后跟随机数的随机用户名
         * @property name
         * @type {String}
         */
        this.name = name ? name : "S_" + (Math.random()).toString().slice(2);
    }

    /**
     * 依据当前玩家分数刷新玩家等级
     * @method flushSpeedLevel
     * @for Player
     * @return {Player} 返回 this 对象, 即调用方法的Player对象本身
     */
    Player.prototype.flushSpeedLevel = function() {
        if (this.score > this.speedLevel * this.speedLevel * 100) {
            this.speedLevel++;
        }

        return this;
    };

    /**
     * 贪吃蛇对象
     * @class  Snake
     */
    var Snake = {
        /**
         * 一个立即执行函数，对象定义期间运行
         * 返回一个包含组成 Snake 对象的DOM对象数组
         * @property element
         * @for  Snake
         * @type {Array}
         */
        "element": (function() {
            var snakeBody = document.getElementById("game").getElementsByClassName("snake-body");

            return Array.prototype.slice.call(snakeBody);
        }()),

        /**
         * 包含组成 Snake 对象的DOM对象的各个对象的位置坐标
         * 该属性为一个包含名为 x的数组 与 y的数组 的对象
         * x,y分别代表了DOM对象在游戏栅格区的位置，且数组序号与 element数组一一对应
         * @property position
         * @for Snake
         * @type {Object}
         */
        "position": {
            "x": [-1, -1, -1, -1, -1],
            "y": [-1, -1, -1, -1, -1]
        },

        /**
         * 一个立即执行函数，对象定义期间运行，返回一个对象
         * 对象组成 Snake 对象的单个 DOM 对象的尺寸的一个Object对象，对象包含两个 Number 类型的属性"width", "height"
         * @property bodySize
         * @for Snake
         * @type {Object}
         */
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

        /**
         * 深拷贝一个组成 Snake 的DOM对象并返回
         * @method generateNewBody
         * @for Snake
         * @return {HTMLElement} 组成 Snake 的原DOM对象
         */
        "generateNewBody": function() {
            var snakeBodyElem = this.element[this.element.length - 1],
                newBody = snakeBodyElem.cloneNode(true);

            return newBody;

        }
    };


    /**
     * 贪吃蛇所吃的 豆子 对象
     * @class Bean
     */
    var Bean = {
        /**
         * 一个立即执行函数，在对象定义期间运行
         * 返回一个HTMLElement对象，为 Bean DOM对象
         * @porperty element
         * @for Bean
         * @type {HTMLElement}
         */
        "element": (function() {
            return document.getElementById("bean");
        }()),

        /**
         * 包含 Bean 当前位于游戏栅格区的位置，为一个 Object 对象，对象有两个 Number 类型的属性"x","y"
         * @property position
         * @for Bean
         * @type {Objext}
         */
        "position": {
            "x": -1,
            "y": -1
        },

        /**
         * 一个立即执行函数，在对象定义期间运行
         * 返回一个对象包含 Bean 对象的 DOM对象的大小，即宽和高，该 Object 对象包含两个 Number 类型的属性"width", "height"
         * @property size
         * @for Bean
         * @type {Object}
         */
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

    /**
     * 计分板 对象
     * @class ScorePanel
     */
    var ScorePanel = {
        /**
         * 一个立即执行函数，在对象定义的期间运行
         * 返回一个包含组成 SocrePanel 的DOM对象的 Object 对象，该对象包含两个 HTMLElement 类型的属性,"name", "score"
         * @property element
         * @for ScorePanel
         * @type {Object}
         */
        "element": (function() {
            var name = document.getElementById("player-name"),
                score = document.getElementById("player-score");
            return {
                "name": name,
                "score": score
            };
        }()),

        /**
         * 刷新计分板的显示
         * @method flushScore
         * @param  {Object} player 包含要显示游戏分数的对象，该Object 对象必须包含两个属性 "name", "score"
         * @param  {String} player.name 包含要显示游戏分数的对象名称
         * @param  {Number} player.score 包含要显示游戏分数的对象分数
         * @return {ScorePanel}        返回this,即调用该方法的对象
         */
        "flushScore": function(player) {
            ScorePanel.element.name.innerHTML = player.name;
            ScorePanel.element.score.innerHTML = player.score;

            return this;
        }

    }

    /**
     * 进行游戏的栅格区
     * @class GameZone
     */
    var GameZone = {
        /**
         * 一个立即执行函数，在对象定义的期间运行
         * 返回一个包含游戏栅格区实际大小的 Object 对象， 该对象包含两个 Number 类型的属性"width", "height"
         * @property size
         * @for GameZone
         * @type {Objext}
         */
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

        /**
         * 包含游戏区栅格化后的数据，该对象包含四个 Number 类型的属性，”x" 横向的栅格数量，"y" 纵向的栅格数量，"metaWidth" 元栅格的宽，"metaHeight" 元栅格的高
         * @property callSize
         * @for GameZone
         * @type {Object}
         */
        "cellSize": {
            "x": 0,
            "y": 0,
            "metaWidth": 0,
            "metaHeight": 0
        }
    }

    /**
     * 整个应用的 中介者(Mediator)，
     * 应用的各个模块互相没有直接的通信，全部通过 GameControl 对象来进行通信控制。
     * @class GameControl
     */
    var GameControl = {
        /**
         * 游戏的参与者数组数组成员为 Object 对象，
         * 对象包括四个属性"player" 玩家对象，"Snake" 玩家对应的 Snake 对象，"currentDirection" 当前贪吃蛇的运动方向，"nextDirection" 即将转换的方向
         * @property participants
         * @for GameControl
         * @type {Array}
         */
        "participants": [],

        /**
         * Snake 的运动方向的枚举数组，常量不可更改
         * @property SNAKEDIRECTION
         * @for GameControl
         * @type {Array}
         * @readOnly
         */
        "SNAKEDIRECTION": ["UP", "RIGHT", "DOWN", "LEFT"],

        /**
         * Snake 的每次移动的初始间隔时间，即 Snake 的速度，常量不可更改
         * @property INITIALSPEED
         * @for GameControl
         * @type {Number}
         * @readOnly
         */
        "INITIALSPEED": 800,

        /**
         * 游戏玩家的最高等级，常量不可更改
         * @property MAXSPEEDLEVEL
         * @for GameControl
         * @type {Number}
         * @readOnly
         */
        "MAXSPEEDLEVEL": 10,

        /**
         * 中介者对象的初始化方法，包括生成 Snake Bean Player、初始化游戏栅格网等操作。
         * @method init
         * @for GameControl
         * @return {GameContol} 返回 this, 即调用初始化的对象
         */
        "init": function() {
            var eventUtil = Util.Event,
                player = new Player();

            this.participants.push({
                "player": player,
                "snake": Snake,
                "currentDirection": "LEFT",
                "nextDirection": "LEFT"
            });
            this.calculateGameZoneCellSize();
            this.generateSnake();
            this.generateBean();
            eventUtil.addHandler(window, "keydown", this.keyPress);

            this.timeout = window.setTimeout(function() {
                GameControl.snakeRunning();
            }, this.INITIALSPEED);

            return this;
        },

        /**
         * 初始化游戏区栅格网方法，通过计算游戏区大小，Snake Bean对象的 DOM对象的大小来将游戏区初始化为一个栅格网并存储在 GameZone 对象中
         * @method calculateGameZoneCellSize
         * @for GameControl
         * @return {GameControl} 返回this，即调用该方法的对象
         */
        "calculateGameZoneCellSize": function() {
            GameZone.cellSize.metaWidth = Math.max(Bean.size.width, Snake.bodySize.width);
            GameZone.cellSize.metaHeight = Math.max(Bean.size.height, Snake.bodySize.height);
            GameZone.cellSize.x = Math.floor(GameZone.size.width / GameZone.cellSize.metaWidth);
            GameZone.cellSize.y = Math.floor(GameZone.size.height / GameZone.cellSize.metaHeight);

            return this;
        },

        /**
         * 在游戏栅格区随机选取位置生成 Snake
         * @method generateSnake
         * @for GameControl
         * @return {GameControl} 返回 this 对象，即调用方法的对象本身
         */
        "generateSnake": function() {
            var snakeElem = Snake.element,
                snakePosition = Snake.position,
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

            return this;
        },

        /**
         * 使 Snake 对象增加一个元DOM对象，即“成长”，在某个位置（Snake尾部）生成一个新的DOM对象
         * @method SnakeGrowUp
         * @for GameControl
         * @param  {Object} position 栅格区要增加显示元DOM对象的位置，该 Object 对象有两个 Number 类型的属性"x", "y"
         * @param  {Number} position.x 栅格区横向的栅格数量
         * @param  {Number} position.y 栅格区纵向的栅格数量
         * @return {GameControl}          返回 this 对象，即调用方法的对象本身；
         */
        "snakeGrowUp": function(position) {
            var game = document.getElementById("game-zone"),
                newBody = Snake.generateNewBody();


            game.appendChild(newBody);
            Snake.element.push(newBody);
            Snake.position.x.push(position.x);
            Snake.position.y.push(position.y);

            this.putElement2Cell(newBody, position);
            return this;
        },

        /**
         * GameControl 对象的核心方法，控制 Snake 对象在游戏栅格区移动并运行相关的判断函数。
         * @method snakeRunning
         * @for GameControl
         * @return {GameControl} 返回GameControl对象
         */
        "snakeRunning": function() {
            var that = GameControl,
                direction = that.participants[0].nextDirection,
                snakePosition = Snake.position,
                newPosition = {},
                oldPosition = {},
                maxX = GameZone.cellSize.x,
                maxY = GameZone.cellSize.y,
                speedInterval = that.INITIALSPEED / (that.MAXSPEEDLEVEL + 1),
                speed = that.INITIALSPEED - that.participants[0].player.speedLevel * speedInterval;

            that.timeout = window.setTimeout(function() {
                that.snakeRunning();
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
                return that;
            }

            that.participants[0].currentDirection = that.participants[0].nextDirection;

            oldPosition.x = snakePosition.x[snakePosition.x.length - 1];
            oldPosition.y = snakePosition.y[snakePosition.y.length - 1];

            that.putElement2Cell(Snake.element[Snake.element.length - 1], newPosition);

            snakePosition.x[snakePosition.x.length - 1] = newPosition.x;
            snakePosition.y[snakePosition.y.length - 1] = newPosition.y;

            snakePosition.x = that.exchangArrayElementIndex(snakePosition.x, -1, snakePosition.x.length - 1);
            snakePosition.y = that.exchangArrayElementIndex(snakePosition.y, -1, snakePosition.y.length - 1);
            Snake.element = that.exchangArrayElementIndex(Snake.element, -1, Snake.element.length - 1);

            if (that.isEatBean(newPosition)) {
                that.increaseScore();
                ScorePanel.flushScore(that.participants[0].player);
                that.participants[0].player.flushSpeedLevel();
                that.generateBean();
                that.snakeGrowUp(oldPosition);
            }

            return that;
        },

        /**
         * 将数组内的元素进行交换。对传入的数组进行前拷贝(只拷贝第一维)成新数组后操作并返回
         * 若索引 index1 为-1，则代表将索引 index2 的元素放置到数组首位。
         * 若索引 index2 为-1，则代表将索引 index1 的元素放置到元素末位。
         * @method exchangeArrayElementIndex
         * @for GameControl
         * @param  {Array} array 要进行元素交换的数组
         * @param  {Number} index1 要交换的元素1的索引
         * @param  {Number} index2 要交换的元素2的索引
         * @return {Array}     交换后的数组
         */
        "exchangArrayElementIndex": function(array, index1, index2) {
            var newArray = array.slice();

            if (index1 === -1 && index2 !== -1) {
                newArray = newArray.splice(index2, 1).concat(newArray);
            } else if (index1 !== -1 && index2 === -1) {
                newArray.push(newArray.splice(index1, 1)[0]);
            } else if (index1 !== -1 && index2 !== -1) {
                newArray.splice(index2, 1, newArray.splice(index1, 1, newArray[index2])[0]);
            }

            return newArray;
        },

        /**
         * 在栅格区内随机选取位置并显示 Bean DOM对象
         * @method generateBean
         * @for GameControl
         * @return {GameControl} 返回 this 对象，即调用该方法的对象本身
         */
        "generateBean": function() {
            var beanElem = Bean.element,
                beanPosition = Bean.position,
                position = this.getEmptyCell();

            this.putElement2Cell(beanElem, position);
            beanPosition.x = position.x;
            beanPosition.y = position.y;

            console.log("Generate Bean Success");

            return this;
        },

        /**
         * 获得游戏栅格区内为空的栅格位置对象
         * @method getEmptyCell
         * @for GameControl
         * @return {Object} 返回的Object 对象包含两个Number 类型的属性，即"x", "y"
         */
        "getEmptyCell": function() {
            var gameZoneCell = GameZone.cellSize,
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

        /**
         * 判断栅格区位置是否为空
         * @method isEmptyCell
         * @param  {Object} position 需要判断的栅格区位置，该 Object对象内必须包含两个 Number 类型的属性"x", "y"
         * @param  {Number} position.x 需要判断的栅格区位置的横向坐标
         * @param  {Number} position.y 需要判断的栅格区位置的纵向坐标
         * @return {Boolean}          为空返回true, 否则返回false
         */
        "isEmptyCell": function(position) {
            var x = position.x,
                y = position.y,
                snakePosition = Snake.position,
                beanPosition = Bean.position,
                gameZoneCell = GameZone.cellSize,
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

        /**
         * 通过设置DOM对象的style.left 和 style.top 属性使得在指定位置显示DOM对象
         * @method putElement2Cell
         * @for GameControl
         * @param  {HEMLElement} element  需要显示的DOM对象
         * @param  {Object} position 指定的位置对象，该对象内包含两个Number类型的属性 "x", "y"
         * @param  {Number} position.x 指定的位置的横向坐标
         * @param  {Number} position.y 指定的位置的纵向坐标
         * @return {GameControl}          返回 this 对象，即调用该方法的对象本身
         */
        "putElement2Cell": function(element, position) {
            var gameZoneCell = GameZone.cellSize;

            element.style.left = position.x * gameZoneCell.metaWidth + "px";
            element.style.top = position.y * gameZoneCell.metaHeight + "px";

            return this;
        },

        /**
         * 键盘事件处理函数，获取键盘按键的按键编码，并与 Player 对象的KeyCode对象比较，判断按键是否有效，并处理 Snake 对象的运行方向
         * @event keyPress
         * @for GameControl
         * @param  {Event} event 事件对象
         * @return {Boolean}       若按键有效返回true, 否则返回false
         */
        "keyPress": function(event) {
            var eventUtil = Util.Event,
                that = GameControl,
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

            return false
        },

        /**
         * 判断游戏是否结束，游戏结束条件， Snake 对象运行到本身对象所处的位置上，即 贪吃蛇吃到了自己
         * @method isGameOver
         * @for GameControl
         * @param  {Object} newPosition 贪吃蛇下一步运动到的新位置，该参数对象包含两个 Number 类型的对象属性"x", "y"
         * @param  {Number} newPosition.x 新位置的横向坐标
         * @param  {Number} newPosition.y 新位置的纵向坐标
         * @return {Boolean}            若贪吃蛇吃到了自己则游戏结束返回true, 否则返回false
         */
        "isGameOver": function(newPosition) {
            var that = GameControl,
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

        /**
         * 判断 Snake 运行的新位置是否包含有 Bean 对象， 即贪吃蛇是否吃到豆子
         * @method isEatBean
         * @for GameControl
         * @param  {Object} newPosition Snake对象要运行的新位置坐标，该参数对象包含两个 Number 类型的属性"x", "y"
         * @param  {Number} newPosition.x 新位置的横向坐标
         * @param  {Number} newPosition.y 新位置的纵向坐标
         * @return {Boolean}            如果吃到豆子返回true, 否则返回false
         */
        "isEatBean": function(newPosition) {
            if (newPosition.x === Bean.position.x && newPosition.y === Bean.position.y) {
                return true;
            }

            return false;
        },

        /**
         * 增加玩家的分数，每次增加100分
         * @method increaseScore
         * @for GameControl
         * @return {GameControl} 返回 this 对象，即调用方法的对象本身
         */
        "increaseScore": function() {
            var that = GameControl,
                player = that.participants[0].player;

            player.score += 100;

            return this;
        },

        /**
         * 游戏结束, Snake 对象停止运行
         * @return {GameControl} 返回 this 对象，即调动方法的对象本身
         */
        "gameOver": function() {
            var eventUtil = Util.Event,
                that = GameControl;

            eventUtil.removeHandler(window, "keyup", that.keyPress);

            window.clearTimeout(that.timeout);
            console.log(that.timeout);

            alert("Game Over");

            return this;
        }

    }

    //  中介者运行初始化函数，游戏开始
    GameControl.init();


}, 0);
