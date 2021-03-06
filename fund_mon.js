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
require("./config.js");

config.apikey=g_configKey.bitfinex;
config.server=ccsp.config.getFromJson("res/config/server.json");

g_db = new ccsp.mysql_es6(
    config.server.db.host, config.server.db.port, config.server.db.user,
    config.server.db.pass, config.server.db.name, config.server.db.charset,
    config.server.db.conn_max, config.server.db.queue_max
);
g_db.test_connection().then(() => cc.log("g_db test ok"), err => {
    cc.log(err);
    process.exit(-1);
});


const BFX = require('bitfinex-api-node');
let bws=new BFX(config.apikey.key,config.apikey.secret,{version:2,transform:true}).ws;
g_bws=bws;





var main=function () {
    cc.log("main:begin");
    fund.walletMgr.init();
    // logic.routine.start();

    bws.on('auth',()=>{
        cc.log("authenticated successful!");
        //cc.log("auth ok,begin to get wallet info");
        fund.walletMgr.getWalletInfo();
        // bws.subscribeTrades(['fBTC']);
    });

    bws.on('open',()=>{
        cc.log("open ok,begin to auth");
        bws.auth();
        for(var i in g_currency_array){
            util.monitorFundTrade(g_currency_array[i]);
        }
        // g_fundHistoryMgr.cleanOldData();
    });

    bws.on('subscribed', (v) => {
        cc.log('subscribed %j',v)
    });

    // bws.on('orderbook', (pair, book) => {
    //     cc.log('Order book:', book)
    // });

    bws.on('trade', (pair, tradeInfo) => {
        var currency=pair.substr(1,3).toLowerCase();
        if(tradeInfo.length){
            for(var i in tradeInfo ){
                var trade=tradeInfo[i];
                var id=trade.ID;
                var amount=Math.abs(trade.AMOUNT);
                var time=trade.MTS;
                var rate=trade.RATE;
                var day=trade.PERIOD;
                g_fundHistoryMgr.insert(currency,id,rate,amount,day,time);
                // cc.log('fund booking history:insert %s %d %s %f %f %d',currency,id,ccsp.time.getTimeStrFromTimeMS(time),
                //     amount,rate,day);
            }
            return;
        }

        //funding trade history
        var id=tradeInfo.MTS[0];
        var time=tradeInfo.MTS[1];
        var amount=Math.abs(tradeInfo.MTS[2]);
        var rate=tradeInfo.MTS[3];
        var day=tradeInfo.MTS[4];
        g_fundHistoryMgr.insert(currency,id,rate,amount,day,time);
        // cc.log('fund booking history:insert %s %d %s %f %f %d',currency,id,ccsp.time.getTimeStrFromTimeMS(time),
        //     amount,rate,day);
    });

    bws.on('orderbook', (pair, tradeArr) => {
        var info=util.calculateAvaragePrice(tradeArr);
        var price=ccsp.float.getfloat(info[0],8);
        var amount=ccsp.float.getfloat(info[1],8);
        cc.log('orderbook current %s: %08f %08f %d',pair,price,amount,info[2]);
    });

    bws.on('ticker', (pair, ticker) => {
        // cc.log('Ticker:', ticker)
    });

    bws.on('info', (v) => {
        // cc.logObj(v1);
        if(v.version)
            cc.log("websocket version:%d",v.version);
        else if(v.code)
            cc.log("recv:%d %s",v.code,v.msg);
        else
            cc.logObj(v);
    });


    bws.on('ws', (v) => {
        cc.log("ws");
        // for(var i in walletCfg){
        //     var currency=walletCfg[i];
        //     g_fundETHWallet=new logic.wallet("funding","ETH",v);
        // }
    });

    bws.on('wu', (v) => {
        // cc.log("wu");
        var currency=v[1].toLowerCase();
        var type=v[0];
        if(type!=="funding")
            return;
        var wallet=fund.walletMgr[currency];
        if(!wallet)
            return;
        wallet.update(v);
        // cc.logObj(v);
        // g_fundWallet.onUpdate(v);
    });

    bws.on('fiu', (v) => {
        cc.log("fiu");
        cc.logObj(v);
    });
    bws.on('bu', (v) => {
        cc.log("bu");
        cc.logObj(v);
    });
    bws.on('fos', (v) => {
        cc.log("fos");
        cc.log("funding my order current lis:");
        fund.orderMgr.init(v);
        fund.orderMgr.printAll();
    });

    bws.on('fte', (v) => {
        //my funding order taken
        var id=v[0];
        var currency=v[1];  //'fBTC'
        var time=v[2];
        var amount=v[4];
        var rate=v[5];
        var day=v[6];
        cc.log("fte");
    });
    bws.on('ftu', (v) => {
        cc.log("ftu");
    });
    bws.on('fcs', (v) => {
        //自己的出借列表，对方使用了
        cc.log("fcs");
    });
    bws.on('fls', (v) => {
        //自己的出借列表，对方没有使用
        cc.log("fls");
    });
    bws.on('fon', (v) => {
        cc.log("fon");
    });
    bws.on('fou', (v) => {
        cc.log("fou");
    });
    bws.on('foc', (v) => {
        //单子被人借走
        cc.log("foc");
    });
    bws.on('hfos', (v) => {
        cc.log("hfos");
    });
    bws.on('hos', (v) => {
        cc.log("hos");
    });
    bws.on('os', (v) => {
        cc.log("os");
    });
    bws.on('hist', (v) => {
        cc.log("hist");
    });
    bws.on('error', console.error);
};

//g_fundHistoryMgr=new fund.fundHistoryMgr(g_currency_array,main);

g_fundHistoryMgr=new fund.fundHistoryMgr(g_currency_array);
main();