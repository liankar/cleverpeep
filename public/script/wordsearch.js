Global.init();
define(['./data', './component', "Utils", "SvgUtils", "RenderUtils", 'jquery', 'bootstrap'],
    function (DataUtils, Component, Utils, SvgUtils, RenderUtils) {

        var WordSearch = (function () {
            let lang = Utils.getDefaultLanguage();
            var width = 600;
            var height = 600;
            const HORIZONTAL = 0;
            const VERTICAL = 1;
            const DIAGONAL = 2;
            const MINWORDSINSEARCH = 2;
            let selection = [];

            const MAXWORDSINSEARCH = 8;
            const colors = ["#E7BEA2", "#73BDD5", "#FE8BA2", "#B9F707", "#FE3F72", "#15E6DB", "#E654C7", "#59E015", "#F9AB00"];
            const colortry = "#F9AB00";

            var setTitle = function (title) {
                $("#title").html(title);
            }

            var init = function () {
                $('#bySubject').tab('show')
                $("#showAnswers").on("click", toggleAnswer);
                $("#loadexisting").on("click", loadCategory);

                $("#generate").on("click", function () {
                    var input = $("#wordsInput").val().split("\n");
                    generate(input, $("#gridSizeInput").val(), $("#titleInput").val());
                    toggleAnswer();
                });
                DataUtils.init().then(f => {
                    Component.categoriesBlock("#categoriesInput", wordLibFilter, lang);
                    Component.languageBlock("#language", changeLanguage, lang);
                });
            }

            var toggleAnswer = function () {
                var checked = document.getElementById("showAnswers").checked;
                $(".answer").each(function (index) {
                    let color = checked || $(this).data("solved") ? $(this).data("color") : "white";
                    $(this).attr("fill", color);
                });
            }
                
            

            var loadCategory = function (e) {
                var selCatId = $("#categoriesInput").val();

                let words = DataUtils.Words.filter(w => wordLibFilter(w, lang) && w.category.includes(selCatId));
                words = words.map(w => w[lang]);
                while (words.length > MAXWORDSINSEARCH) {
                    words.splice(Math.floor(words.length * Math.random()), 1);
                }
                let category = DataUtils.Categories.find(c => c.id == selCatId);

                generate(words, 10, category[lang])
                toggleAnswer();
            }

            var generate = function (input, gridSize, title, showImages = true) {
                setTitle(title);

                $("#previewSvg,#outputTheme").empty();

                let alphabet = DataUtils.alphabets["eng"];
                if (DataUtils.alphabets[lang]) {
                    alphabet = DataUtils.alphabets[lang];
                }
                let words = convert(input, alphabet);

                let success = true;
                let grid = Array.create2DArray(gridSize);
                for (let w = 0; w < words.length; w++) {
                    let result = false;
                    let tries = 0;
                    while (!result && tries < 1000) {
                        let dir = Math.floor(Math.random() * 3);
                        let startX = Math.floor(Math.random() * (gridSize - words[w].length));
                        let startY = Math.floor(Math.random() * (gridSize - words[w].length));

                        if (dir == HORIZONTAL) {
                            startY = Math.floor(Math.random() * (gridSize));
                        }
                        if (dir == VERTICAL) {
                            startX = Math.floor(Math.random() * (gridSize));
                        }
                        let up = Math.random() < 0.5 ? true : false;
                        result = fillGrid(grid, words[w], startX, startY, up, dir, colors[w % colors.length]);
                        tries++;
                    }
                    success = success && result;

                }
                for (let i = 0; i < gridSize; i++) {
                    for (let j = 0; j < gridSize; j++) {
                        if (!grid[i][j]) {
                            grid[i][j] = {};
                            grid[i][j].letter = getRandomChar(alphabet);
                        }
                    }
                }
                if (success) {
                    printGrid(grid, width, height);
                    if (showImages) {
                        renderImages(words, lang);
                    }
                }
                printWords(words);
                $(".output").addClass("result-show");
            }

            function changeLanguage(l) {
                lang = l;
                Component.categoriesBlock("#categoriesInput", wordLibFilter, lang);
            }

            function wordLibFilter(wordItem, lang) {
                return wordItem.imageUrl && wordItem[lang]?.length <= 10;
            }

            function renderImages(words, lang) {
                let imageCount = 0;
                let imageWords = [];
                for (let i = 0; i < words.length; i++) {
                    let w = words[i].join("");
                    let res = DataUtils.Words.filter(f => f[lang] == w);
                    if (res.length) {
                        imageWords.push(res[0].imageUrl);
                    }
                }
                const maxImage = 5;
                while (imageWords.length > 5) {
                    let idxRemove = Math.floor(Math.random() * imageWords.length);
                    imageWords.splice(idxRemove, 1);
                }

                imageWords.forEach(imageUrl => {
                    const canvasRes = RenderUtils.createCanvas(152, 152, "outputTheme", "canvasTheme");
                    let canvas = canvasRes.canvas;
                    let ctx = canvasRes.context;
                    var img = RenderUtils.renderImage(ctx, "images/" + imageUrl, 0, 0, 150, "center");
                });
            }

            function convert(input, alphabet) {
                input = input.filter(f => f && f.length);
                input = input.map(f => f.toLowerCase());
                var regExp = alphabet.join("|");
                for (var i = 0; i < input.length; i++) {
                    var matches = input[i].matchAll(regExp);
                    var wordArr = new Array();
                    for (const match of matches) {
                        wordArr.push(match[0]);
                    }
                    input[i] = wordArr;
                }
                return input;
            }

            function fillGrid(grid, word, startX, startY, up, dir, color, check) {
                if (!check) {
                    if (!fillGrid(grid, word, startX, startY, up, dir, color, true))
                        return false;
                }
                for (var i = 0; i < word.length; i++) {
                    var idx = up ? i : word.length - i - 1;
                    var gridY = dir == VERTICAL || dir == DIAGONAL ? startY + i : startY;
                    var gridX = dir == HORIZONTAL || dir == DIAGONAL ? startX + i : startX; 
                    if (grid[gridX][gridY]) {
                        return false;
                    }
                    if (!check) {
                        grid[gridX][gridY] = {};
                        grid[gridX][gridY].letter = word[idx];
                        grid[gridX][gridY].word = word;
                        grid[gridX][gridY].color = color;
                    }
                }
                return true;
            }

            function printWords(words) {
                $("#words").empty();
                for (var i = 0; i < words.length; i++) {
                    $("#words").append("<span class='word'>" + words[i].join("") + "</span>");
                }
            }

            function printGrid(grid, width, height) {
                var svg = document.getElementById("previewSvg");
                var ns = "http://www.w3.org/2000/svg";
                svg.setAttribute("width", width + "");
                svg.setAttribute("height", height + "");

                svg.setAttribute("viewBox", "-30 -30 " + width + " " + height + "");
                var gridSize = grid.length;
                var step = width / gridSize;
                for (var i = 0; i < gridSize; i++) {
                    for (var j = 0; j < gridSize; j++) {

                        let optRect = { "data-x": i, "data-y": j, "data-color": grid[i][j].color, "class": "rect", "fill": "white", "stroke": "gray" };
                        if (grid[i][j].word) {
                            optRect["data-word"] = grid[i][j].word;
                        }
                        let x = (i % gridSize) * step - step / 2;
                        let y = (j % gridSize) * step - step / 2;
                        var rect = SvgUtils.createRect("r" + i + j, x, y, step, step, optRect);
                        if (grid[i][j].word) {
                            rect.setAttribute("class", "rect answer");
                        }
                        $(svg).append(rect);

                        var text = document.createElementNS(ns, "text");
                        text.setAttribute("x", (i % gridSize) * step + "");
                        text.setAttribute("y", (j % gridSize) * step + "");
                        text.setAttribute("font-size", width / (1.6 * gridSize));

                        text.setAttribute("class", "letter");
                        text.setAttribute("dominant-baseline", "middle");
                        text.setAttribute("fill", "black");

                        text.innerHTML = grid[i][j].letter;
                        $(svg).append(text);
                    }
                }

                $("#preview").append(svg);
               
                $(".rect").off().on('click', rectSelected);
            }

            function rectSelected() {
                let $this = $(this)
                let x = $this.data("x");
                let y = $this.data("y");
                let prev = {};
                if (selection && selection.length > 0) {
                    prev = selection[selection.length - 1];
                    if (Math.abs(prev.x - x) > 1 || Math.abs(prev.y - y) > 1) {
                        resetSelection(false);
                        return;
                    }
                }
                if (selection?.find(f => f.x == x && f.y == y)) {
                    if (prev.x == x & prev.y == y) {
                        resetOne(false, this);
                    }
                    return;
                }
                var word = $this.data("word");
                word = word ? word.split(",") : null;
                
                selection.push({ x, y, word });

                let correct = true;
                selection.forEach(function (f, idx) {
                    correct = correct && word && f.word && f.word.join("") == word.join("");

                });
                $this.addClass('selected');
                $this.data("beforefill", $this.attr("fill"));
                $this.attr("fill", colortry);

                if (correct && selection.length == word.length) {
                    resetSelection(true);
                }

            }

            function resetSelection(solved) {
                $(".selected.rect").each(function () { resetOne(solved, this); });
            }
            function resetOne(solved, rect) {
                selection?.pop();
                let $this = rect ? $(rect) : $(this);
                var color = solved ? $this.data("color") : ($this.data("beforefill") ? $this.data("beforefill") : "white");
                $this.attr("fill", color);
                $this.data("beforefill", null);
                solved = solved || $this.data("solved")
                $this.data("solved", solved);
                $this.removeClass("selected");
            }
            function getRandomChar(alphabet) {
                var idx = Math.floor(Math.random() * Math.floor(alphabet.length));
                return alphabet[idx];
            }

            return {
                init: init,
                generate: generate,
            }
        })();

        WordSearch.init();
});
