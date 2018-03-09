/**
 * Created by joe on 2018/3/8.
 */
config={};
fund={};

require("./common-js/server/global.js");
//require("./logic/fund/wallet.js");

config.apikey=ccsp.config.getFromJson("res/config/apikey.json");
config.server=ccsp.config.getFromJson("res/config/server.json");


const hbsdk = require('./huobipro/hbsdk');

var getHistory=function (pairName) {
    hbsdk.get_history(pairName).then(info=>{
        //cc.logObj(info);
        var dataArr=info;
        for(var i=0;i<dataArr.length;i++){
            var data=dataArr[i];
            var id=data.id;
            var amount=parseFloat(data["filled-amount"]);
            var price=parseFloat(data.price);
            var time=parseFloat(data["created-at"]);
            var action=data.type.split('-')[0];
            cc.logNoDate("%s %s %s %f trade %f price %f",ccsp.time.getTimeStrFromTimeMS(time),
                pairName,action,amount,price*amount,price);
        }
    });
};

var main=function () {
    var orderPairArr=["TNBBTC","EOSETH"];
    for(var i in orderPairArr){
        var pairName=orderPairArr[i].toLowerCase();
        getHistory(pairName);
    }

};

main();