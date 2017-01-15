/**
 * Created by don on 1/15/17.
 */
"use strict";

module.exports.generateCode = () => {
    let text = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
};

module.exports.getCurrentDate = () => {
    return parseInt(new Date().getTime() / 1000);
};

let rad = function(x) {
    return x * Math.PI / 180;
};

module.exports.getDistance = (longA, latA, longB, latB) => {
    let R = 6378137; // Earth’s mean radius in meter
    let dLat = rad(latB - latA);
    let dLong = rad(longB - longA);
    let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(rad(latA)) * Math.cos(rad(latB)) *
        Math.sin(dLong / 2) * Math.sin(dLong / 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = R * c;
    return d; // returns the distance in meter
};

module.exports.normalizeString = (input) =>{
    input = input.toLowerCase();
    input = input.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a");
    input = input.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e");
    input = input.replace(/ì|í|ị|ỉ|ĩ/g,"i");
    input = input.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o");
    input = input.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u");
    input = input.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y");
    input = input.replace(/đ/g,"d");
    input = input.replace(/!|@|\$|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\'| |\"|\&|\#|\[|\]|~/g,"");
    input = input.replace(/-+-/g,"");
    input = input.replace(/^\+|\+$/g,"");
    return input;
};