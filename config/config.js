/**
 * Created by apismantis on 03/12/2016.
 */

'use strict';

module.exports = {

    // Database config
    db: {
        uri: 'mongodb://admin:admin.vcoupon@ds045714.mlab.com:45714/vcoupon',
        account: {
            user: 'admin',
            password: 'admin.vcoupon'
        },
        debug: true
    },

    // Json web token secret key config
    secretKey: 'VCoupon.haha.hehe'
};

