define(['./data', "Utils"], function (dataUtils, Utils) {
   
    var Component = function () {

        Component.prototype.languageBlock = function (parentSelector, selectCallback, selected = null) {
            $(parentSelector).empty();
            if (!selected) {
                selected = Utils.getCookie("lang");
                if (!selected) {
                    selected = "eng";
                }
            }
            let divParent = '<div class="language-group">';
            for (let i = 0; i < dataUtils.languages.length; i++) {
                lang = dataUtils.languages[i];
                divParent += '<a href="javascript:;" data-lang="' + lang.id + '" class="badge badge-pill badge-secondary">' + lang.label + '</a>';

            }
            divParent += '</div>';

            $(parentSelector).append(divParent);
            $(parentSelector + " .badge[data-lang='" + selected + "']").toggleClass("badge-secondary badge-primary");
            $(parentSelector + " .badge").on("click", { callback: selectCallback }, languageChange);
        }


        function languageChange(param) {
            $(".language-group .badge-primary").removeClass("badge-primary").addClass("badge-secondary");
            $(this).removeClass("badge-secondary").addClass("badge-primary");
            let lang = $(this).data("lang");
            Utils.setCookie("lang", lang);
            param.data.callback.call(this, lang)

        }
        return {
            languageBlock: Component.prototype.languageBlock,
            categoriesBlock: Component.prototype.categoriesBlock,
            staticCategoriesBlock : Component.prototype.staticCategoriesBlock,
            tooltip: Component.prototype.tooltip
        }
    }
    Component.prototype.tooltip = function (lang) {
        $(".con-tooltip").on("mouseenter",function () {
            $(".con-tooltip .tooltip").html(dataUtils.Greetings[lang].random()).fadeIn(3000);;
        })
    }
    Component.prototype.staticCategoriesBlock = function (selectTag, categories) {
        $(selectTag).empty();
        var options = "";
        categories.forEach(function (cat) {
            options += "<option value='" + cat.id + "'>" + cat.label + "</option>";
        });
        $(selectTag).append(options);
    }
    Component.prototype.categoriesBlock = function (selectTag, wordFilterFunc, langId, mycat) {
        $(selectTag).empty();
        let langOptions = "";
        let lang = dataUtils.languages.find(l => l.id == langId);
        var optgroup = "<optgroup id='" + lang.id + "' label='" + lang.label + "'>";
        let empty = true;
    
        dataUtils.Categories.forEach(function (cat, idx) {
            if (dataUtils.Words.filter(w => wordFilterFunc(w, lang.id) && w.category.includes(cat.id)).length > 0) {
                optgroup += "<option value='" + cat.id + "' data-lang='" + lang.id + "' >" + cat[lang.id]?.capitalize() + "</option>";
                empty = false;
            }
        });
        optgroup += "</optgroup>";
        if (!empty) {
            $(selectTag).append(optgroup);
        }

    }
    return Component();
});