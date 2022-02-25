Global.init();

requirejs(['./data', './component', "Utils", "SvgUtils",'jquery', 'bootstrap', 'bloodhound', 'typeahead'],
    function (DataUtils, Component, Utils, SvgUtils) {

        var Coloring = (function () {
            let lang = Utils.getDefaultLanguage();
            let svg = null;
            const WORDS_PER_PAGE = 8;
            var init = function () {
                $('#alphabetNav').tab('show')
                $("#loadWord").on("click", loadWord);
                $("#loadLetter").on("click", loadLetter);

                $("#loadSentence").on("click", loadSentence);

                DataUtils.init().then(function () {

                    DataUtils.initTypeahead("#typeaheadHolder", "wordInput", "type in character to start", lang);
                });
                Component.languageBlock("#language", changeLanguage, lang);
                $("#alphabetLetters").empty();
                for (let i = 0; i < DataUtils.alphabets[lang].length; i++) {
                    $("#alphabetLetters").append("<option value='" + i + "'>" + DataUtils.alphabets[lang][i] + "</option>");
                }

            }

            var loadLetter = function () {
                clear(1);
                let idx = $("#alphabetLetters").val();
                let letter = DataUtils.alphabets[lang][idx];
                let wordsMeta = DataUtils.Words.filter(f => f[lang]?.startsWith(letter) && f.level <= 1);
                wordsMeta.randomReduce(WORDS_PER_PAGE);
                var length = 0;
                wordsMeta.forEach(f => length = Math.max(length, f[lang].length));

                let svgLetter = SvgUtils.createSvg({ id: "svgLetter", class: "svg-color-letter", width: "511", height: "330" }, "preview1");
                let svgText = SvgUtils.createSvg({ id: "svgText", height: wordsMeta.length * 50 + 20, width: length * 25 + 60, class: "svg-color-text" }, "preview1");
                let svgImage = SvgUtils.createSvg({ id: "svgImage", class: "svg-color-image", "viewBox": "0 0 100 100" }, "preview1");

                let optText = {};
                let letterText = SvgUtils.text("letterT", letter.toUpperCase() + "" + letter.toLowerCase(), 0, 255, optText);
                $(svgLetter).append(letterText);



                let line = 50;
                for (let i = 0; i < Math.min(WORDS_PER_PAGE, wordsMeta.length); i++) {
                    let txt = SvgUtils.text("T" + i, wordsMeta[i][lang], 10, line * (i + 1), {});
                    $(svgText).append(txt);
                }

                let colorImages = wordsMeta.filter(f => f.colorUrl?.length);
                if (colorImages?.length) {
                    let imgWord = colorImages.random();
                    let img = SvgUtils.createImage(null, "images/coloring/" + imgWord.colorUrl, 0, 0, 100, 100);
                    $(svgImage).append(img);
                }

                $("#preview1").append("<div id='secondPage' class='page-break'></div>");
                let line2 = 100;
                let svgText2 = SvgUtils.createSvg({ id: "svgText2", height: wordsMeta.length * 100 + 20, width: length * 35, class: "svg-write-text" }, "secondPage");
                for (let i = 0; i < Math.min(WORDS_PER_PAGE, wordsMeta.length); i++) {
                    let txt = SvgUtils.text("tw" + i, wordsMeta[i][lang], 10, line2 * (i + 1), {});
                    $(svgText2).append(txt);
                    let ln = SvgUtils.createLine("l" + i, 0, line2 * (i + 1) + 5, "100%", line2 * (i + 1) + 5, { class: "svg-write-line" });
                    $(svgText2).append(ln);
                }


            }

            var loadWord = function () {
                clear(2)
                let svgWord = SvgUtils.createSvg({ id: "svgSentence", class: "svg-color-word" }, "preview2");

                var word = $("#wordInput").val();

                let wordMeta = DataUtils.Words.find(f => f[lang] == word);
                if (wordMeta && wordMeta.colorUrl?.length) {
                    var img = SvgUtils.createImage(null, "images/coloring/" + wordMeta.colorUrl, 0, 220, 1000);
                    $(svgWord).append(img);
                }
                let optText = {};
                let txt = SvgUtils.text("T", word, 0, 200, optText);
                $(svgWord).append(txt);
            }

            var clear = function (idx) {
                $("#preview" + idx).empty();

            }

            var loadSentence = function () {
                clear(3);
                let svgSentence = SvgUtils.createSvg({ id: "svgSentence", class: "svg-color-sentence" }, "preview3");
                let sentence;
                if (lang == "arm") {
                    sentence = randomSentenceArm();
                }
                else {
                    sentence = randomSentence();
                }

                let txt = SvgUtils.text("sentenctT", sentence, 10, 100);
                $(svgSentence).append(txt);
            }

            function randomSentence() {
                var adjWho = [
                    "kind",
                    "intelligent",
                    "loyal",
                    "attractive",
                    "goofy",
                    "creative",
                    "clever",
                    "strong",
                    "friendly",
                    "fierce",
                    "confident",
                    "optimistic",
                    "determined",
                    "helpful",
                    "brave",
                    "honest",
                    "modest",
                    "serious",
                    "fat",
                    "short",
                    "heavy",
                    "old",
                    "ugly",
                    "stupid",
                    "lazy",
                    "successful",
                    "stubborn",
                    "shy",
                    "pretty",
                    "moody",
                    "middle-aged",
                    "adventurous",
                    "blond",
                    "cheerful",
                    "chatty",
                    "cold",
                    "funny",
                    "mean",
                    "ordinary-looking",
                    "pessimistic",
                    "tall",
                    "thin",
                    "young",
                    "polite",
                    "giant",
                    "smart"];

                var didWhat = ["colored",
                    "took",
                    "threw",
                    "dropped",
                ];

                var action = new Array();
                var objects = new Array();
                var adjs = new Array();
                var how = new Array();

                action.push(["wrote", "read", "translated", "saved", "sent", "gave"]);
                objects.push(["book", "note", "program", "paragraph"]);
                adjs.push(["long", "short", "historical", ""]);
                how.push(["slowly", "quietly", "silently",  "awkwardly", "quickly"]);
                    
                action.push(["wrote with"]);
                objects.push(["pen", "pencil", "marker"]);
                adjs.push([""]);
                how.push(["", "awkwardly", "silently", "slowly", "quietly", "quickly",]);


                action.push(["cleaned", "sanitized"]);
                objects.push(["ship", "house", "plate", "knife"]);
                adjs.push(["", "blue", "big", "small", "yellow", ]);
                how.push(["", "cheerfully", "silently", "quietly", "carefully", "joyfully", "politely", "volunterily", "kindly", "happily",]);


                action.push(["sat on", "jumped on", "lay on", "stand on", "dreamed of"]);
                objects.push(["chair", "sofa", "couche", "floor", "sand", "ship", "shelf"]);
                adjs.push(["", "soft", "green", "big", "tiny",]);
                how.push(["", "cheerfully", "silently", "quietly", "quickly", "joyfully", "politely", "volunterily", "kindly", "happily",]);

                action.push(["ate", "bought", "sold", "grew", "took out of the fridge", "donated", "dreamed of"]);
                objects.push(["salad", "tomato", "apple", "banana", "candy", "bread", "food", "egg", "bean"]);
                adjs.push(["salty", "stale", "sweet", "pricy", "ripe", "rotten", "soft", "rich", "greasy", "red", "blue", "yellow"]);
                how.push(["","cheerfully","immidiatly","anxiosly", "awkwardly","slowly", "suddenly"])

                action.push(["saw", "spotted", "dreamed of", "hit"]);
                objects.push(["ship", "snail", "snake", "lion", "deer", "mouse"]);
                adjs.push(["", "spooky", "scary","tiny","giant" ]);
                how.push(["", "suddenly"]);

                action.push(["closed", "opened", "smashed", "hit"]);
                objects.push(["door", "book", "backpack"]);
                adjs.push(["black", "white", "tiny", "large"]);
                how.push(["furiously", "instantly", "joyfully", "loudly", "quietly", "quickly", ""])

                action.push(["looked into"]);
                objects.push(["mirror"]);
                adjs.push(["", "round", "square"]);
                how.push([""]);

                action.push(["saw", "went to", "walked to", "run to", "drove to"]);
                objects.push(["school", "building"]);
                adjs.push(["", "red", "blue", "yellow"]);
                how.push([""]);


                action.push(["played", "bought"]);
                objects.push(["piano", "violin", "guitar", "ball"]);
                adjs.push(["", "red", "blue", "yellow"]);
                how.push([""]);

                action.push(["saw"]);
                objects.push(["sun", "smile", "tooth", "snout",  "shoe", "gift", "box", "car", "train",  "pocket", "sword",]);
                adjs.push(["", "red", "blue", "yellow"]);
                how.push([""]);

                //action.push([""]);
                //objects.push([""]);
                //adjs.push([""]);
                //how.push([]);


                var when = ["in the year 350 BC",
                    "on a Thanksgiving day",
                    "on Friday 13th",
                    "during the full moon",
                    "on a Monday morning",
                    "many moons ago",
                    "Long long time ago",
                    "once upon a time",
                    "few days back",
                    "on a cold frosty winter day",
                    "on a hot sunny summer day",
                    "on a windy spring day",
                    "during the summer holidays",
                    "when the COVID19 just started",

                    "suddenly", "several light years ago",
                    "sometime in past", "some centuries back",
                    "second year in a row"];
                var where = [
                    "in the kitchen of Buckingham Palace",
                    "on the edge of a cliff",
                    "at the beach",
                    "in concert hall",
                    "on a fishing boat",
                    "in coffee house",
                    "in a castle",
                    "on a lighthouse",
                    "in park",
                    "in nursing home",
                    "on a rocket sh]p",
                    "in prison",
                    "in police station",
                  "in rainforest",
                    "in shopping mall",
                    "in the zoo",
                    "on a farm",
                    "in the White House",
                    "in Hollywood",
                    "on a canal in Venice",
                    "in coal mine",
                    "in a bookstore",
                    "on a bridge",
                   "in the circus",];

        var who = ["Clever Peep",
            "bunny",
            "fish",
            "baby Leo",
            "Peep's friend",
            "granny",
            "professor",
            "boy",
            "alien",
            "king",
            "prince",
            "baby",
            "reporter",
            "sheep",       "pig",
            "giraffe",
            "scientist", "spider",];
        var rndIdx = Math.floor(Math.random() * action.length); Idx = Math.floor(Math.random() * action.length);

        let sentence = when.random() + " " +
            where.random() + " the " +
            adjWho.random() + " " +
            who.random() + " " +
            how[rndIdx]?.random() + " " +
            action[rndIdx].random() + " a " +
            adjs[rndIdx]?.random() + " " +
            objects[rndIdx].random();
        return sentence;
    }

            function randomSentenceArm() {
                var adjWho = ["Բարի",
                    "հավատարիմ",
                    "գրավիչ",
                    "հիմար",
                    "ստեղծագործ",
                    "խելացի",
                    "ուժեղ",
                    "ընկերասեր",
                    "զայրացած",
                    "վստահ",
                    "լավատես",
                    "վճռական",
                    "օգտակար",
                    "քաջ",
                    "ազնիվ",
                    "համեստ",
                    "լուրջ",
                    "չաղ",
                    "կարճ",
                    "ծանր",
                    "ծեր",
                    "տգեղ",
                    "հիմար",
                    "ծույլ",
                    "հաջողակ",
                    "համառ",
                    "ամաչկոտ",
                    "գեղեցիկ",
                    "միջին տարիքի",
                    "արկածախնդիր",
                    "շիկահեր",
                    "ուրախ",
                    "զվարճալի",
                    "անխիղճ",
                    "սովորական մի",
                    "հոռետես",
                    "բարձրահասակ",
                    "երիտասարդ",
                    "քաղաքավարի",
                    "հսկա",
                    "խելացի",
                ];
                var action = new Array();
                var objects = new Array();
                var adjs = new Array();
                var how = new Array();
              
                action.push(["գրեց", "կարդաց", "թարգմանեց", "ուղարկեց", "տվեց", ]);
                objects.push(["գիրքը", "նշումը", "ծրագիրը", "նամակը" ]);
                adjs.push(["", "երկար", "կարճ", "պատմական",]);
                how.push(["դանդաղ", "հանգիստ", "լուռ", "արագ","ուշադիր"]);

                action.push(["գրեց"]);
                objects.push(["գրիչով", "մատիտով"]);
                adjs.push(["կարմիր","կանաչ"]);
                how.push(["դանդաղ", "հանգիստ", "լուռ", "արագ",]);


                action.push(["մաքրեց"]);
                objects.push(["նավը", "տունը", "ափսեն", "դանակը",]);
                adjs.push(["Կապույտ","մեծ","փոքր","դեղին",]);
                how.push([""]);

                action.push(["նստեց", "ցատկեց", "պառկեց","կանգնում է",]);
                objects.push(["աթոռին",
                    "բազմոցին",
                    "թախտին",
                    "հատակին",
                    "ավազի վրա",
                    "նավի վրա",
                    "դարակին",]);
                adjs.push(["փափուկ",
                    "կանաչ", "մեծ", "փոքրիկ",]);
                how.push(["", "ուրախությամբ", "լուռ", "լուռ", "արագ", "ուրախությամբ", "քաղաքավարի", "կամավոր", "բարյացակամ", "երջանիկ",]);

                var didWhat = ["ուղարկեց",
                    "տեսավ", "նկատեց", "փրկեց", "կերավ", "վերցրեց", "դրեց", "տվեց", "հաղթեց",
                    "ազատեց", "գնեց", "վաճառեց", "հետաձգեց", "ստացավ", "հրեց", "քաշեց", "կախեց"];

                var adj = ["խելացի", "շողշողացող", "մակերեսային", "համառ", "արևոտ", "ձյունոտ", "նիհար",
                    "խորամանկ", "վախկոտ", "տխուր", "աղի", "ուժեղ", "կարմիր", "Կապույտ", "կանաչ",
                    "նարնջագույն", "դեղին", "շագանակագույն", "մոխրագույն", "մանուշակագույն", "վարդագույն",
                    "հանգիստ", "լավ", "գեղեցիկ", "տգեղ", "սարսափելի", "հիանալի", "ծանր", "լույս", "մեծ", "փոքր",
                    "կարճ", "երկար", "խոնավ", "թաց", "չոր", "հարթ", "ավազոտ"];

                var how1 = ["դանդաղ", "արագ", "ուժեղ", "թեթև", "երջանիկ", "հեշտությամբ",
                    "բարձրաձայն", "տխուր", "լուռ", "հանգիստ",];

                var when = ["հանկարծ", "մի քանի տարի առաջ", "ինչ-որ ժամանակ անցյալում",
                    "դարեր առաջ", "երեք տարի առաջ", "երեկ", "անցած շաբաթ", "անցած ամիս",
                    "արևածագից առաջ", "գիշերը", "օրվա ընթացքում", "մ.թ.ա. 350 թվականին",
                    "նոր տարվա օրը",
                    "ուրբաթ 13-ին",
                    "լիալուսնի ընթացքում",
                    "երկուշաբթի առավոտյան",
                    "տարիներ առաջ",
                    "շատ վաղուց",
                    "Ժուկով ժամանակով",
                    "օրեր առաջ",
                    "մի ցրտաշունչ ձմեռային օր",
                    "մի տաք արեւոտ ամառային օր",
                    "քամոտ գարնանային օրը",
                    "ամառային արձակուրդների ընթացքում",
                    "երբ COVID19- ը նոր էր սկսվել",];

                var where = [
                    "երկրի մակերևույթի տակ", "առագաստանավի վրա", "խանութում",
                    "ինչ-որ տեղ", "տանը", "դպրոցում", "քաղաքում", "աշխարհում շատ հեռու",
                    "Լուսնի վրա", "օվկիանոսի մեջտեղում", "գետի վրա", "մեքենայում",
                    "ինքնաթիռում", "հեքիաթային աշխարհում", "Բուքինգհեմյան պալատի խոհանոցում",
                    "ժայռի եզրին",
                    "ծովափում",
                    "համերգասրահում",
                    "ձկնորսական նավակի վրա",
                    "սրճարանում",
                    "դղյակում",
                    "փարոսում",
                    "այգում",
                    "ծերանոցում",
                    "հրթիռային նավի վրա",
                    "բանտում",
                    "ոստիկանական բաժանմունքում",
                    "անձրևոտ անտառում",
                    "առևտրի կենտրոնում",
                    "կենդանաբանական այգում",
                    "ֆերմայում",
                    "Սպիտակ տանը",
                    "Հոլիվուդում",
                    "ջրանցքի վրա Վենետիկում",
                    "ածուխի հանքավայրում",
                    "գրախանութում",
                    "կամուրջի վրա",
                    "կրկեսում",
];

                var who = ["նա", "գիտնականը", "սարդը",
                    "տիեզերագնացը", "վաճառողը",
                    "աղջիկը", "տղան", "մայրը", "հայրը", "եղբայրը", "քույրը", "տատիկը", "պապը",
                    "արջը", "առյուծը", "խոզը", "ձին", "մկնիկը", "շունը", "կատուն", "Խելացի Փիփը",
                    "նապաստակը",
                    "ձուկը",
                    "երեխան Լեո",
                    "Փիփի ընկերը",
                    "տատիկը",
                    "պրոֆեսորը",
                    "տղան",
                    "թագավորը",
                    "արքայազնը",
                    "երեխան",
                    "զեկուցողը",
                    "ոչխարը",
                    "խոզը",
                    "ընձուղտը",
                    "սարդը",
];

                var what = ["արևը", "խխունջը", "օձը", "ժպիտը",
                    "նավը", "երգը", "աղցանը", "ավազը", "զգեստը", "դարակը", "մեքենան", "կոշիկները",
                    "ամպը", "երկինքը", "լուսինը", "լույսը", "տունը",];

                var rndIdx = Math.floor(Math.random() * action.length);

               
                let sentence = when.random().capitalize() + " " + where.random() + " " +
                    adjWho.random() + " " +
                    who.random() + " " +
                    how[rndIdx]?.random() + " " +
                    action[rndIdx].random() + " " +
                    adjs[rndIdx]?.random() + " " +
                    objects[rndIdx]?.random()+ ":"; 

                   // how.random() + " " + didWhat.random() + " " + adj.random() + " " + what.random();
                return sentence;
            }

            function changeLanguage(l) {
                lang = l;
                DataUtils.initTypeahead("#typeaheadHolder", "wordInput", "type in character to start", lang);

                $("#alphabetLetters").empty();
                for (let i = 0; i < DataUtils.alphabets[lang].length; i++) {
                    $("#alphabetLetters").append("<option value='" + i + "'>" + DataUtils.alphabets[lang][i] + "</option>");
                }
            }
            return { init: init };
        })();

        Coloring.init();
    });