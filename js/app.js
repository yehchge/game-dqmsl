var app = angular.module('app', ['dqmslFilters', 'dqmslDirectives']);

app.controller('MainCtrl', ['$scope', '$http', '$q',
    function ($scope, $http, $q) {
        var mon_table_url = "https://docs.google.com/spreadsheets/d/1t5RLFv4_-sETdjoPDLtxzne9f3LZ5oTJNNmIo-FvFNs/edit#gid=0",
            translate_table_url = "https://docs.google.com/spreadsheets/d/1OxnRYBphBg7SZwewlEOTspmtQgXryNlTbiqkOlEZVe8/edit#gid=0",
            translatemon_table_url = "https://docs.google.com/spreadsheets/d/1pRcgKOe3Hpz-06krzifsVXzkqy0Qt78AIsdc6pcIoJM/edit#gid=0",
            skill_table_url = "https://docs.google.com/spreadsheets/d/1EP04V81V3kNrvJPISTvJ17O2qBBb7rergNn_7nmjZrg/edit#gid=0",
            regex_col_name = /gsx\$/;

        function parseSpreadSheetJsonUrl(url) {
            var regexSpreedsheetKey = /[0-9a-zA-Z_-]{44}/,
                regexSpreedsheetGid = /gid=[0-9]+/,
                gidParsed,
                gid,
                jsonUrl;
            if (regexSpreedsheetGid.test(url)) {
                gidParsed = url.match(regexSpreedsheetGid)[0].replace('gid=', '');
                gid = (gidParsed === "0") ? "od6" : gidParsed;
                jsonUrl = 'https://spreadsheets.google.com/feeds/list/' + url.match(regexSpreedsheetKey) + '/' + gid + '/public/values?alt=json';
                return jsonUrl;
            } else {
                console.log('data sheet url format error');
            }
        }
        $scope.skill_query_result = []

        var ajax_mon_table = $http.get(parseSpreadSheetJsonUrl(mon_table_url)),
            ajax_translate_table = $http.get(parseSpreadSheetJsonUrl(translate_table_url)),
            ajax_translate_mon_table = $http.get(parseSpreadSheetJsonUrl(translatemon_table_url)),
            ajax_skill_table = $http.get(parseSpreadSheetJsonUrl(skill_table_url));

        $q.all([ajax_mon_table, ajax_translate_table, ajax_translate_mon_table, ajax_skill_table]).then(function (result) {
            var translate = [];
            var translate_mon = [];
            var monster = [];
            var skill = [];

            // 中日對照
            angular.forEach(result[1].data.feed.entry, function (el, i) {
                var m = {};
                if (el['gsx$日文名稱'].$t && el['gsx$中文名稱'].$t) {
                    m.jp = el['gsx$日文名稱'].$t;
                    m.zh = el['gsx$中文名稱'].$t;
                    translate.push(m);
                }
            });

            // 怪物圖鑑資料
            angular.forEach(result[0].data.feed.entry, function (el, i) {
                var m = {};
                for (var col in el) {
                    if (regex_col_name.test(col)) {
                        var key = col.replace(regex_col_name, "");
                        m[key] = el[col].$t;
                    }
                }
                monster.push(m);
            });

            // 怪物圖鑑資料
            angular.forEach(result[2].data.feed.entry, function (el, i) {
                var m = {};
                for (var col in el) {
                    if (regex_col_name.test(col)) {
                        var key = col.replace(regex_col_name, "");
                        m[key] = el[col].$t;
                    }
                }
                translate_mon.push(m);
            });

            // 特技資料
            angular.forEach(result[3].data.feed.entry, function (el, i) {
                var m = {};
                for (var col in el) {
                    if (regex_col_name.test(col)) {
                        var key = col.replace(regex_col_name, "");
                        m[key] = el[col].$t;
                    }
                }
                skill.push(m);
            });

            $scope.monster = monster;
            $scope.translate = translate;
            $scope.translate_mon = translate_mon;
            $scope.skill = skill;
            //console.log(skill);
        });
        $scope.greaterThan = function (prop, val) {
            return function (item) {
                return item[prop] >= val;
            };
        };

        $scope.querySkill = function (str) {
            //console.log(angular.element(".skill_query .name > span:nth-child(1)").text());
            var result = $.grep($scope.skill, function (e) {
                return e["日文名稱"] === str;
            });
            $scope.queryResult = result[0];
        };

        $scope.tooltipRemove = function () {
            $scope.toolTipLocation = {
                'display': 'none'
            };
        };

        // define tooltip location
        $scope.tooltipMove = function (event) {
            var mousex = event.pageX + 20; //Get X coordinates
            var mousey = event.pageY + 10; //Get Y coordinates
            $scope.toolTipLocation = {
                'top': mousey,
                'left': mousex,
                'display': 'block'
            };
        };
}]);