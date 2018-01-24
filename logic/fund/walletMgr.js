/**
 * Created by joe on 2017/11/8.
 */
fund.walletMgr={
  // eth:new fund.wallet("funding","eth"),
  // eos:new fund.wallet("funding","eos"),
  // btc:new fund.wallet("funding","btc"),
  // usd:new fund.wallet("funding","usd"),
  // ltc:new fund.wallet("funding","ltc"),

    init:function () {
        for(var i in g_currency_array){
            var c=g_currency_array[i];
            this[c]=new fund.wallet("funding",c);
        }
    },

    getWalletInfoOld:function () {
        var p=[
            0,
            "calc",
            null,
            [
                ["margin_sym_tBTCUSD"],
                ["position_tBTCUSD"],
                ["wallet_margin_BTC"],
                ["wallet_exchange_USD"],
                ["wallet_exchange_EOS"],
                ["wallet_funding_ETH"],
                ["wallet_funding_EOS"],
                ["wallet_funding_BTC"],
                ["wallet_funding_USD"],
                ["wallet_funding_LTC"]
            ]
        ];
        g_bws.send(p);
    },

    getWalletInfo:function () {
        var arr=[];
        for(var i in g_currency_array){
            arr.push(["wallet_funding_"+g_currency_array[i].toUpperCase()]);
            //arr.push(["wallet_exchange_"+g_currency_array[i].toUpperCase()]);
        }
        var p=[
            0,
            "calc",
            null,
            arr
        ];
        g_bws.send(p);
    },

};