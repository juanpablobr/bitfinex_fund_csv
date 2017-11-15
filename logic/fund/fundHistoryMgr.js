/**
 * Created by joe on 2017/11/13.
 */
class fundHistoryMgr{
    constructor(currencyArr,cb){
        this._viewList={};
        var load=0;
        var onOK=function(){
            if(++load<currencyArr.length)
                return;
            cb?cb():null;
        };
        for(var i in currencyArr){
            var currency=currencyArr[i];
            var timeLimit=ccsp.time.getTimeMS()-24*3600*1000;
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
            cc.log("fundHistoryMgr:%s %d inset fund trade rate %f amount %f ok,resort ok",currency,id,rate,amount);
            cb?cb():null;
        });
    }

    getLatest24Hour(currency){
        var curTime=ccsp.time.getTimeMS();
        var begin=curTime-24*3600*1000;
        return this.getView(currency).dumpByScore(begin,curTime);
    }
}

// class fundHistoryMgr{
//     constructor(){
//         this._viewList={};
//     }
//
//     getView(currency){
//         if(!this._viewList[currency])
//             this._viewList[currency]=new ccsp.redis_view_ordered_set(g_redis,"fund_history_"+currency);
//         return this._viewList[currency];
//     }
//
//     insert(currency,id,rate,amount,day,time){
//         var json={id:id,rate:rate,amount:amount,day:day,time:time};
//         this.getView(currency).insert(ccsp.json.toString(json)).then(()=>{
//             cc.log("orderMgr:%s inset fund trade rate %f amount %f ok",currency,rate,amount);
//         });
//     }
//
//     getLatest24Hour(currency){
//         var curTime=ccsp.time.getTimeMS();
//         var begin=curTime-24*3600*1000;
//         return this.getView(currency).dumpByScore(begin,curTime);
//     }
// }


fund.fundHistoryMgr=fundHistoryMgr;