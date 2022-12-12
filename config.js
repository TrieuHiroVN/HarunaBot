require('dotenv').config();

module.exports = {
    brainshop: {
        bid: process.env.brainshopbid,
        key: process.env.brainshopkey,
    },
    mongoSRV: process.env.mongoSRV,
    token: process.env.token
};