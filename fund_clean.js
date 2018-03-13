/**
 * Created by joe on 2018/1/24.
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


config.server=ccsp.config.getFromJson("res/config/server.json");

g_db = new ccsp.mysql_es6(
    config.server.db.host, config.server.db.port, config.server.db.user,
    config.server.db.pass, config.server.db.name, config.server.db.charset,
    config.server.db.conn_max, config.server.db.queue_max
);
g_db.test_connection().then(() => cc.log("g_db test ok"), err => {
    cc.log(err);
    process.exit(-1);
});


var day=parseFloat(process.argv[2]);

if(!day)
    day=1;

var main=function () {
    cc.log("main:begin");
    g_fundHistoryMgr.cleanOldData(day,function () {
        cc.log("end");
        process.exit(0);
    });
};

g_fundHistoryMgr=new fund.fundHistoryMgr(g_currency_array);
main();