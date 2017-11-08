/**
 * Created by joe on 2017/11/5.
 */
class wallet{
    //type:funding,exchange,margin
    constructor(type,currency,dataArr){
        this.currency=currency;
        this.type=type;
        this.amount=0;
        this.free=0;
        if(dataArr)
            this.onUpdate(dataArr);
    }

    onUpdate(dataArr){
        for(let i=0,m=dataArr.length;i<m;i++){
            let data=dataArr[i];
            if(data[0]!==this.type)
                continue;
            let currency=data[1].toLowerCase();
            if(currency!=this.currency)
                continue;
            let amount=data[2];
            if(amount){
                this.amount=amount;
                cc.log("wallet:onUpdate %s %f",currency,amount);
            }
        }
    }


    update(data){
        if(data[0]!==this.type)
            return;
        let currency=data[1].toLowerCase();
        if(currency!=this.currency)
            return;
        this.amount=data[2];
        this.free=data[4];
        cc.log("wallet:update %s %s %f %f",this.type,this.currency,this.amount,this.free);
    }
}

fund.wallet=wallet;