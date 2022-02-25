

define(['@firebase/app', '@firebase/analytics'], function (firebase) {
    var Analytics = function () {

        Analytics.prototype.init = function () {
            var firebaseConfig = {
                apiKey: "AIzaSyDHFuGnooeAWXGSu6q7FuiGnXq-BrVcw6k",
                authDomain: "clever-peep.firebaseapp.com",
                databaseURL: "https://clever-peep.firebaseio.com",
                projectId: "clever-peep",
                storageBucket: "clever-peep.appspot.com",
                messagingSenderId: "634062687813",
                appId: "1:634062687813:web:036ab1598343e88e301d2c",
                measurementId: "G-SMQV0X9Q03"
            };
            // Initialize Firebase
            firebase.initializeApp(firebaseConfig);
            firebase.analytics();
        }

        return { init: Analytics.prototype.init }
    }

    return Analytics();
});