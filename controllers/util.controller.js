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