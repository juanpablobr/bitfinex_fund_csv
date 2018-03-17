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


// var time=ccsp.time.getTimeMS();
// var time2=time-18*3600*1000;
// var time3=ccsp.time.mkTimeMS(2018,3,17,0,18,44);
// cc.logNoDate("%s %f",ccsp.time.getTimeStrFromTimeMS(time2),time2);
// cc.logNoDate("%s %f",ccsp.time.getTimeStrFromTimeMS(time3),time3);
// return;
// var maxDay=365*3;
// var diffDay=13;
// var diffRate=0.06;
// var btcPrice=119200;
// var costPerMachine=32000;
// var gainPerHash=0.00013;   //btc/t
// var hashPerMachine=13.5;
// var machineCount=4;
// var cost=costPerMachine*machineCount;
// var gain=gainPerHash*hashPerMachine*machineCount;
// var timeBegin=ccsp.time.getTime();
// var investInBtc=cost/btcPrice;
//
// var totalGain=0;
// for(var i=0;i<maxDay;i++){
//     if((i+1)%diffDay===0){
//         gain=gain*(1-diffRate);
//     }
//     totalGain+=gain;
//     var dateStr=ccsp.time.getTimeStrToDayFromTime(timeBegin);
//     timeBegin+=3600*24;
//     if(totalGain>=investInBtc)
//         cc.log("%s profit %f total %f ++",dateStr,gain,totalGain);
//     else
//         cc.log("%s profit %f total %f",dateStr,gain,totalGain);
// }
// var profitInBtc=totalGain-investInBtc;
// var profitPercent=profitInBtc/investInBtc;
// cc.log("invest btc %f gain %f (profit %f,%f%%) in %d days",investInBtc,totalGain,profitInBtc,profitPercent*100,maxDay);

var initBtc=parseFloat(process.argv[2]);
var rate=parseFloat(process.argv[3]);
var maxDay=parseFloat(process.argv[4]);

if(!initBtc)
    initBtc=400;
if(!rate)
    rate=0.02;
if(!maxDay)
    maxDay=365;
var dayRate=0.85*rate/100;
var total=initBtc;
var timeBegin=ccsp.time.getTime();
for(var i=0;i<maxDay;i++){
    var profit=total*dayRate;
    total+=profit;
    var dateStr=ccsp.time.getTimeStrToDayFromTime(timeBegin);
    timeBegin+=3600*24;
    cc.log("%s profit %f total %f",dateStr,profit,total);
}
