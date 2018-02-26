/**
 * Created by joe on 2018/2/26.
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

var maxDay=365;
var diffDay=13;
var diffRate=0.06;
var btcPrice=66000;
var costPerMachine=17500;
var gainPerHash=0.000084;   //btc/t
var hashPerMachine=13.5;
var machineCount=4;
var cost=costPerMachine*machineCount;
var gain=gainPerHash*hashPerMachine*machineCount;
var timeBegin=ccsp.time.getTime();
var investInBtc=cost/btcPrice;

var totalGain=0;
for(var i=0;i<maxDay;i++){
    if((i+1)%diffDay===0){
        gain=gain*(1-diffRate);
    }
    totalGain+=gain;
    var dateStr=ccsp.time.getTimeStrToDayFromTime(timeBegin);
    timeBegin+=3600*24;
    if(totalGain>=investInBtc)
        cc.log("%s profit %f total %f ++",dateStr,gain,totalGain);
    else
        cc.log("%s profit %f total %f",dateStr,gain,totalGain);
}
var profitInBtc=totalGain-investInBtc;
var profitPercent=profitInBtc/investInBtc;
cc.log("invest btc %f gain %f (profit %f,%f%%) in %d days",investInBtc,totalGain,profitInBtc,profitPercent*100,maxDay);
