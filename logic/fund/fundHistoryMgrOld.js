/**
 * Created by joe on 2017/11/13.
 */
class fundHistoryMgrOld{
    constructor(currencyArr,cb){
        this._viewList={};
        var load=0;
        var onOK=function(){
            if(++load<currencyArr.length)
                return;
            cb?cb():null;
        }.bind(this);
        for(var i in currencyArr){
            var currency=currencyArr[i];
            var timeLimit=ccsp.time.getTimeMS()-24*3600*1000*90;
            var condition=" time>="+timeLimit;
            var sort="rate desc";
            this._viewList[currency]=new ccsp.table_view_list(g_db,currency,condition,sort,onOK);
        }

    }

    getView(currency){
        return this._viewList[currency];
    }

    resortData(currency){
        var rawArr=this.getView(currency).dump();
        var newLine=rawArr.pop();
        var rate=newLine.rate;
        for(var i=0,l=rawArr.length;i<l;i++){
            if(rate>=rawArr[i].rate){
                var otherPart=rawArr.splice(0,i+1);
                otherPart.push(newLine);
                this.getView(currency)._data=otherPart.concat(rawArr);
                return;
            }
        }
        rawArr.push(newLine);
    }

    insert(currency,id,rate,amount,day,time,cb){
        var view=this.getView(currency);
        if(ccsp.arrayMgr.findIndexOfKV(view.dump(),"id",id)!==null){
            return;
        }
        var json={id:id,rate:rate,amount:amount,day:day,time:time};
        view.dump().push(json);
        this.resortData(currency);

        view.insert(json,true).then(newID=>{
            cc.log("fundHistoryMgr:%s id %d inset fund history ok, rate %f amount %f",currency,id,rate,amount);
            cb?cb():null;
        });
    }

    getLatest(currency,day,rate){
        if(!day)
            day=1;
        var curTime=ccsp.time.getTimeMS();
        var begin=curTime-24*3600*day*1000;
        var data=this.getView(currency).dumpGreaterEqual("time",begin);
        if(!data || !data.length)
            return data;
        if(!rate)
            return data;
        return ccsp.arrayMgr.get_greater_equal(data,"rate",rate/100);
    }

    getTopRate(currency,max){
        if(!max)
            max=3;
        var day=1;
        //var data=this.getView(currency).dump();
        var curTime=ccsp.time.getTimeMS();
        var begin=curTime-24*3600*day*1000;
        var data=this.getView(currency).dumpGreaterEqual("time",begin);
        var ret=[];
        for(let i=0;i<max;i++){
            if(!data[i])
                break;
            ret.push(data[i]);
        }
        return ret;
    }

    cleanOldData(day,cb){
        if(!day)
            day=7;
        var count=0;
        var max=ccsp.objMgr.getLength(this._viewList);
        var time=ccsp.time.getTimeMS()-24*3600*day*1000;
        for(var i in this._viewList){
            this._viewList[i].delByConditionStr("time<"+time).then(
            function (deleted) {
                count++;
                cc.log("fundHistoryMgr:cleanOldData %s history before %d days ok total %d deleted",this,day,deleted);
                if(count>=max){
                    cb();
                }
            }.bind(i)
            );
        }

    }
}