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
    client.accountInfo({"recvWindow":30*1000}).then(info=>{
        var currencyArr=["btc","eth","eos","tnb","bcc"];
        for(let i in currencyArr){
            let wallet=new fund.wallet("binance",currencyArr[i],info.balances);
        }

    }).catch(e=>{cc.log("error:"+e)});
};

main();