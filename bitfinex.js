/**
 * Created by joe on 2017/11/5.
 */
config={};
fund={};


require("./common-js/server/global.js");
require("./common-js/common/csv.js");

require("./logic/util/util.js");

require("./logic/fund/order.js");
require("./logic/fund/orderMgr.js");
require("./logic/fund/wallet.js");
require("./logic/fund/walletMgr.js");

config.apikey=ccsp.config.getFromJson("res/config/apikey.json");

const BFX = require('bitfinex-api-node');
let bws=new BFX(config.apikey.key,config.apikey.secret,{version:2,transform:true}).ws;
g_bws=bws;

var send1=function () {
    var p={
            event: "subscribe",
            channel: "trades",
            symbol: "EOS"
    };
    g_bws.send(p);
};



bws.on('auth',()=>{
    cc.log("authenticated successful!");
    cc.log("opne ok,begin to get wallet info");
    fund.walletMgr.getWalletInfo();
    send1();
    bws.subscribeTrades(['fBTC']);
});

bws.on('open',()=>{
    cc.log("open ok,begin to auth");
    bws.auth();
});

bws.on('subscribed', (v) => {
    cc.log('subscribed %j',v)
});

bws.on('orderbook', (pair, book) => {
    cc.log('Order book:', book)
});

bws.on('trade', (pair, tradeArr) => {
    var info=util.calculateAvaragePrice(tradeArr);
    var price=ccsp.float.getfloat(info[0],8);
    var amount=ccsp.float.getfloat(info[1],8);
    cc.log('trade %s: %08f %08f %d',pair,price,amount,info[2]);
});

bws.on('orderbook', (pair, tradeArr) => {
    var info=util.calculateAvaragePrice(tradeArr);
    var price=ccsp.float.getfloat(info[0],8);
    var amount=ccsp.float.getfloat(info[1],8);
    cc.log('trade %s: %08f %08f %d',pair,price,amount,info[2]);
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
    fund.orderMgr.init(v);
    fund.orderMgr.printAll();
});

bws.on('fte', (v) => {
    cc.log("fte");
});
bws.on('ftu', (v) => {
    cc.log("ftu");
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