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
        if(this.rate)
            var rate=String(this.rate);
        else
            var rate="FRR";
        return ccsp.string.sprintf("%s %d %s %f %s %d",timeStr,this.id,this.currency,this.amount,rate,this.day);
    }
}

fund.order=order;