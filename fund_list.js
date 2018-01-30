/**
 * Created by joe on 2018/1/30.
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
require("./logic/fund/fundListMgr.js");

require("./logic/routine.js");
require("./config.js");

config.apikey=ccsp.config.getFromJson("res/config/apikey.json");
config.server=ccsp.config.getFromJson("res/config/server.json");


const BFX = require('bitfinex-api-node');
let bws=new BFX(config.apikey.key,config.apikey.secret,{version:2,transform:true}).ws;
g_bws=bws;

var currency=process.argv[2];
var sortKey=process.argv[3];
var verbos=process.argv[4];
if(verbos==="-v")
    verbos=true;
else
    verbos=false;
var main=function () {

    bws.on('auth',()=>{
        cc.log("authenticated successful!");
        cc.log("auth ok");
    });

    bws.on('open',()=>{
        cc.log("open ok,begin to auth");
        bws.auth();
    });


    bws.on('subscribed', (v) => {
        cc.log('subscribed %j',v)
    });


    bws.on('ticker', (pair, ticker) => {
        cc.log('ticker:', ticker)
    });

    // bws.on('info', (v) => {
    //     if(v.version)
    //         cc.log("websocket version:%d",v.version);
    //     else if(v.code)
    //         cc.log("recv:%d %s",v.code,v.msg);
    //     else
    //         cc.logObj(v);
    // });

    bws.on('fcs', (v) => {
        //自己的出借列表，对方使用了
        cc.log("fcs");
        //cc.logObj(v);
        fund.listMgr.init(v);
        if(currency)
            fund.listMgr.printCurrency(currency,sortKey,verbos);
        else
            fund.listMgr.printAll(sortKey,verbos);
        process.exit(0);
    });

    // bws.on('fls', (v) => {
    //     //自己的出借列表，对方没有使用
    //     cc.log("fls");
    //     cc.logObj(v);
    // });
    bws.on('error', console.error);
};

main();