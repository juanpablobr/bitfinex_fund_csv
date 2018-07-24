/**
 * Created by joe on 2018/3/13.
 */
/**
 * Created by joe on 2017/11/13.
 */
class fundHistoryMgr{
    constructor(currencyArr){
        this._viewList={};
        this._idList={};
        for(var i in currencyArr){
            var currency=currencyArr[i];
            this._viewList[currency]=new ccsp.table_view_list_light(g_db,currency);
            this._idList[currency]={};
        }
    }

    getView(currency){
        return this._viewList[currency];
    }

    insert(currency,id,rate,amount,day,time,cb){
        var view=this.getView(currency);
        if(this._idList[currency][id]){
            cc.log("fundHistoryMgr:%s id %d rate %f amount %f inserting,omit",currency,id,rate,amount);
            cb?cb():null;
            return;
        }
        this._idList[currency][id]=1;
        // if(ccsp.arrayMgr.findIndexOfKV(view.dump(),"id",id)!==null){
        //     return;
        // }
        view.get("id="+id).then(v=>{
            if(v && v.length){
                cc.log("fundHistoryMgr:%s id %d rate %f amount %f already exists,omit",currency,id,rate,amount);
                cb?cb():null;
            }else{
                var json={id:id,rate:rate,amount:amount,day:day,time:time};
                //cc.log("begin to insert %s id %d",currency,id);
                view.insert(json).then(newID=>{
                    //cc.log("fundHistoryMgr:%s id %d inset fund history ok, rate %f amount %f",currency,id,rate,amount);
                    cb?cb():null;
                }).catch(()=>{});
            }
        });
    }

    getLatest(currency,day,rate){
        if(!day)
            day=1;
        var curTime=ccsp.time.getTimeMS();
        var begin=curTime-24*3600*day*1000;
        // var data=this.getView(currency).dumpGreaterEqual("time",begin);
        // if(!data || !data.length)
        //     return data;
        // if(!rate)
        //     return data;
        // return ccsp.arrayMgr.get_greater_equal(data,"rate",rate/100);

        var str=ccsp.string.sprintf("time>=%d and rate >=%f",begin,rate/100);
        return this.getView(currency).get(str,"order by rate desc");
    }

    getTopRate(currency,max,day){
        if(!max)
            max=3;
        if(max>=1000)
            max=1000;
        if(!day)
            day=7;
        var curTime=ccsp.time.getTimeMS();
        var begin=curTime-24*3600*day*1000;
        // var data=this.getView(currency).dumpGreaterEqual("time",begin);
        // var ret=[];
        // for(let i=0;i<max;i++){
        //     if(!data[i])
        //         break;
        //     ret.push(data[i]);
        // }
        // return ret;

        var str=ccsp.string.sprintf("limit 0,%d",max);
        return this.getView(currency).getLimit("time>="+begin,"order by rate desc",str);
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