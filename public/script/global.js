Global = {
  
};
Global.init = function () {
    requirejs.config({
        baseUrl: 'script',
        paths: {
            jquery: './lib/jquery-3.5.1',
            bootstrap: './lib/bootstrap.bundle.min',
            typeahead: './lib/typeahead.bundle',
            bloodhound: './lib/bloodhound',
            DataUtils: './data',
            Utils: './utils',
            RenderUtils: './utils',
            SvgUtils: './utils',
            component: './component',
            'react-component': './component-react',
            Airtable: './lib/airtable.browser',
            analytics: './analytics',
            '@firebase/app': 'https://www.gstatic.com/firebasejs/7.15.3/firebase-app',
            '@firebase/analytics': 'https://www.gstatic.com/firebasejs/7.15.3/firebase-analytics',
            'react': 'https://unpkg.com/react@15.3.2/dist/react',
            'react-dom': 'https://unpkg.com/react-dom@15.3.2/dist/react-dom',
            'dragula': './lib/dragula'
        },
        shim: {
            'typeahead': {
                deps: ['jquery'],

            },
            'bloodhound': {
                deps: ['jquery'],
            },
            'bootstrap': { deps: ['jquery'] },
        }
    });
    requirejs(['analytics'], function (analytics) {
        analytics.init();
    });
}

