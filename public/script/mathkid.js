Global.init();

requirejs(['./data', './component', 'SvgUtils', 'Utils', 'jquery', 'bootstrap', 'bloodhound', 'typeahead'],
function(dataUtils, component, SvgUtils, Utils){

var MathKid = (function() {
    const canvasSize = 700;
    var lang = 'eng';

    const MINSCRAMBLECOUNT = 2;
    const MAXSCRAMBLECOUNT = 12;
    const MAXWORDLETTERS = 8;
    let regExpLetters = dataUtils.alphabets[lang].join("|");
   

    var init = function() {
        $('#bySubjectnav').tab('show')
        $("#loadone").on("click", MathKid.loadOne);
        $("#selectCategory").on("click", function () {
            let selCat = $("#mathinputs").val();
            MathKid.load(selCat);
		});
        var mycategories = [{id:"3dthinking", label:"3D thinking"}, {id: "logic", label:"Logic"}
        ,{id:"puzzles", lable: "Math puzzles"},
        {id:"order", label: "Set in order"}];

        dataUtils.init().then(f => {
            component.staticCategoriesBlock("#mathinputs", mycategories);
           
        });
    }

    var load = function (count) {

         count = count ? count : MAXSCRAMBLECOUNT;
        $("#output").empty()
        var selCatId = $("#mathinputs").val();
        var itemId = "math";
        let radius = 150;
        renderMathItemSvg("output",itemId,radius);
          
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


    var renderMathItemSvg = function (outputId, itemId,radius) {
        var svg = SvgUtils.createSvg({ id: itemId + "SvgTop", width: canvasSize, height: canvasSize, class: "item-svg-top" }, outputId);
        
        var pointX = 50;
        var pointY = 50;
        let shapes = [];
        shapes.push(
            {id: "circle1", shape: "circle", color:"blue",
            x: Utils.random(10, 100), y:Utils.random(10, 100), 
            radius: Utils.random(40, 100)});
        shapes.push(
            {id: "rect1", shape: "rect", color:"orange", 
            x:5, y:10, width: 100, height: 80},
           );
           
        shapes.push( 
            {id: "triangle1", shape: "triangle", color:"blue", x: 55, y :110, size:40});

        shapes.shuffle();

        for(let i= 0; i < shapes.length; i++)
        {
            drawShape(svg, shapes[i]);
        }
    }


    function drawShape(svg, figure)
    {
        var opt =  { "fill" : figure.color, "stroke": "gray" };
        var svgShape;
        switch (figure.shape) {
            case "rect":
                {
                    opt["class"] = "math-rect";
                    svgShape = SvgUtils.createRect(figure.id, figure.x, figure.y, figure.width, figure.height, opt);
                }
                break;

                case "circle":
                    {
                        opt["class"] = "math-circle available";
                        svgShape = SvgUtils.createCircle(figure.id , figure.x, figure.y, figure.radius, opt);  

                    }
                    break;

                case "triangle":
                    {
                        opt["class"] = "math-triangle available";
                        svgShape = SvgUtils.createTriangle(figure.id , figure.x, figure.y, figure.size, opt);  
   
                    }
                    break;

        
                default:
                    break;
                }

                
            svg.append(svgShape);
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


 MathKid.init();
});
