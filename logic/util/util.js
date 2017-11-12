/**
 * Created by joe on 2017/11/5.
 */
util={
    //[price,totalAmount,tradeCount]
  calculateAvaragePrice:function (tradeArr) {
      if(!tradeArr || !tradeArr.length)
          return [0,0,0];
      let price=0;
      let amount=0;
      let loop=0;
      for(let i=0,m=tradeArr.length;i<m;i++){
          let trade=tradeArr[i];
          if(typeof trade!=="object")
              continue;
          amount+=Math.abs(trade.AMOUNT);
          price+=Math.abs(trade.PRICE);
          loop++;
      }
      return [price/loop,amount,loop];
  },

    calculateAvarageRate:function (tradeArr) {
        if(!tradeArr || !tradeArr.length)
            return [0,0,0];
        let price=0;
        let amount=0;
        let loop=0;
        let id=0;
        let time=0;
        let day=0;
        for(let i=0,m=tradeArr.length;i<m;i++){
            let trade=tradeArr[i];
            if(typeof trade!=="object")
                continue;
            amount+=Math.abs(trade.AMOUNT);
            price+=Math.abs(trade.RATE);
            id=trade.AMOUNT;
            time=trade.MTS;
            day=trade.PERIOD;
            loop++;
        }
        return [price/loop,amount,loop];
    },

};