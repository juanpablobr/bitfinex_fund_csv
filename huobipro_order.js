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

var main=function () {
    var orderPairArr=["TNBBTC","EOSETH"];
    for(var i in orderPairArr){
        var pairName=orderPairArr[i].toLowerCase();
        hbsdk.get_open_orders(pairName).then(info=>{
            cc.logObj(info);

            // var dataArr=info.list;
            // for(var i=0;i<dataArr.length;i++){
            //     var data=dataArr[i];
            //     var value=parseFloat(data.balance);
            //     if(data.type==="frozen"){
            //         if(value){
            //             cc.log("frozen %s %f",data.currency,value);
            //         }
            //     }else{
            //         if(value){
            //             cc.log("%s %f",data.currency,value);
            //         }
            //     }
            // }
        });
    }

};

main();