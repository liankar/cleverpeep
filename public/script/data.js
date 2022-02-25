define(['./lib/airtable.browser', './lib/bloodhound','./lib/bootstrap3-typeahead'], function () {
    var instance = null;

    var DataUtils = function () {
        DataUtils.prototype.Categories = new Array();
        DataUtils.prototype.Words = new Array();
        DataUtils.prototype.languages = [{ id: "arm", label: "Armenian" }, { id: "rus", label: "Russian" }, { id: "esp", label: "Spanish" }, { id: "eng", label: "English" }];


        var init = function () {
            if (DataUtils.prototype.Words?.length > 0 && DataUtils.prototype.Categories?.length > 0) {
                return;
            }
            var Airtable = require('airtable');
            var base = new Airtable({ apiKey: 'keyRzs7OfAImIelMB' }).base('appr7mZgsqUgBrikX');

            let promiseWords = loadWords(base);
            let promiseCategories = loadCategories(base);

            return Promise.all([promiseWords, promiseCategories]);
        }
        function loadWords(base) {
            DataUtils.prototype.Words.length = 0;
            var queryWords = base('WordsLib').select({
                view: "Grid view"
            });
            let promiseWords = new Promise(function (resolve, reject) {
                queryWords.eachPage(function page(records, fetchNextPage) {
                    // This function (`page`) will get called for each page of records.

                    records.forEach(function (record) {
                        DataUtils.prototype.Words.push(record.fields);

                    });

                    // To fetch the next page of records, call `fetchNextPage`.
                    // If there are more records, `page` will get called again.
                    // If there are no more records, `done` will get called.
                    fetchNextPage();

                }, function done(err) {
                    if (err) { console.error(err); reject(); return; }
                    resolve();
                })
            });
            return promiseWords;
        }
        function loadCategories(base) {
            DataUtils.prototype.Categories.length = 0;
            var queryWords = base('CategoryLib').select({
                view: "Grid view"
            });
            let promiseCategory = new Promise(function (resolve, reject) {
                queryWords.eachPage(function page(records, fetchNextPage) {
                    records.forEach(function (record) {
                        DataUtils.prototype.Categories.push(record.fields);
                    });
                    fetchNextPage();
                }, function done(err) {
                    if (err) { console.error(err); reject(); return; }
                    resolve();
                })
            });
            return promiseCategory;
        }
        function loadGreetings(lang) {
            DataUtils.prototype.Greetings[lang].length = 0;
           
            var Airtable = require('airtable');
            var baseGreetings = new Airtable({ apiKey: 'keyRzs7OfAImIelMB' }).base('appyb4flg5yKX0MhC');
            
            var queryGreetings = baseGreetings('Greetings').select({
                view: "Grid view",
                filterByFormula: function(f){ f.lang == lang }
            });
            let promiseGreetings = new Promise(function (resolve, reject) {
                queryGreetings.eachPage(function page(records, fetchNextPage) {
                    records.forEach(function (record) {
                        DataUtils.prototype.Greetings[lang].push(record.fields);
                    });
                    fetchNextPage();
                }, function done(err) {
                    if (err) { console.error(err); reject(); return; }
                    resolve();
                })
            });
            return promiseGreetings;
        }

        var initTypeahead = function (selectorParent, inputId, placeholder, lang = "eng", filterFunc = null) {
            $(selectorParent).empty();
            let input = '<input class="form-control typeahead" autocomplete="no" id="' + inputId + '" placeholder="' + placeholder + '" />';
            $(selectorParent).append(input);
            let localWords = new Array();
            if (lang == "all") {
                for (let i = 0; i < DataUtils.languages.length; i++) {
                    let lang = DataUtils.languages[i].id;
                    localWords = localWords.concat(DataUtils.prototype.Words
                        .filter(f => f[lang]?.length)
                        .map(f => f[lang]));
                }
            }
            else {
                localWords = DataUtils.prototype.Words.filter(f => f[lang]?.length && (!filterFunc || filterFunc(f, lang))).map(f => f[lang]);
            }
            var wordBloodhound = new Bloodhound({
                datumTokenizer: Bloodhound.tokenizers.whitespace,
                queryTokenizer: Bloodhound.tokenizers.whitespace,
                local: localWords
            });
            wordBloodhound.initialize();

            $(".typeahead").typeahead({
                name: 'words' + lang,
                source: wordBloodhound.ttAdapter(),
                hint: true,
                minLength: 1, /* Specify minimum characters required for showing suggestions */
                autoSelect: true,
                showHintOnFocus: true,

            });
            $(".typeahead").attr("autocomplete", "no");
        }

        DataUtils.prototype.alphabets = new Array();
        DataUtils.prototype.alphabets["eng"] = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
        DataUtils.prototype.alphabets["arm"] = ['ա', 'բ', 'գ', 'դ', 'ե', 'զ', 'է', 'ը', 'թ', 'ժ', 'ի', 'լ', 'խ', 'ծ', 'կ', 'հ', 'ձ', 'ղ', 'ճ', 'մ', 'յ', 'ն', 'շ', 'ու', 'ո', 'չ', 'պ', 'ջ', 'ռ', 'ս', 'վ', 'տ', 'ր', 'ց', 'փ', 'ք', 'և', 'օ', 'ֆ'];
        DataUtils.prototype.alphabets["rus"] = ['а', 'б', 'в', 'г', 'д', 'е', 'ё', 'ж', 'з', 'и', 'й', 'к', 'л', 'м', 'н', 'о', 'п', 'р', 'с', 'т', 'у', 'ф', 'х', 'ц', 'ч', 'ш', 'щ', 'ъ', 'ы', 'ь', 'э', 'ю', 'я'];
        DataUtils.prototype.alphabets["esp"] = ['a', 'á', 'b', 'c', 'd', 'e', 'é', 'f', 'g', 'h', 'i', 'í', 'j', 'k', 'l', 'm', 'n', 'ñ', 'o', 'ó', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

        DataUtils.prototype.Greetings = new Array();
        DataUtils.prototype.Greetings["arm"] = ["Բարև իմ ընկեր", "Բարի օր", "Բարի գալուստ", "ՈՒրախ եմ որ եկար", "Կարոտել էի քեզ", "Ողջու՜յն", "Ինչ՞ օր է այսօր։", "Կարո՞ղ ես ինձ ասել Ժամը քանիսն է", "Հուսով եմ քեզ դուր կգա իմ խաղը",];
        DataUtils.prototype.Greetings["esp"] = ["¡Hola mi amigo!", "¡Buenos días!", "¡Bienvenidos!", "Feliz de que vinieras", "Te extrañe", "mucho gusto", "¿Qué día es hoy?", "¿Que hora es?", "Espero que te guste mi juego",];
        DataUtils.prototype.Greetings["rus"] = ["Привет я медуза нелли", "Привет, мой друг!", "Добрый день!", "Добро пожаловать!", "Я очень рада тебя видеть!", "Я уже соскучилась", "Рад, что ты вернулся", "Какой сегодня день?", "Не могли бы вы сказать мне, который час?", "Надеюсь, вам понравилась моя игра", "Холодно? или это только мне кажется",]
        DataUtils.prototype.Greetings["eng"] = ["Hi, I'm Jelly Nelly", "Hello my friend!", "Good day!", "Welcome!", "I am very glad to see you!", "I already miss you", "Glad you are back", "What day is today?", "Could you tell me what time is it?", "I hope you'll enjoy my game", "Is it cold? or it's just me", ];
        return {
            init: init,
            initTypeahead: initTypeahead,
            alphabets: DataUtils.prototype.alphabets,
            languages: DataUtils.prototype.languages,
            Words: DataUtils.prototype.Words,
            Categories: DataUtils.prototype.Categories,
            Greetings: DataUtils.prototype.Greetings,
            loadGreetings : DataUtils.prototype.loadGreetings
        }
    }
   
    return DataUtils();
});