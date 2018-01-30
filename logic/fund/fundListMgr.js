/**
 * Created by joe on 2018/1/30.
 */
fund.listMgr={
    _order_list:{},
    /*
     ID	integer	Offer ID
     SYMBOL	string	The currency of the offer (fUSD, etc)
     SIDE	string	"Lend" or "Loan"
     MTS_CREATE	int	Millisecond Time Stamp when the offer was created
     MTS_UPDATE	int	Millisecond Time Stamp when the offer was created
     AMOUNT	float	Amount the offer is for
     FLAGS	object	future params object (stay tuned)
     STATUS	string	Offer Status: ACTIVE, EXECUTED, PARTIALLY FILLED, CANCELED
     RATE	float	Rate of the offer
     PERIOD	int	Period of the offer
     MTS_OPENING	int	Millisecond Time Stamp for when the loan was opened
     MTS_LAST_PAYOUT	int	Millisecond Time Stamp for when the last payout was made
     NOTIFY	int	0 if false, 1 if true
     HIDDEN	int	0 if false, 1 if true
     INSURED	int	0 if false, 1 if true
     RENEW	int	0 if false, 1 if true
     RATE_REAL	float	the calculated rate for FRR and FRRDELTAFIX
     NO_CLOSE	int	If funding will be returned when position is closed. 0 if false, 1 if true
     */
    init:function (dataArr) {
        for(var i=0,m=dataArr.length;i<m;i++){
            var order=dataArr[i];
            var currency=order[1].substr(1).toLowerCase();
            if(!this._order_list[currency])
                this._order_list[currency]=[];
            var info={};
            info.id=order[0];
            info.rate=order[19]*100;
            info.amount=order[5];
            info.day=order[12];
            info.lendTime=order[13];
            info.expireTime=order[13]+info.day*24*3600*1000;  //try 3,4,13,14
            info.expireMS=info.expireTime-ccsp.time.getTimeMS();
            this._order_list[currency].push(info);
        }
    },

    printCurrency:function (currency,sortKey,verbos) {
        var infoArr=this._order_list[currency];
        if(!infoArr){
            cc.log("not date for %s",currency);
            return;
        }

        var sortByRate=function (a,b) {
            return b.rate-a.rate;   //from big to small
        };
        var sortByExpireTime=function (a,b) {
            return a.expireMS-b.expireMS;   //from small to big
        };
        var sortByAmount=function (a,b) {
            return b.amount-a.amount;   //from big to small
        };

        var sortCall={
            "rate":  sortByRate,
            "expire":sortByExpireTime,
            "amount":sortByAmount
        };

        if(!sortKey)
            sortKey="expire";
        var sortFunc=sortCall[sortKey];
        if(sortFunc)
            infoArr.sort(sortFunc);
        var profit=0;
        for(var i in infoArr){
            var info=infoArr[i];
            var dayProfit=info.rate*info.amount/100;
            profit+=dayProfit;
            if(!verbos)
                cc.log("id %s %s rate %f amount %f expire in %s",info.id,currency,
                    info.rate,
                    ccsp.float.getfloat(info.amount,4),
                    ccsp.time.getDuration2(info.expireMS/1000)
                );
            else
                cc.log("id %s %s rate %f amount %f expire in %s %s,lend at %s profit %f",info.id,currency,
                info.rate,
                ccsp.float.getfloat(info.amount,4),
                ccsp.time.getDuration2(info.expireMS/1000),
                ccsp.time.getTimeStrFromTimeMS(info.expireTime),
                ccsp.time.getTimeStrFromTimeMS(info.lendTime),dayProfit
            );
        }
        cc.log("profit is %f/day predict %f/month %f/year\n",profit,profit*30,profit*30*12);
    },

    printAll:function (sortKey,verbos) {
        for(var currency in this._order_list){
            this.printCurrency(currency,sortKey,verbos);
        }
    }
};