/**
 * Created by joe on 2018/1/23.
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

var rate=17.2587;       //1rmb can get this foreign dollar
var rateDiscount=0.98;
var priceBuy=109000;
var priceSell=6635;
var transFee=0.01;

var initFiat=10000;
var innerFiatName="rmb";
var outFiatName="jpy";
var crypotoName="eth";

var foreignFiat=initFiat*rate*rateDiscount;
var boughtCount=foreignFiat/priceBuy;
var sellFiat=(boughtCount-transFee)*priceSell;
var profit=Math.floor(sellFiat-initFiat);
var profitRate=profit/initFiat;

cc.log("invest money %f%s get %d%s,buy count %f%s sell %f%s profit %f%s %f",initFiat,innerFiatName,foreignFiat,outFiatName,
    boughtCount,crypotoName,sellFiat,innerFiatName,profit,innerFiatName,profitRate);


// var initBtc=parseFloat(process.argv[2]);
// var rate=parseFloat(process.argv[3]);
// var maxDay=parseFloat(process.argv[4]);
//
// if(!initBtc)
//     initBtc=400;
// if(!rate)
//     rate=0.02;
// if(!maxDay)
//     maxDay=365;
// var dayRate=0.85*rate/100;
// var total=initBtc;
// var timeBegin=ccsp.time.getTime();
// for(var i=0;i<maxDay;i++){
//     var profit=total*dayRate;
//     total+=profit;
//     var dateStr=ccsp.time.getTimeStrToDayFromTime(timeBegin);
//     timeBegin+=3600*24;
//     cc.log("%s profit %f total %f",dateStr,profit,total);
// }
