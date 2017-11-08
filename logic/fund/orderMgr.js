/**
 * Created by joe on 2017/11/8.
 */
fund.orderMgr={
    order_list:{},
    init:function (dataArr) {
        this.order_list={};
        for(var i=0,m=dataArr.length;i<m;i++){
            var order=new fund.order(dataArr[i]);
            this.order_list[order.id]=order;
        }
    },

    printAll:function () {
        for(var id in this.order_list){
            cc.log(this.order_list[id].toString());
        }
    }
};