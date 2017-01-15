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
        debug: true,
        local: {
            uri: 'mongodb://localhost/vcoupon'
        }
    },
    // Json web token config
    token: {
        // Random key - :">
        secretKey: '717627413c4a2b40205d222a357e276f7827577b4b4b72574138695320',
        algorithm: 'RS256'
    },

    seedDB: {
        seed: false,
        user: [
            {
                "_id": "585256f1b10aa019d8d66740",
                "email": "lotteria@lotteria.vn",
                "phoneNumber": "18008080",
                "address": "3 Nguyễn Lương Bằng, P.Tân Phú, Quận 7, HCM",
                "provider": "vcoupon",
                "password": "12345678",
                "promotionCount": 0,
                "followedCount": 0,
                "followingCount": 0,
                "pinnedPromotion": [],
                "subscribingTopic": [],
                "role": "PROVIDER",
                "rating": 5,
                "fanpage": "www.facebook.com/ilovelotteria",
                "website": "www.lotteria.vn/",
                "gender": "Khác",
                "avatar": "http://www.diachibotui.com/Thumbnail/ExtraLarge/Upload/2015/11/10/lotteria-le-duan-635827458028540625.png",
                "name": "Lotteria Việt Nam"
            },
            {
                "_id": "58525c1cb10aa019d8d66743",
                "email": "grabbike@grabbike.vn",
                "phoneNumber": "18008081",
                "address": "227 Nguyễn Văn Cừ, P.4, Quận 5, TP.HCM",
                "provider": "vcoupon",
                "password": "12345678",
                "promotionCount": 0,
                "followedCount": 0,
                "followingCount": 0,
                "pinnedPromotion": [],
                "subscribingTopic": [],
                "role": "PROVIDER",
                "rating": 4,
                "fanpage": "www.facebook.com/Grabbike",
                "website": "www.Grabbike.com",
                "gender": "Khác",
                "avatar": "http://grabtaxi.org/wp-content/uploads/2016/07/Grab-Logo.png",
                "name": "Grabbike"
            },
            {
                "_id": "58527099fa9a0c19ecc2646c",
                "email": "vascara@vascara.vn",
                "phoneNumber": "19008082",
                "address": " 96 Cao Thắng, P.4, Quận 3, TP. HCM ",
                "password": "12345678",
                "provider": "vcoupon",
                "promotionCount": 0,
                "followedCount": 0,
                "followingCount": 0,
                "pinnedPromotion": [],
                "subscribingTopic": [],
                "role": "PROVIDER",
                "rating": 0,
                "fanpage": "www.facebook.com/Vascara.vn",
                "website": "www.Vascara.com",
                "gender": "Khác",
                "avatar": "http://www.trustworld.vn/uploads/logos/xvascaralogo.jpg.pagespeed.ic.V8eewcIEuB.jpg",
                "name": "Vascara"
            },
            {
                "_id": "58525775b10aa019d8d66741",
                "phoneNumber": "01672721761",
                "email": "lbtu@vcoupon.vn",
                "address": "227 Nguyễn Văn Cừ, Q5, HCM",
                "provider": "vcoupon",
                "password": "12345678",
                "promotionCount": 0,
                "followedCount": 0,
                "followingCount": 0,
                "pinnedPromotion": [],
                "subscribingTopic": [],
                "role": "NORMAL",
                "rating": 0,
                "fanpage": "www.facebook.com/VCoupon",
                "website": "www.vcoupon.vn",
                "gender": "Nam",
                "avatar": "http://tinyurl.com/hjcj8ws",
                "name": "Tú Nhỏ"
            },
            {
                "_id": "5857eb4b2b61d90011fa90f4",
                "address": "Bac Lieu",
                "email": "tqviet@vcoupon.vn",
                "password": "12345678",
                "phoneNumber": "123456789",
                "provider": "vcoupon",
                "promotionCount": 0,
                "followedCount": 0,
                "followingCount": 0,
                "pinnedPromotion": [],
                "subscribingTopic": [],
                "role": "NORMAL",
                "gender": "Nam",
                "avatar": "http://tinyurl.com/hjcj8ws",
                "name": "Việt Trần"
            },
            {
                "_id": "58770010a093d700117ccf72",
                "address": "Lâm Đồng, Việt Nam",
                "email": "nvtuan@vcoupon.vn",
                "password": "12345678",
                "phoneNumber": "199",
                "provider": "vcoupon",
                "promotionCount": 0,
                "followedCount": 0,
                "followingCount": 0,
                "pinnedPromotion": [],
                "subscribingTopic": [],
                "role": "NORMAL",
                "avatar": "https://scontent.fdad3-2.fna.fbcdn.net/v/t1.0-9/14595653_777832052355186_3428586939021186220_n.jpg?oh=3c7bb51fb51eebdd8b5f7be53aa1a551&oe=590EC21C",
                "name": "Tuấn Nguyễn"
            },
            {
                "_id": "58770010a093d700117aaf71",
                "address": "Long An, Việt Nam",
                "email": "nptuan@vcoupon.vn",
                "password": "12345678",
                "phoneNumber": "195",
                "provider": "vcoupon",
                "promotionCount": 0,
                "followedCount": 0,
                "followingCount": 0,
                "pinnedPromotion": [],
                "subscribingTopic": [],
                "role": "NORMAL",
                "avatar": "https://scontent.fdad3-2.fna.fbcdn.net/v/t1.0-9/14595653_777832052355186_3428586939021186220_n.jpg?oh=3c7bb51fb51eebdd8b5f7be53aa1a551&oe=590EC21C",
                "name": "Phương Tuấn"
            },
            {
                "_id": "58770010a093d700117aa17f",
                "address": "Đà Nẵng, Việt Nam",
                "email": "lqtuan@vcoupon.vn",
                "password": "12345678",
                "phoneNumber": "197",
                "provider": "vcoupon",
                "promotionCount": 0,
                "followedCount": 0,
                "followingCount": 0,
                "pinnedPromotion": [],
                "subscribingTopic": [],
                "role": "NORMAL",
                "avatar": "http://s1.img.yan.vn//YanNews/2167221/201502/20150227-092922-4_520x390.jpg",
                "name": "Quang Tuấn"
            }
        ],
        promotions: [
            // Fashion
            {
                "_id": "5856a3bec4b3c0047364a891",
                "_category": "5842fbab0f0bc105b77eb74f",
                "_provider": "58527099fa9a0c19ecc2646c",
                "title": "Boots Up – Ưu đãi 30% tất cả giày boot",
                "createdAt": 1482219360,
                "commentCount": 0,
                "pinnedCount": 0,
                "addresses": [
                    {
                        "number": "227",
                        "street": "Nguyễn Văn Cừ",
                        "ward": "Phường 4",
                        "district": "Quận 5",
                        "province": "HCM",
                        "latitude": 10.762867,
                        "longitude": 106.682305,
                        "country": "Việt Nam"
                    },
                    {
                        "number": "566/82",
                        "street": "Nguyễn Thái Sơn",
                        "ward": "Phường 5",
                        "district": "Quận Gò Vấp",
                        "province": "HCM",
                        "latitude": 10.82849,
                        "longitude": 106.69709,
                        "country": "Việt Nam"
                    }
                ],
                "discountType": "%",
                "discount": 30,
                "amountRegistered": 0,
                "amountLimit": 50,
                "endDate": 1495006400,
                "startDate": 1482624000,
                "condition": "- Không áp dụng với thẻ VIP hoặc thẻ đối tác. Không áp dụng với các loại Phiếu Quà Tặng (trừ Phiếu Quà Tặng bán và Giftcards).Trong mọi trường hợp, quyết định của Vascara là quyết định cuối cùng.",
                "cover": "http://www.vascara.com/uploads/web/900/Khuyen-Mai/vcr-boots-up-720x400-170106-v3.jpg"
            },
            {
                "_id": "5856a3bec4b3c0046374a981",
                "_category": "5842fbab0f0bc105b77eb74f",
                "_provider": "58527099fa9a0c19ecc2646c",
                "title": "Winter Wonderland – Đồng giá sản phẩm từ 150.000đ",
                "createdAt": 1482219360,
                "commentCount": 0,
                "pinnedCount": 0,
                "addresses": [
                    {
                        "number": "227",
                        "street": "Nguyễn Văn Cừ",
                        "ward": "Phường 4",
                        "district": "Quận 5",
                        "province": "HCM",
                        "latitude": 10.762867,
                        "longitude": 106.682305,
                        "country": "Việt Nam"
                    },
                    {
                        "number": "566/82",
                        "street": "Nguyễn Thái Sơn",
                        "ward": "Phường 5",
                        "district": "Quận Gò Vấp",
                        "province": "HCM",
                        "latitude": 10.82849,
                        "longitude": 106.69709,
                        "country": "Việt Nam"
                    }
                ],
                "discountType": "VND",
                "discount": 150,
                "amountRegistered": 0,
                "amountLimit": 50,
                "endDate": 1495006400,
                "startDate": 1482624000,
                "condition": "- Không áp dụng với thẻ VIP hoặc thẻ đối tác. Không áp dụng với các loại Phiếu Quà Tặng (trừ Phiếu Quà Tặng bán và Giftcards).Trong mọi trường hợp, quyết định của Vascara là quyết định cuối cùng.",
                "cover": "http://www.vascara.com/uploads/web/900/Winter-Wonderland/2016/tin-tuc/vcr-ww16-tbct-161208.jpg"
            },
            {
                "_id": "5856a5f1a4ae7504c1856a37",
                "_category": "5842fbab0f0bc105b77eb74f",
                "_provider": "58527099fa9a0c19ecc2646c",
                "title": "Grand Opening Vascara Phạm Hùng – Ưu đãi 10% tất cả sản phẩm & giảm thêm 5% khi check-in",
                "createdAt": 1482219360,
                "commentCount": 0,
                "pinnedCount": 0,
                "addresses": [
                    {
                        "number": "227",
                        "street": "Nguyễn Văn Cừ",
                        "ward": "Phường 4",
                        "district": "Quận 5",
                        "province": "HCM",
                        "latitude": 10.762867,
                        "longitude": 106.682305,
                        "country": "Việt Nam"
                    },
                    {
                        "number": "566/82",
                        "street": "Nguyễn Thái Sơn",
                        "ward": "Phường 5",
                        "district": "Quận Gò Vấp",
                        "province": "HCM",
                        "latitude": 10.82849,
                        "longitude": 106.69709,
                        "country": "Việt Nam"
                    }
                ],
                "discountType": "%",
                "discount": 50,
                "amountRegistered": 0,
                "amountLimit": 50,
                "endDate": 1495006400,
                "startDate": 1482624000,
                "condition": "- Không áp dụng với thẻ VIP hoặc thẻ đối tác. Không áp dụng với các loại Phiếu Quà Tặng (trừ Phiếu Quà Tặng bán và Giftcards).Trong mọi trường hợp, quyết định của Vascara là quyết định cuối cùng.",
                "cover": "http://www.vascara.com/uploads/web/900/Khuyen-Mai/22-12-binh-chanh.jpg"
            },
            // Food
            {
                "_id": "5856a5f1a4ae7504c6581a37",
                "_category": "5842fbab0f0bc105b77eb74e",
                "_provider": "585256f1b10aa019d8d66740",
                "title": "KFC khuyến mại món mới gà zòn húng quế giảm giá món gọi thêm chỉ 1000 đồng",
                "createdAt": 1482219487,
                "commentCount": 0,
                "pinnedCount": 0,
                "addresses": [
                    {
                        "number": "227",
                        "street": "Nguyễn Văn Cừ",
                        "ward": "Phường 4",
                        "district": "Quận 5",
                        "province": "HCM",
                        "latitude": 10.762867,
                        "longitude": 106.682305,
                        "country": "Việt Nam"
                    },
                    {
                        "number": "566/82",
                        "street": "Nguyễn Thái Sơn",
                        "ward": "Phường 5",
                        "district": "Quận Gò Vấp",
                        "province": "HCM",
                        "latitude": 10.82849,
                        "longitude": 106.69709,
                        "country": "Việt Nam"
                    }
                ],
                "discountType": "%",
                "discount": 30,
                "amountRegistered": 0,
                "amountLimit": 500,
                "endDate": 1483006400,
                "startDate": 1482624000,
                "condition": "Áp dụng cho tất cả khách hàng trong nước",
                "cover": "http://www.khuyenmaivui.com/wp-content/uploads/2015/08/kfc-khuyen-mai-mon-moi-ga-zon-hung-que-giam-gia-mon-goi-them-chi-1000.jpg"
            },
            {
                "_id": "5856a5f1a4ae0754c1856a36",
                "_category": "5842fbab0f0bc105b77eb74e",
                "_provider": "585256f1b10aa019d8d66740",
                "title": "Sinh nhật vui hơn - Tiết kiệm hơn",
                "createdAt": 1482219487,
                "commentCount": 0,
                "pinnedCount": 0,
                "addresses": [
                    {
                        "number": "227",
                        "street": "Nguyễn Văn Cừ",
                        "ward": "Phường 4",
                        "district": "Quận 5",
                        "province": "HCM",
                        "latitude": 10.762867,
                        "longitude": 106.682305,
                        "country": "Việt Nam"
                    },
                    {
                        "number": "566/82",
                        "street": "Nguyễn Thái Sơn",
                        "ward": "Phường 5",
                        "district": "Quận Gò Vấp",
                        "province": "HCM",
                        "latitude": 10.82849,
                        "longitude": 106.69709,
                        "country": "Việt Nam"
                    }
                ],
                "discountType": "%",
                "discount": 30,
                "amountRegistered": 0,
                "amountLimit": 500,
                "endDate": 1483006400,
                "startDate": 1482624000,
                "condition": "Áp dụng từ 25.07.2016 cho tiệc sinh nhật từ 10 bé trở lên, tại Lotteria",
                "cover": "http://www.lotteria.vn/data/201630/sinh-nhat-b_2971.jpg"
            },
            {
                "_id": "5856a5f1a4ae0754c1856a63",
                "_category": "5842fbab0f0bc105b77eb74e",
                "_provider": "585256f1b10aa019d8d66740",
                "title": "Khuyến mãi combo sốc",
                "createdAt": 1482219487,
                "commentCount": 0,
                "pinnedCount": 0,
                "addresses": [
                    {
                        "number": "227",
                        "street": "Nguyễn Văn Cừ",
                        "ward": "Phường 4",
                        "district": "Quận 5",
                        "province": "HCM",
                        "latitude": 10.762867,
                        "longitude": 106.682305,
                        "country": "Việt Nam"
                    },
                    {
                        "number": "566/82",
                        "street": "Nguyễn Thái Sơn",
                        "ward": "Phường 5",
                        "district": "Quận Gò Vấp",
                        "province": "HCM",
                        "latitude": 10.82849,
                        "longitude": 106.69709,
                        "country": "Việt Nam"
                    }
                ],
                "discountType": "VND",
                "discount": 37,
                "amountRegistered": 0,
                "amountLimit": 500,
                "endDate": 1483006400,
                "startDate": 1482624000,
                "condition": "Khoai tây lắc + gà rán: 37,000. Thêm pepsi chỉ với 5,000",
                "cover": "http://www.lotteria.vn/data/201701/combo-soc-b_8375.jpg"
            },
            // Tech
            {
                "_id": "5856a5f1aea40754c1856a33",
                "_category": "5842fbab0f0bc105b77eb750",
                "_provider": "58525c1cb10aa019d8d66743",
                "title": "Grab Bike tháng 8/2016 – dùng thử 7 ngày miễn phí",
                "createdAt": 1482219487,
                "commentCount": 0,
                "pinnedCount": 0,
                "addresses": [
                    {
                        "number": "227",
                        "street": "Nguyễn Văn Cừ",
                        "ward": "Phường 4",
                        "district": "Quận 5",
                        "province": "HCM",
                        "latitude": 10.762867,
                        "longitude": 106.682305,
                        "country": "Việt Nam"
                    },
                    {
                        "number": "566/82",
                        "street": "Nguyễn Thái Sơn",
                        "ward": "Phường 5",
                        "district": "Quận Gò Vấp",
                        "province": "HCM",
                        "latitude": 10.82849,
                        "longitude": 106.69709,
                        "country": "Việt Nam"
                    }
                ],
                "discountType": "VND",
                "discount": 0,
                "amountRegistered": 0,
                "amountLimit": 500,
                "endDate": 1483006400,
                "startDate": 1482624000,
                "condition": "GrabBike tặng 7 chuyến đi miễn phí trong vòng 7 ngày, mỗi chuyến 7 km (tương đương 31.000đ). Nếu đi trên 31.000VND, bạn vui lòng thanh toán phần phí chênh lệch. Chỉ cần nhập mã 777 vào ô Promo/Mã KM là sẽ nhận ngay ưu đãi!",
                "cover": "https://khuyenmaiviet.vn/wp-content/uploads/2016/08/14102210_1833372473560957_1124453204602091659_n.jpg"
            },
            {
                "_id": "5856a5f1aea40754c1586a13",
                "_category": "5842fbab0f0bc105b77eb750",
                "_provider": "58525c1cb10aa019d8d66743",
                "title": "Grab Bike khuyến mãi 10 chuyến đi đầu tiên",
                "createdAt": 1482219487,
                "commentCount": 0,
                "pinnedCount": 0,
                "addresses": [
                    {
                        "number": "227",
                        "street": "Nguyễn Văn Cừ",
                        "ward": "Phường 4",
                        "district": "Quận 5",
                        "province": "HCM",
                        "latitude": 10.762867,
                        "longitude": 106.682305,
                        "country": "Việt Nam"
                    },
                    {
                        "number": "566/82",
                        "street": "Nguyễn Thái Sơn",
                        "ward": "Phường 5",
                        "district": "Quận Gò Vấp",
                        "province": "HCM",
                        "latitude": 10.82849,
                        "longitude": 106.69709,
                        "country": "Việt Nam"
                    }
                ],
                "discountType": "VND",
                "discount": 0,
                "amountRegistered": 0,
                "amountLimit": 500,
                "endDate": 1483006400,
                "startDate": 1482624000,
                "condition": "GrabBike tặng 7 chuyến đi miễn phí trong vòng 7 ngày, mỗi chuyến 7 km (tương đương 31.000đ). Nếu đi trên 31.000VND, bạn vui lòng thanh toán phần phí chênh lệch. Chỉ cần nhập mã 777 vào ô Promo/Mã KM là sẽ nhận ngay ưu đãi!",
                "cover": "https://khuyenmaiviet.vn/wp-content/uploads/2016/08/14102210_1833372473560957_1124453204602091659_n.jpg"
            }
        ],
        category: [
            {
                "_id": "5842fbab0f0bc105b77eb74e",
                "name": "Đồ ăn",
                "cover": "https://firebasestorage.googleapis.com/v0/b/vcoupon-1275f.appspot.com/o/images%2Fdefault%2Fcover_category_food-min.jpg?alt=media&token=d01e01e0-c04d-404a-afe3-ea4e270b9e6d",
                "type": "FOOD"
            },
            {
                "_id": "5842fbab0f0bc105b77eb74f",
                "name": "Quần áo",
                "cover": "https://firebasestorage.googleapis.com/v0/b/vcoupon-1275f.appspot.com/o/images%2Fdefault%2Fcover_category_clothes-min.jpg?alt=media&token=00e40b0a-acce-41e9-96d3-e519227a5186",
                "type": "CLOTHES"
            },
            {
                "_id": "5842fbab0f0bc105b77eb750",
                "name": "Công nghệ",
                "cover": "https://firebasestorage.googleapis.com/v0/b/vcoupon-1275f.appspot.com/o/images%2Fdefault%2Fcover_category_technology-min.jpg?alt=media&token=c21b2f3c-062e-45e7-9cfe-234f045a8624",
                "type": "TECH"
            }
        ],
        vouchers: []
    },

    facebook: {
        graphUrl: "https://graph.facebook.com/me?fields=id,name,email,gender,location,picture.width(100).height(100)&access_token="
    }
};

