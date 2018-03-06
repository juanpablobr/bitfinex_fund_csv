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

config.apikey=g_configKey.bitfinex;
config.server=ccsp.config.getFromJson("res/config/server.json");


const BFX = require('bitfinex-api-node');
let bws=new BFX(config.apikey.key,config.apikey.secret,{version:2,transform:true}).ws;
g_bws=bws;


var main=function () {
    fund.walletMgr.init();

    var max=g_currency_array.length;
    var count=0;

    bws.on('auth',()=>{
        cc.log("authenticated successful!");
        cc.log("auth ok,begin to get wallet info");
        fund.walletMgr.getWalletInfo();

        // bws.subscribeTrades(['fBTC']);
    });

    bws.on('open',()=>{
        cc.log("open ok,begin to auth");
        bws.auth();
        // for(var i in g_currency_array){
        //     util.monitorFundTrade(g_currency_array[i]);
        // }
        // g_fundHistoryMgr.cleanOldData();
    });




    bws.on('wu', (v) => {
        //cc.log("wu %s",v[1]);
        var currency=v[1].toLowerCase();
        var type=v[0];
        if(type!=="funding")
            return;
        var wallet=fund.walletMgr[currency];
        if(!wallet)
            return;
        wallet.update(v);
        if(++count>=max){
            cc.log("end");
            process.exit(0);
        }
    });

    bws.on('error', console.error);
};

main();