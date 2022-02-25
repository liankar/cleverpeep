Global.init();


requirejs(['./data', './component', "Utils", "SvgUtils", 'jquery', 'bootstrap', 'bloodhound', 'typeahead'],
function(dataUtils, component, Utils, SvgUtils){
    'use strict';
    var WordScramble = (function () {

    const canvasSize = 400;
    let lang = Utils.getDefaultLanguage();

    const MINSCRAMBLECOUNT = 2;
    const MAXSCRAMBLECOUNT = 12;
    const MAXWORDLETTERS = 8;
    let regExpLetters = dataUtils.alphabets[lang].join("|");
   

        var init = function () {
            $('#bySubjectnav').tab('show')
            $("#loadone").on("click", WordScramble.loadOne);
            $("#selectCategory").on("click", function () {
                let selCat = $("#scrambleInputs").val();
                WordScramble.load(selCat);
            });

            dataUtils.init().then(f => {
                component.categoriesBlock("#scrambleInputs", wordLibFilter, lang);
                component.languageBlock("#language", changeLanguage, lang);
                dataUtils.initTypeahead('#typeaheadHolder', "wordInput", "words", lang, wordLibFilter);
            });

            component.tooltip(lang);
        }


    var load = function (count) {

         count = count ? count : MAXSCRAMBLECOUNT;
        $("#output").empty()
        var selCatId = $("#scrambleInputs").val();
        let words = dataUtils.Words.filter(w => wordLibFilter(w, lang) && w.category.includes(selCatId));
        while (words.length > MAXSCRAMBLECOUNT) {
            words.splice(Math.floor(words.length * Math.random()), 1);
        }
        let wordsOnly = words.map(w => w[lang]);

        let category = dataUtils.Categories.find(c => c.id = selCatId);

        setTitle(category[lang]);
        for (var i = 0; i < words.length; i++) {
            renderScrambleItemSvg("output", "word" + i, wordsOnly[i], "images/" + words[i].imageUrl, lang);
        }

    }
    var loadOne = function () {

        $("#output").empty();
        var findWord = $("#wordInput").val();

        let words = dataUtils.Words.filter(w => wordLibFilter(w, lang));
        let word = words.find(v => { return v[lang] == findWord });
        if (!word) {
            word = words[Math.floor(words.length * Math.random())];
        }
        renderScrambleItemSvg("output", "wordMyword", word[lang], "images/" + word.imageUrl, lang);
        // insert pin
        $(".scramble-item").append("<i />")
    }

    var setTitle = function (title) {
        $("#title").html(title);
    }


    var renderScrambleItemSvg = function (outputId, itemId, word, imageUrl, lang, hideImage, hideLetters) {
        var divId = "div" + itemId;
        $("#" + outputId).append("<div class='scramble-item' id='" + divId + "'></div>");
        const step = 50;
        word = convert(word, dataUtils.alphabets[lang]);

        var svg = SvgUtils.createSvg({ id: itemId + "SvgTop", width: canvasSize, height: canvasSize - 60, class: "item-svg-top" }, divId);

        const imgX = 125;
        const imgY = 150;
        var img = SvgUtils.createImage(itemId + "Image", imageUrl, imgX, imgY, 150, 150);
        $(svg).append(img);

        let n = word.length;
        let radius = 150;
        let alpha = Math.PI / (n - 1);
        let startrect = (canvasSize - 50 * n) / 2;
        let wordOriginal = Array.from(word);
        word = word.shuffle();
        var svgRect = SvgUtils.createSvg({ id: itemId + "SvgBottom", width: step * word.length, class: "item-svg-bottom" }, divId);
        var svgRes = SvgUtils.createSvg({ id: itemId + "SvgRes", width: 50, height: 50, class: "item-svg-result" }, divId);

        for (let i = 0; i < word.length; i++) {
            let curAlpha = alpha * i;
            if (curAlpha > Math.PI / 2) {
                curAlpha *= -1;
            }
            let x = canvasSize / 2 - radius * Math.cos(alpha * i);
            let y = canvasSize / 2 - radius * Math.sin(alpha * i);
            let optCircle = { "data-letter": word[i], "data-item": itemId, "data-index": i, "class": itemId + "-circle available" };
            var circle = SvgUtils.createCircle(itemId + "C" + i, x, y, 30, optCircle);
            $(svg).append(circle);


            if (!hideLetters || hideImage) {
                let optText = { class: itemId + "-letter available", "data-letter": word[i], "data-item": itemId, "data-index": i };
                var txt = SvgUtils.text(itemId + "T" + i, word[i], x, y + 7, optText);
                $(svg).append(txt);
            }

            let optRect = { "data-word": wordOriginal, "data-item": itemId, "data-rectid": itemId + "R" + i, class: itemId + "-rect available" };
            var rect = SvgUtils.createRect(itemId + "R" + i, i * step, 0, step, step, optRect);

            $(svgRect).append(rect);
        }
        $(".available." + itemId + "-circle, .available." + itemId + "-letter").on("click", showLetter);

    }
    function changeLanguage(l) {
        lang = l;
        component.categoriesBlock("#scrambleInputs", wordLibFilter, lang);

        dataUtils.initTypeahead('#typeaheadHolder', "wordInput", "words", lang, wordLibFilter);
        regExpLetters = dataUtils.alphabets[lang].join("|");

        component.tooltip(lang);
    }

    function wordLibFilter(wordItem, lang) {
        if (wordItem[lang]?.length) {
            var matches = wordItem[lang].matchAll(regExpLetters);
            let count = 0;
            for (const match of matches) {
                count++;
            }
            if (count > MAXWORDLETTERS) {
                return false;
            }
        }

        return wordItem.imageUrl && wordItem[lang]?.length;
    }

    function convert(word, alphabet) {
        word = word.toLowerCase();
        var matches = word.matchAll(regExpLetters);
        var wordArr = new Array();
        for (const match of matches) {
            wordArr.push(match[0]);
        }
        word = wordArr;
        return word;
    }

    function showLetter() {
        var $circleLetter = $(this);
        let itemId = $(this).data("item");
        let letter = $(this).data("letter");
        let index = $(this).data("index");

        if ($circleLetter.hasClass("available")) {
            $("#" + itemId + "C" + index).removeClass("available");
            $("#" + itemId + "T" + index).removeClass("available");

            let rectLetter = $(".available." + itemId + "-rect").first();
            rectLetter.removeClass("available");
            rectLetter.data("index", index);
            let optText = { "data-rectid": rectLetter[0].id };
            $("#" + itemId + "C" + index + ", #" + itemId + "T" + index).data("rectid", rectLetter[0].id);
            var txt = SvgUtils.text(rectLetter[0].id + "txt", letter, Number(rectLetter.attr("x")) + 25, Number(rectLetter.attr("y")) + 32, optText);
            rectLetter.after(txt);

            $(rectLetter).off().on("click", deleteLetter);
            $("#" + rectLetter[0].id + "txt").on("click", deleteLetter);

            let rectLeft = $(".available." + itemId + "-rect").first();
            if (!rectLeft.length) {
                let word = rectLetter.data("word").split(',');
                let correct = true;
                for (let i = 0; i < word.length; i++) {
                    let curLetter = $("#" + itemId + "R" + i + "txt").text();
                    if (curLetter != word[i]) {
                        correct = false;
                        break;
                    }
                }

                var img = SvgUtils.createImage(itemId + "Image", correct ? "res/yes.jpg" : "res/no.png", 0, 0, 30, 30, { "data-itemid": itemId, class: correct ? "yes" : "no" });
                $("#" + itemId + "SvgRes").append(img);
                if (!correct) {
                    $("#" + itemId + "SvgRes image").on("click", resetLetters);
                }
            }
        }
        else {

            var rectId = $($circleLetter).data("rectid");
        }

    }

    function resetLetters() {
        var itemId = $(this).data("itemid");
        var rects = $("." + itemId + "-rect:not(.available)");
        for (let i = 0; i < rects.length; i++) {
            let rectId = $(rects[i]).data("rectid");
            clearLetterBox(rectId);
        }
    }
    function deleteLetter() {
        var rectId = $(this).data("rectid");
        clearLetterBox(rectId);
    }
    function clearLetterBox(rectId) {
        let rect = $("#" + rectId);
        $("#" + rectId + "txt").remove();

        rect.addClass("available");
        let index = rect.data("index");
        let itemId = rect.data("item");
        rect.data("index", null);
        rect.off()
        $("#" + itemId + "C" + index).addClass("available");
        $("#" + itemId + "T" + index).addClass("available");

        $("#" + itemId + "SvgRes").empty();
    }

    return {init, load, loadOne, setTitle};

})();


 WordScramble.init();
});
