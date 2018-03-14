/**
 * Created by joe on 2018/3/13.
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

config.apikey=g_configKey.bitfinex;
config.server=ccsp.config.getFromJson("res/config/server.json");

//import BitfinexAPI from 'bitfinex-api';
const BitfinexAPI=require("bitfinex-api").default;
const restClient = new BitfinexAPI({ key:config.apikey.key, secret:config.apikey.secret });

var toRate=function (v) {
    var p=0.03/10.95;
    return parseFloat(v)*p;
};

var toRate2=function (v) {
    var p=10.95/0.03;
    return parseFloat(v)*p;
};

var printUsage=function () {
    cc.logNoDate("fund_ordermgr usage:\nwallet\norder\ncancel fund_id\n" +
        "lend currency rate amount (period=30)\ntrans btc amount toexchange\ntrans btc amount tofund");
};
var action=process.argv[2];
if(action==="wallet"){
    restClient.getWalletBalances().then(dataArr=>{
        for(var i=0,l=dataArr.length;i<l;i++){
            var data=dataArr[i];
            var type=data.type;
            var currency=data.currency.toLowerCase();
            var amount=parseFloat(data.amount);
            var left=parseFloat(data.available);
            if(!amount)
                continue;
            if(type==="deposit"){
                cc.log("funding %s %f %f",currency,amount,left);
            }else if(type==="exchange"){
                cc.log("exchange %s %f %f",currency,amount,left);
            }else{
                cc.log("margin %s %f %f",currency,amount,left);
            }
        }
        process.exit(0);
    }).catch(cc.logErr);
}else if(action==="order"){
    restClient.getMyActiveOffers().then(dataArr=>{
        for(var i=0,l=dataArr.length;i<l;i++){
            var data=dataArr[i];
            var id=parseInt(data.id);
            var currency=data.currency.toLowerCase();
            var rate=toRate(data.rate);
            var amount=parseFloat(data.remaining_amount);
            var day=parseInt(data.period);
            var time=parseInt(data.timestamp);
            cc.logNoDate("%s %d %s %f %f %d",ccsp.time.getTimeStrFromTime(time),id,currency,amount,
            rate,day);
        }
        process.exit(0);
    }).catch(cc.logErr);
}else if(action==="cancel"){
    var id=parseInt(process.argv[3]);
    if(!id){
        printUsage();
        process.exit(0);
    }
    restClient.cancelOffer({offer_id:id}).then(dataObj=>{
        cc.logNoDate("id %s canceled ok",dataObj.id);
        process.exit(0);
    }).catch(err=>{
        cc.log("error:"+err.message);
    });
}else if(action==="lend"){
    //must
    var currency=process.argv[3];
    var rate=parseFloat(process.argv[4]);
    var amount=process.argv[5];
    if(!currency || !rate || !amount){
        printUsage();
        process.exit(0);
    }

    //optional
    var period=parseInt(process.argv[6]);
    if(!period)
        period=30;

    var param={
        currency:currency.toUpperCase(),
        amount:amount,
        rate:String(toRate2(rate)),
        period:period,
        direction:"lend"
    };
    restClient.newOffer(param).then(dataObj=>{
        cc.log("id %s created",dataObj.id);
        process.exit(0);
    }).catch(err=>{
        cc.log("error:"+err.message);
    });
}else if(action==="trans"){
    //trans btc amount trade
    var currency=process.argv[3];
    var amount=parseFloat(process.argv[4]);
    var direction=process.argv[5];
    if(!currency || !amount || !direction){
        printUsage();
        process.exit(0);
    }

    var walletfrom="";
    var walletto="";
    //optional
    if(direction==="toexchange"){
        //fund to exchange
        walletfrom="deposit";
        walletto="exchange";
    }else if(direction==="tofund"){
        //exchange to fund
        walletfrom="exchange";
        walletto="deposit";
    }else{
        printUsage();
        process.exit(0);
    }


    var param={
        currency:currency.toUpperCase(),
        amount:amount,
        walletfrom:String(toRate2(rate)),
        walletto:period,
    };
    restClient.transferBetweenWallets(param).then(dataObj=>{
        cc.log("id %s created",dataObj.id);
        process.exit(0);
    }).catch(err=>{
        cc.log("error:"+err.message);
    });
}
else{
    if(action)
        cc.log("%s not supported yet",action);
    printUsage();
}


// var main=function () {
//     cc.log("main:begin");
//
//     restClient.getMyActiveOffers().then(data=>{
//         cc.logObj(data);
//         process.exit(0);
//     }).catch(cc.logErr);
//     return;
//
//     //get wallet,includes exchange and fund
//     restClient.getWalletBalances().then(data=>{
//         cc.logObj(data);
//         process.exit(0);
//     }).catch(cc.logErr);
//
//     // restClient.getOrderBook('BTCUSD', { limit_asks: 10, limit_bids: 10 })
//     //     .then(console.log)
//     //     .catch(console.error);
//
// };
// main();









