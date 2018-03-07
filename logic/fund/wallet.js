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
        if(dataArr){
           var funcName="onUpdate"+ccsp.string.capitalize(this.type);
           this[funcName](dataArr);
        }

    }

    onUpdateFunding(dataArr){
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
                cc.log("bitfinex found wallet:onUpdate %s %f",currency,amount);
            }
        }
    }

    onUpdateBinance(dataArr){
        for(let i=0,m=dataArr.length;i<m;i++){
            let data=dataArr[i];
            let currency=data.asset.toLowerCase();
            if(currency!=this.currency)
                continue;
            let amount=parseFloat(data.free)+parseFloat(data.locked);
            this.amount=amount;
            cc.log("binance wallet: %s %f",currency,amount);
            break;
        }
    }

    onUpdateHuobipro(dataArr){
        for(let i=0,m=dataArr.length;i<m;i++){
            let data=dataArr[i];
            let currency=data.currency;
            if(currency!=this.currency)
                continue;
            let amount=parseFloat(data.balance);
            this.amount=amount;
            cc.log("huobipro wallet: %s %f",currency,amount);
            break;
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
        cc.log("bitfinex wallet: %s %s %f %f",this.type,this.currency,this.amount,this.free);
    }
}

fund.wallet=wallet;