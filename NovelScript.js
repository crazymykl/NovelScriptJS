var NovelScript = function() {
    var Module = {
        setSlides: function(value) {
            if (value) {
                if (Object.prototype.toString.call(value) === "[object Array]") this.slides = value; else this.slides = [];
            } else {
                this.slides = [];
            }
        },
        setActors: function(actors) {
            this.actors = actors ? Object.prototype.toString.call(actors) === "[object String]" ? [ actors ] : Object.prototype.toString.call(actors) === "[object Array]" ? actors : [] : [];
        },
        addActors: function(actors) {
            if (actors) {
                if (Object.prototype.toString.call(actors) === "[object String]") {
                    this.actors.push(actors);
                }
                if (Object.prototype.toString.call(actors) === "[object Array]") {
                    for (var i = 0; i < actors.length; i++) {
                        this.actors.push(actors[i]);
                    }
                }
                if (Object.prototype.toString.call(actors) === "[object Object]") {
                    for (actor in actors) {
                        this.actors.push(actors[actor]);
                    }
                }
            }
        },
        getBackground: function() {
            return this.background;
        },
        setText: function(val) {
            if (Object.prototype.toString.call(val) === "[object String]") {
                this.text = val;
            }
        },
        getText: function() {
            return this.text;
        },
        setBackground: function(val) {
            if (Object.prototype.toString.call(val) === "[object String]") {
                this.background = val;
            }
        },
        defaultDraw: function() {
            this.context.fillStyle = "#FFFFFF";
            this.context.fillRect(0, 0, this.width, this.height);
            this.drawBackground();
            this.drawActors();
            this.drawText();
        },
        startStory: function() {
            this.canvas.style.display = "block";
        },
        drawBackground: function() {
            this.background = this.background ? this.background : "#FFFFFF";
            if (this.background.indexOf("#") == 0) {
                this.context.fillStyle = this.background;
                this.context.fillRect(0, 0, this.width, this.height);
            } else {
                this.context.drawImage(document.getElementById(this.background), 0, 0, this.width, this.height);
            }
        },
        drawActors: function() {
            var maxHeight = this.height * this.goldenRatio / (this.goldenRatio + 1);
            var myContext = this.context;
            var calcy = this.height / 2;
            for (var i = 0; i < this.actors.length; i++) {
                var myactor = document.getElementById(this.actors[i]);
                var myheight = myactor.height;
                var mywidth = myactor.width;
                if (!this.noResize) {
                    if (myheight > maxHeight) {
                        var ratio = maxHeight / myheight;
                        myheight = maxHeight;
                        mywidth = ratio * mywidth;
                    }
                    if (mywidth > this.width * .3) {
                        var ratio = this.width * .3 / mywidth;
                        myheight = ratio * myheight;
                        mywidth = this.width * .3;
                    }
                }
                myContext.save();
                myContext.translate(this.width * ((i * 2 + 1) / (this.actors.length * 2)) - mywidth / 2, calcy - myheight / 2);
                myContext.drawImage(myactor, 0, 0, mywidth, myheight);
                myContext.restore();
            }
        },
        drawText: function() {
            this.textBaseline = "top";
            this.context.save();
            this.context.translate(0, this.goldenRatio * this.height / (this.goldenRatio + 1));
            var textboxHeight = this.height - this.goldenRatio * this.height / (this.goldenRatio + 1);
            var grad = this.context.createLinearGradient(0, 0, 0, textboxHeight);
            grad.addColorStop(0, "rgba(142,214,255,.7)");
            grad.addColorStop(1, "rgba(0,76,179,.7)");
            this.context.rect(4, 4, this.width - 8, textboxHeight - 8);
            this.context.fillStyle = grad;
            this.context.fill();
            this.context.strokeStyle = "#000000";
            this.context.stroke();
            this.context.fillStyle = "#FFFFFF";
            this.context.font = this.fontSize.toString() + "pt " + this.font;
            this.drawRawText(this.text, 8, this.fontSize + 8, this.width - 16, this.height - this.goldenRatio * this.height / (this.goldenRatio + 1) - 8);
            this.context.restore();
        },
        nextSlide: function() {
            var slide = this.slides.shift();
            if (slide) {
                if (typeof slide == "function") {
                    slide(this);
                    if (!this.preventDefaultDraw) {
                        this.defaultDraw();
                    }
                }
                if (typeof slide == "object") {
                    slide.text ? this.setText(slide.text) : "";
                    slide.background ? this.setBackground(slide.background) : "";
                    if (slide.actors) {
                        this.setActors(slide.actors);
                    }
                    if (typeof slide.code == "function") {
                        slide.code(this);
                    }
                }
                this.history.push(slide);
                return true;
            }
            return false;
        },
        drawRawText: function(text, x, y, maxWidth, maxHeight) {
            var array;
            if (Object.prototype.toString.call(text) === "[object String]") {
                array = text.split(/ /);
            } else {
                array = text;
            }
            if (y + this.fontSize <= maxHeight) {
                var finalText = "";
                while (array.length && this.context.measureText((finalText ? finalText + " " : "") + array[0]).width < maxWidth) {
                    finalText = (finalText ? finalText + " " : "") + array.shift();
                }
                this.context.fillText(finalText, x, y);
                if (array.length) {
                    this.drawRawText(array, x, y + this.fontSize + 4, maxWidth, maxHeight);
                }
            } else {
                return array;
            }
        }
    };
    var defaults = {
        fontSize: 20,
        width: 800,
        height: 600,
        slides: [],
        variables: {},
        actors: [],
        background: "#EEEEEE",
        text: "",
        preventDefaultDraw: false,
        font: "Palatino Linotype",
        noResize: false
    };
    var NovelCanvas = function(options) {
        if (!options) {
            throw new Error("Options not defined.", "NovelScript.js");
        }
        this.fontSize = options.fontSize && Object.prototype.toString.call(options.fontSize) === "[object String]" ? options.fontSize : defaults.fontSize;
        this.history = [];
        this.goldenRatio = 1.618;
        this.noResize = options.noResize && Object.prototype.toString.call(options.noResize) === "[object Boolean]" ? options.noResize : defaults.noResize;
        if (options.target && Object.prototype.toString.call(options.target) === "[object String]") {
            this.target = options.target;
        } else {
            throw new Error("Options.target not defined.", "NovelScript.js");
        }
        var novelCanvas = document.createDocumentFragment();
        var canvas = document.createElement("canvas");
        var ctx = canvas.getContext("2d");
        this.canvas = canvas;
        canvas.style.display = "none";
        this.context = ctx;
        this.width = options.width && Object.prototype.toString.call(options.width) === "[object Number]" ? options.width : defaults.width;
        canvas.width = this.width;
        this.height = options.height && Object.prototype.toString.call(options.height) === "[object Number]" ? options.height : defaults.height;
        canvas.height = this.height;
        this.slides = options.slides && Object.prototype.toString.call(options.slides) === "[object Array]" ? options.slides : defaults.slides;
        this.setSlides = Module.setSlides.bind(this);
        this.variables = options.variables && Object.prototype.toString.call(options.variables) === "[object Object]" ? options.variables : defaults.variables;
        if (options.images) {
            var imagesLeft = 0;
            var imageRepoID = "images" + new Date().getTime();
            var imageDecrement = function() {
                imagesLeft--;
                if (!imagesLeft) {
                    if (options.onload && typeof options.onload == "function") options.onload(this);
                }
            }.bind(this);
            var imageRepo = document.createDocumentFragment();
            var images = options.images;
            switch (Object.prototype.toString.call(images)) {
              case "[object Object]":
                var i = 0;
                for (image in images) {
                    var myImage = document.createElement("img");
                    myImage.src = images[image];
                    myImage.id = image;
                    myImage.onload = imageDecrement;
                    imageRepo.appendChild(myImage);
                    i++;
                }
                imagesLeft = i;
                break;

              case "[object Array]":
                imagesLeft = images.length;
                for (var i = 0; i < images.length; i++) {
                    var myImage = document.createElement("img");
                    myImage.src = images[i];
                    myImage.id = i;
                    myImage.onload = imageDecrement;
                    imageRepo.appendChild(myImage);
                }
                break;

              case "[object String]":
                var imgs = document.getElementById(images).getElementsByTagName("img");
                imagesLeft = imgs.length;
                while (imgs.length) {
                    imgs[0].src = imgs[0].src + "?" + new Date().getTime();
                    imgs[0].onload = imageDecrement;
                    imageRepo.appendChild(imgs[0]);
                }
                break;

              default:
                throw new Error("Unable to parse images.", "NovelScript.js");
            }
            var invisibleSpan = document.createElement("span");
            invisibleSpan.style.display = "none";
            this.ImageRepoID = imageRepoID;
            invisibleSpan.id = imageRepoID;
            invisibleSpan.appendChild(imageRepo);
            novelCanvas.appendChild(canvas);
            novelCanvas.appendChild(invisibleSpan);
            document.getElementById(this.target).appendChild(novelCanvas);
        }
        this.actors = options.actors && Object.prototype.toString.call(options.actors) === "[object Array]" ? options.actors : defaults.actors;
        this.setActors = Module.setActors.bind(this);
        this.addActors = Module.addActors.bind(this);
        this.background = options.background && Object.prototype.toString.call(options.background) === "[object String]" ? options.background : defaults.background;
        this.setBackground = Module.setBackground.bind(this);
        this.getBackground = Module.getBackground.bind(this);
        this.text = options.text && Object.prototype.toString.call(options.text) === "[object String]" ? options.text : defaults.text;
        this.setText = Module.setText.bind(this);
        this.getText = Module.getText.bind(this);
        this.startStory = Module.startStory.bind(this);
        this.drawBackground = Module.drawBackground.bind(this);
        this.drawActors = Module.drawActors.bind(this);
        this.drawText = Module.drawText.bind(this);
        this.preventDefaultDraw = options.preventDefaultDraw && Object.prototype.toString.call(options.preventDefaultDraw) === "[object Boolean]" ? options.preventDefaultDraw : defaults.preventDefaultDraw;
        this.defaultDraw = Module.defaultDraw.bind(this);
        this.nextSlide = Module.nextSlide.bind(this);
        this.font = options.font && Object.prototype.toString.call(options.font) === "[object String]" ? options.font : defaults.font;
        this.drawRawText = Module.drawRawText.bind(this);
    };
    var exports = {
        NovelCanvas: NovelCanvas
    };
    return exports;
}();