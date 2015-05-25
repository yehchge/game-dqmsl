angular.module('dqmslFilters', [])
    .filter('numberFixedLen', function () {
    return function (n, len) {
        var num = parseInt(n, 10);
        len = parseInt(len, 10);
        if (isNaN(num) || isNaN(len)) {
            return n;
        }
        num = '' + num;
        while (num.length < len) {
            num = '0' + num;
        }
        return num;
    };
})
    .filter('jp2zh', function () {
    return function (str, arrayData) {
        angular.forEach(arrayData, function (el, i) {
            if (str == el.jp) {
                str = el.zh;
                return true;
            }
        });
        return str;
    };
})
    .filter('mon_name_jp2zh', function () {
    return function (monid, arrayData) {
        var str = '';
        angular.forEach(arrayData, function (el, i) {
            if (monid == el.monid) {
                str = el.monnamezh;
                return true;
            }
        });
        return str;
    };
})
    .filter('int2class', function () {
    return function (str) {
        var mon_class;
        if (str === "1") mon_class = "F";
        if (str === "2") mon_class = "E";
        if (str === "3") mon_class = "D";
        if (str === "4") mon_class = "C";
        if (str === "5") mon_class = "B";
        if (str === "6") mon_class = "A";
        if (str === "7") mon_class = "S";
        if (str === "8") mon_class = "SS";
        return mon_class;
    };
})
    .filter('int2resist', function () {
    return function (str) {
        var mon_resist;
        if (str === "1") mon_resist = "反射";
        if (str === "2") mon_resist = "吸收";
        if (str === "3") mon_resist = "無效";
        if (str === "4") mon_resist = "減半";
        if (str === "5") mon_resist = "強烈";
        if (str === "6") mon_resist = "減輕";
        if (str === "7") mon_resist = "微弱";
        if (str === "8") mon_resist = "弱點";
        if (!str) mon_resist = "-";
        return mon_resist;
    };
})
    .filter('num', function () {
    return function (input) {
        return parseInt(input, 10);
    };
});