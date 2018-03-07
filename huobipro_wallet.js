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
    //hbsdk.get_account().then(console.log);
    hbsdk.get_balance().then(info=>{
        var currencyArr=["btc","eth","eos","tnb","bch"];
        for(let i in currencyArr){
            let wallet=new fund.wallet("huobipro",currencyArr[i],info.list);
        }

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
};

main();