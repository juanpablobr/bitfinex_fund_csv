/**
 * Created by joe on 2017/11/4.
 */
require("./common-js/server/global.js");
require("./common-js/common/csv.js");


var insertLine=function (saveList,currency,profit,dateStr) {
    if(!saveList[currency])
        saveList[currency]={};
    var time=ccsp.time.getTimeMSFromMtimeStr(dateStr);
    saveList[currency][time]=profit;
};

var orgData=function (arr) {
    var ret={};
    for(var currency in arr){
        var dataList=arr[currency];
        for(var time in dataList){
            var profit=parseFloat(dataList[time]);
            if(!ret[currency])
                ret[currency]={};
            var floorTime=ccsp.time.floor(parseInt(time));
            if(!ret[currency][floorTime])
                ret[currency][floorTime]=profit;
            else
                ret[currency][floorTime]+=profit;
        }
    }
    return ret;
};

var printData=function (arr) {
    for(var currency in arr){
        var dataList=arr[currency];
        cc.log(currency);
        for(var time in dataList){
            cc.log("%s %f",ccsp.time.getTimeStrToMonthFromTime(time),dataList[time]);
        }
    }
};

var arg1=process.argv[2];

var csvArr=ccsp.csv.readCSV(arg1,"\n");

var tempData={};

for(var i=1,m=csvArr.length;i<m;i++){
    var line=csvArr[i];
    var currency=line[0];
    var profit=line[2];
    var date=line[3];

    if(!currency)
        continue;
    insertLine(tempData,currency,profit,date);
}

var checkedData=orgData(tempData);
printData(checkedData);

cc.log("ok");