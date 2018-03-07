/**
 * Created by joe on 2018/3/7.
 */
config={};
fund={};

require("./common-js/server/global.js");
require("./logic/fund/wallet.js");

config.apikey=ccsp.config.getFromJson("res/config/apikey.json");
config.server=ccsp.config.getFromJson("res/config/server.json");


const hbsdk = require('./huobipro/hbsdk');

const Binance = require('binance-api-node').default;
const client = Binance({
    apiKey: config.apikey.binance.key,
    apiSecret: config.apikey.binance.secret,
});

var balance={};
var loop=0;

var check=function () {
    if(loop>=2)
        cc.logObj(balance);
};

var main=function () {
    var currencyArr=["btc","eth","eos","tnb","bch"];

    hbsdk.get_balance().then(info=>{
        for(let i in currencyArr){
            let wallet=new fund.wallet("huobipro",currencyArr[i],info.list);
            if(typeof balance[wallet.currency]==="undefined")
                balance[wallet.currency]=wallet.amount;
            else
                balance[wallet.currency]+=wallet.amount;
        }
        loop++;
        check();
    });

    client.accountInfo({"recvWindow":30*1000}).then(info=>{
        for(let i in currencyArr){
            let wallet=new fund.wallet("binance",currencyArr[i],info.balances);
            if(typeof balance[wallet.currency]==="undefined")
                balance[wallet.currency]=wallet.amount;
            else
                balance[wallet.currency]+=wallet.amount;
        }
        loop++;
        check();
    }).catch(e=>{cc.log("error:"+e)});
};


main();