Global.init();
;
requirejs(['./data', './component', "Utils", "SvgUtils", "react", "react-dom", "dragula", 'jquery', 'bootstrap', 'bloodhound', 'typeahead'],
    function (DataUtils, Component, Utils, SvgUtils, React, ReactDOM) {

        ReactDOM.render(
            React.createElement('p', {}, 'Hello, AMD!'),
            document.getElementById('preview1')
        );
    });