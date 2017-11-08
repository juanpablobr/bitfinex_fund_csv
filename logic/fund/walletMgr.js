/**
 * Created by joe on 2017/11/8.
 */
fund.walletMgr={
  eth:new fund.wallet("funding","eth"),
  eos:new fund.wallet("funding","eos"),
  btc:new fund.wallet("funding","btc"),
  usd:new fund.wallet("funding","usd"),
  ltc:new fund.wallet("funding","ltc"),

    getWalletInfo:function () {
        var p=[
            0,
            "calc",
            null,
            [
                ["margin_sym_tBTCUSD"],
                ["position_tBTCUSD"],
                ["wallet_margin_BTC"],
                ["wallet_exchange_USD"],
                ["wallet_funding_ETH"],
                ["wallet_funding_EOS"],
                ["wallet_funding_BTC"],
                ["wallet_funding_USD"],
                ["wallet_funding_LTC"]
            ]
        ];
        g_bws.send(p);
    },

};