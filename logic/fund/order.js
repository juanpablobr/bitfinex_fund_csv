/**
 * Created by joe on 2017/11/8.
 */
class order{
    constructor(data){
        this.id=data[0];
        this.currency=data[1].substr(1).toLowerCase();
        this.time=data[2];
        this.amount=data[4];
        this.rate=data[14];
        this.day=data[15];
    }

    toString(){
        var timeStr=ccsp.time.getTimeStrFromTimeMS(this.time);
        return ccsp.string.sprintf("%s %d %s %f %f %d",timeStr,this.id,this.currency,this.amount,this.rate,this.day);
    }
}

fund.order=order;