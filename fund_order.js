/**
 * Created by joe on 2018/1/24.
 */
/**
 * Created by joe on 2017/11/5.
 */
config={};
fund={};
logic={};


require("./common-js/server/global.js");
require("./common-js/common/csv.js");

require("./logic/util/util.js");

require("./logic/fund/fundHistoryMgr.js");
require("./logic/fund/order.js");
require("./logic/fund/orderMgr.js");
require("./logic/fund/wallet.js");
require("./logic/fund/walletMgr.js");

require("./logic/routine.js");
require("./config.js");

config.apikey=ccsp.config.getFromJson("res/config/apikey.json");
config.server=ccsp.config.getFromJson("res/config/server.json");

// g_db = new ccsp.mysql_es6(
//     config.server.db.host, config.server.db.port, config.server.db.user,
//     config.server.db.pass, config.server.db.name, config.server.db.charset,
//     config.server.db.conn_max, config.server.db.queue_max
// );
// g_db.test_connection().then(() => cc.log("g_db test ok"), err => {
//     cc.log(err);
//     process.exit(-1);
// });


const BFX = require('bitfinex-api-node');
let bws=new BFX(config.apikey.key,config.apikey.secret,{version:2,transform:true}).ws;
g_bws=bws;


var main=function () {
    bws.on('auth',()=>{
        cc.log("authenticated successful!");
        // cc.log("open ok,begin to get wallet info");
        // fund.walletMgr.getWalletInfo();
    });

    bws.on('open',()=>{
        cc.log("open ok,begin to auth");
        bws.auth();

    });

    bws.on('fos', (v) => {
        cc.log("fos");
        cc.log("funding my order current lis:");
        fund.orderMgr.init(v);
        fund.orderMgr.printAll();
        cc.log("end");
        process.exit(0);
    });

    bws.on('error', console.error);
};
main();

// g_fundHistoryMgr=new fund.fundHistoryMgr(g_currency_array,main);