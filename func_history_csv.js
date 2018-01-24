/**
 * Created by joe on 2017/11/4.
 */
/**
 * Created by joe on 2017/11/4.
 */
require("./common-js/server/global.js");
require("./common-js/common/csv.js");



var arg1=process.argv[2];
var limit=process.argv[3];
if(!limit)
    limit=0.1;

var csvArr=ccsp.csv.readCSV(arg1,"\n");
var max=0;
var maxIndex=0;
for(var i=1,m=csvArr.length;i<m;i++){
    var line=csvArr[i];
    var time=line[0];
    var rate=line[2]*100;
    var amount=line[4];

    if(!amount)
        continue;
    if(rate>max){
        max=rate;
        maxIndex=i;
    }

    if(rate>=limit)
        cc.log("%s %f %f",ccsp.time.getTimeStrFromTime(time),rate,amount);
}

var line=csvArr[maxIndex];
var time=line[0];
var rate=line[2]*100;
var amount=line[4];
cc.log("max rate is :");
cc.log("%s %f %f",ccsp.time.getTimeStrFromTime(time),rate,amount);

cc.log("ok");