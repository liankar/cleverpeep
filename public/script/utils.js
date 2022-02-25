define("Utils", function () {
    var Utils = (function () {
        String.prototype.capitalize = function () {
            return this.charAt(0).toUpperCase() + this.slice(1);
        }

        Array.prototype.shuffle = function () {
            var a = this;
            n = a.length;

            for (var i = n - 1; i > 0; i--) {
                var j = Math.floor(Math.random() * (i + 1));
                var tmp = a[i];
                a[i] = a[j];
                a[j] = tmp;
            }
            return a;
        }
        Array.prototype.randomReduce = function (count) {
            var arr = this;
            while (arr.length > count) {
                arr.splice(Math.floor(Math.random() * arr.length), 1);
            }
            return arr;
        }
        Array.prototype.random = function () {
            var arr = this;
            return arr[Math.floor(Math.random() * arr.length)];
        }
        Array.create2DArray = function (size) {
            var arr = [];

            for (var i = 0; i < size; i++) {
                arr[i] = [];
            }
            return arr;
        }
        var setCookie = function (name, value, days) {
            var expires = "";
            if (days) {
                var date = new Date();
                date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                expires = "; expires=" + date.toUTCString();
            }
            document.cookie = name + "=" + (value || "") + expires + "; path=/";
        }
        var getCookie = function (name) {
            var nameEQ = name + "=";
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') c = c.substring(1, c.length);
                if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
            }
            return null;
        }
        var eraseCookie = function (name) {
            document.cookie = name + '=; Max-Age=-99999999;';
        }

        var getDefaultLanguage = function () {
            var lang = getCookie("lang");
            if (!lang)
                lang = "eng";

            return lang;
        }
        var random = function (start, end) {
            return start + Math.floor(Math.random() * (end - start));;
        }
        return {
            setCookie: setCookie,
            getCookie: getCookie,
            eraseCookie: eraseCookie,
            getDefaultLanguage: getDefaultLanguage,
            random: random
        }
    });
    return Utils();
});

define("RenderUtils", function() {
    var RenderUtils = (function () {
        var renderImage = function (context, imageUrl, imgX, imgY, imgSize, align) {
            var img = new Image;

            img.onload = function () {
                let w = img.width > img.height ? imgSize : imgSize * img.width / img.height;
                let h = img.width > img.height ? imgSize * img.height / img.width : imgSize;

                if (align == "center") {
                    if (w < imgSize) {
                        imgX += (imgSize - w) / 2;
                    }

                    if (h < imgSize) {
                        imgY += (imgSize - h) / 2;
                    }
                }
                context.drawImage(img, imgX, imgY, w, h);
            };
            img.src = imageUrl;
            return img;
        }

        var createCanvas = function (width, height, parent, id) {
            const canvas = document.createElement("canvas");
            if (id) {
                canvas.id = id;
            }
            canvas.width = width;
            canvas.height = height;
            if (parent) {
                document.getElementById(parent).appendChild(canvas);
            }
            else {
                document.body.appendChild(canvas);
            }

            const ctx = canvas.getContext("2d");
            return { canvas, context: ctx };
        }


        var text = function (context, txt, x, y, options) {
            //Object.keys(options).forEach(f => rect.setAttribute(f, options[f]));

            context.font = options.font ? options.font : "30px Comic Sans MS";
            context.fillStyle = options.fillStyle ? options.fillStyle : "red";
            context.textAlign = options.textAlign ? options.textAlign : "center";
            context.fillText(txt, x, y);
        }
        return { renderImage, createCanvas, text };
    });
    return RenderUtils();
});

define("SvgUtils", function () {
    var SvgUtils = (function () {
        var createSvg = function (options, parentId) {
            var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            Object.keys(options).forEach(f => svg.setAttribute(f, options[f]));
            if (parent) {
                document.getElementById(parentId).append(svg);
            }
            return svg;
        }
        var createTriangle = function (id, x, y, len, options) {
            var triangle = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
            triangle.id = id;
            let x1 = x+140;
            let y1 = y;
            let x2 = x + 70;
            let y2 = y-90;
            var points= x +"," + y +"," + x1 +"," + y1 +"," + x2 +","+y2;//"200,10 250,190 160,210";
            triangle.setAttribute("points", points);
            if (options) {
                Object.keys(options).forEach(f => triangle.setAttribute(f, options[f]));
            }
            return triangle;
        }

        var createRect = function (id, x, y, width, height, options) {

            var rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            rect.id = id;
            rect.setAttribute("x", x);
            rect.setAttribute("y", y);
            rect.setAttribute("width", width);
            rect.setAttribute("height", height);
            if (options) {
                Object.keys(options).forEach(f => rect.setAttribute(f, options[f]));
            }
            return rect;
        }
        var createCircle = function (id, x, y, radius, options) {

            var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            circle.id = id;
            circle.setAttribute("cx", x);
            circle.setAttribute("cy", y);
            circle.setAttribute("r", radius);
            if(options)
            {
                var style = ""
                if(options.fill){
                    style += "fill:"+options.fill+";";
                }
                if(options.stoke){
                    style += "stroke:"+options.stroke+";";
                }
                circle.setAttribute("style", style);
            }
            if (options) {
                Object.keys(options).forEach(f => circle.setAttribute(f, options[f]));
            }
            return circle;
        }

        var createImage = function (id, imageUrl, x, y, width, height, options) {
            var image = document.createElementNS("http://www.w3.org/2000/svg", "image");
            image.id = id;
            image.setAttribute("x", x);
            image.setAttribute("y", y);
            image.setAttribute("preserveAspectRatio", "xMidYMid meet");
            if (width) {
                image.setAttribute("width", width);
            }
            if (height) {
                image.setAttribute("height", height);
            }
            image.setAttribute("href", imageUrl);
            if (options) {
                Object.keys(options).forEach(f => image.setAttribute(f, options[f]));
            }

            return image;

        }
        var text = function (id, text, x, y, options) {
            var txt = document.createElementNS("http://www.w3.org/2000/svg", "text");
            if (id) { txt.id = id; }
            txt.setAttribute("x", x);
            txt.setAttribute("y", y);
            txt.textContent = text;
            if (options) {
                Object.keys(options).forEach(f => txt.setAttribute(f, options[f]));
            }
            return txt;
        }
        var createLine = function (id, x1, y1, x2, y2, options) {

            var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
            line.id = id;
            line.setAttribute("x1", x1);
            line.setAttribute("y1", y1);
            line.setAttribute("x2", x2);
            line.setAttribute("y2", y2);
            if (options) {
                Object.keys(options).forEach(f => line.setAttribute(f, options[f]));
            }
            return line;
        }
        return { createSvg, createRect, createTriangle, createCircle, createImage, text, createLine}
    });

    return SvgUtils();
});

