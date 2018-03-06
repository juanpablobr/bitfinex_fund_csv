/**
 * Created by joe on 2018/3/6.
 */
/**
 * Created by joe on 2018/3/5.
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




var main=function () {
    //g_binance.time().then(time => cc.log(time));
    //cc.log(await g_binanceAuthed.accountInfo());
    var orderPairArr=["TNBBTC","EOSETH"];
    for(let i in orderPairArr){
        var cfg={"recvWindow":30*1000};
        cfg.symbol=orderPairArr[i];
        client.openOrders(cfg).then(info=>{
            cc.logObj(info)
        }).catch(e=>{cc.log("error:"+e)});
    }
};

main();