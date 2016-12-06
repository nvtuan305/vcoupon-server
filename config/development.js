/**
 * Created by apismantis on 03/12/2016.
 */

'use strict';

module.exports = {
    // Database development
    db: {
        uri: 'mongodb://admin:admin.vcoupon@ds045714.mlab.com:45714/vcoupon',
        account: {
            user: 'admin',
            password: 'admin.vcoupon'
        },
        debug: true
    },
    // Json web token config
    token: {
        // Random key - :">
        secretKey: '717627413c4a2b40205d222a357e276f7827577b4b4b72574138695320',
        algorithm: 'RS256'
    }
};

