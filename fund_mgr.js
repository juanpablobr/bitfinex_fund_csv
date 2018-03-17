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

//https://github.com/mjesuele/bitfinex-api-node/

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
    cc.logNoDate("fund_ordermgr usage:\n" +
        "wallet\n" +
        "order\n" +
        "cancel fund_id\n" +
        "lend currency rate amount (period=30)\n" +
        "trans btc amount [toexchange|tofund]\n" +
        "exchange list\n"+
        "[buy|sell] eoseth price amount\n" +
        "replace id price amount\n" +
        "cancelexchange order_id\n"+
        "price iotbtc 10\n"+
        "exchange history btcusd [10]\n"+
        "sum or summary"
    );
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
        amount:String(amount),
        walletfrom:walletfrom,
        walletto:walletto,
    };
    restClient.transferBetweenWallets(param).then(dataObj=>{
        if(dataObj.length){
            cc.log("transfer return:%s",dataObj[0].message);
        }else{
            cc.logObj(dataObj);
        }
        process.exit(0);
    }).catch(err=>{
        cc.log("error:"+err.message);
    });
}else if(action==="buy" || action==="sell"){
    //buy eoseth price amount
    var pair=process.argv[3];
    var price=parseFloat(process.argv[4]);
    var amount=parseFloat(process.argv[5]);
    if(!pair || !price || !amount){
        printUsage();
        process.exit(0);
    }
    var param={
        symbol: pair.toUpperCase(),
        amount: String(amount/price),
        price: String(price),
        exchange: 'bitfinex',
        side: action,
        type: 'exchange limit'
    };
    restClient.newOrder(param).then(dataObj=>{
        if(dataObj.order_id){
            cc.log("%s %s id %s created",action,dataObj.symbol,dataObj.order_id);
        }else{
            cc.logObj(dataObj);
        }
        process.exit(0);
    }).catch(err=>{
        cc.log("error:"+err.message);
    });
}else if(action==="replace"){
    //replace id price amount
    var id=parseInt(process.argv[3]);
    var price=parseFloat(process.argv[4]);
    var amount=parseFloat(process.argv[5]);
    if(!id || !price || !amount){
        printUsage();
        process.exit(0);
    }

    restClient.getMyOrderStatus({order_id:id}).then(result=>{
        if(!result.id){
            cc.logObj(result);
            process.exit(0);
            return;
        }
        var param={
            order_id:id,
            symbol: result.symbol,
            amount: String(amount/price),
            price: String(price),
            exchange: 'bitfinex',
            side: result.side,
            type: result.type
        };
        restClient.replaceOrder(param).then(dataObj=>{
            if(dataObj.order_id){
                cc.log("%s %s id %s->%s updated price %f->%f amount %f->%f",result.side,result.symbol.toLowerCase(),
                    id,dataObj.order_id,result.price,price,result.original_amount,amount/price);
            }else{
                cc.logObj(dataObj);
            }
            process.exit(0);
        }).catch(err=>{
            cc.log("error:"+err.message);
        });
    }).catch(err=>{
        cc.log("error:"+err.message);
    });
}else if(action==="exchange"){
    if(process.argv[3]==="list"){
        restClient.getMyActiveOrders().then(dataArr=>{
            for(var i=0,l=dataArr.length;i<l;i++){
                var data=dataArr[i];
                var id=parseInt(data.id);
                var symbol=data.symbol.toLowerCase();
                var price=data.price;
                var amount=parseFloat(data.original_amount);
                var okamount=parseFloat(data.executed_amount);
                var action=data.side;
                var time=parseInt(data.timestamp);
                cc.logNoDate("%s id %d %s %s %f(executed:%f) price %f",ccsp.time.getTimeStrFromTime(time),
                    id,action,symbol,amount,okamount,price);
            }
            process.exit(0);
        }).catch(cc.logErr);
    }else if(process.argv[3]==="history"){
        var pair=process.argv[4];
        var limit=parseInt(process.argv[5]);
        if(!pair){
            printUsage();
            process.exit(0);
        }
        var param={};
        param.symbol=pair;
        if(limit){
            param.limit_trades=limit;
        }
        restClient.getMyPastTrades(param).then(dataArr=>{
            for(var i=0,l=dataArr.length;i<l;i++){
                var data=dataArr[i];
                var price=parseFloat(data.price);
                var amount=parseFloat(data.amount);
                var fee=parseFloat(data.fee_amount);
                var action=data.type;
                var time=parseInt(data.timestamp);
                cc.logNoDate("%s %s %s price %010f amount %f fee %f",ccsp.time.getTimeStrFromTime(time),
                    action,pair,price,amount,fee);
            }
            process.exit(0);
        }).catch(err=>{
            cc.log("error:"+err);
            cc.logObj(err);
        });
    }else{
        printUsage();
        process.exit(0);
    }
}else if(action==="cancelexchange"){
    var id=parseInt(process.argv[3]);
    if(!id){
        printUsage();
        process.exit(0);
    }
    restClient.cancelOrder({order_id:id}).then(dataObj=>{
        cc.logNoDate("id %s canceled ok",dataObj.id);
        process.exit(0);
    }).catch(err=>{
        cc.log("error:"+err.message);
    });
}else if(action==="price"){
    var pair=process.argv[3];
    var limit=parseInt(process.argv[4]);
    if(!pair){
        printUsage();
        process.exit(0);
    }
    param={};
    if(limit){
        param.limit_trades=limit;
    }
    restClient.getTradeHistory(pair,param).then(dataArr=>{
        dataArr.sort(function (a,b) {
            return parseFloat(a.amount)-parseFloat(b.amount);
        });
        for(var i=0,l=dataArr.length;i<l;i++){
            var data=dataArr[i];
            var price=parseFloat(data.price);
            var amount=parseFloat(data.amount);
            var action=data.type;
            var time=parseInt(data.timestamp);
            cc.logNoDate("%s %s %s price %f amount %f",ccsp.time.getTimeStrFromTime(time),
                action,pair,price,amount);
        }
        process.exit(0);
    }).catch(err=>{
        cc.log("error:"+err.message);
    });
}else if(action==="summary" || action==="sum"){
    restClient.getSummary(pair,param).then(dataArr=>{
        var dataArr=dataArr.funding_profit_30d;
        for(var i=0,l=dataArr.length;i<l;i++){
            var data=dataArr[i];
            var amount=parseFloat(data.amount);
            var currency=data.curr;
            if(!amount)
                continue;
            cc.logNoDate("%s profit %f",currency.toLowerCase(),amount);
        }
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









