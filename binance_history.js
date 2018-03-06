/**
 * Created by joe on 2018/3/6.
 */
config={};
fund={};

require("./common-js/server/global.js");
require("./logic/fund/wallet.js");

config.apikey=ccsp.config.getFromJson("res/config/apikey.json").binance;
config.server=ccsp.config.getFromJson("res/config/server.json");

const Binance = require('binance-api-node').default;
const client = Binance({
    apiKey: config.apikey.key,
    apiSecret: config.apikey.secret,
});

var limit=50;
var parseDataArr=function (pairName,dataArr) {
    for(var i=0,m=dataArr.length;i<m;i++){
        var data=dataArr[i];
        var price=data.price;
        var amount=data.qty;
        var time=parseFloat(data.time);
        var action=data.isBuyer==1?"sell":"buy";
        cc.logNoDate("%s %s %s %s price %s",ccsp.time.getTimeStrLongFromTimeMS(time),pairName,action,amount,price);
    }
};

var getTradeHistory=function (pairName) {
    var cfg={"recvWindow":30*1000};
    cfg.symbol=pairName;
    cfg.limit=limit;
    client.myTrades(cfg).then(info=>{
        //cc.logObj(info);
        parseDataArr(pairName,info.reverse());
    }).catch(e=>{cc.log("error:"+e)});
};



var main=function () {
    var orderPairArr=["TNBBTC","EOSETH"];
    for(let i in orderPairArr){
        getTradeHistory(orderPairArr[i]);
    }
};

main();
