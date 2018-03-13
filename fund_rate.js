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
g_db.test_connection().then(() => cc.log("mysql connection test ok"), err => {
    cc.log(err);
    process.exit(-1);
});


var currency=process.argv[2];
var rate=parseFloat(process.argv[3]);
var day=parseFloat(process.argv[4]);

if(!currency)
    currency="btc";
if(!rate)
    rate=0.02;
if(!day)
    day=1;



// var printInfo=function (c,day,rate) {
//     var lineData=g_fundHistoryMgr.getLatest(c,day,rate);
//     if(!lineData || !lineData.length) {
//         lineData = g_fundHistoryMgr.getTopRate(c, 3,day);
//         cc.log("cannot find give rate in db,return top 3 in last 24hours");
//         if(!lineData || !lineData.length) {
//             cc.log("cannot find any data");
//             return;
//         }
//     }
//
//     for(var j in lineData){
//         var data=lineData[j];
//         cc.log("%s %s rate %f amount %d day %d",ccsp.time.getTimeStrFromTimeMS(data.time),c,
//             data.rate*100,data.amount,data.day);
//     }
// };


var printInfo=function (c,day,rate) {
    g_fundHistoryMgr.getLatest(c,day,rate).then(lineData=>{
        if(!lineData || !lineData.length) {
            cc.log("cannot find give rate in db,return top 10 in last seven days");
            return g_fundHistoryMgr.getTopRate(c,10,7);
        }
        return lineData;
    }).then(lineData=>{
        if(!lineData || !lineData.length) {
            cc.log("cannot find any data");
            return;
        }
        for(var j in lineData){
            var data=lineData[j];
            cc.log("%s %s rate %f amount %f day %f",ccsp.time.getTimeStrFromTimeMS(data.time),c,
                data.rate*100,data.amount,data.day);
        }
    });
};

var main=function () {
    if(!currency){
        for(var i in g_currency_array){
            printInfo(g_currency_array[i],day,rate);
        }
    }else{
        printInfo(currency,day,rate);
    }
};

g_fundHistoryMgr=new fund.fundHistoryMgr([currency]);
main();