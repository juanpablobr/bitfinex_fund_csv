/**
 * Created by joe on 2017/11/15.
 */

logic.routine={

    start:function(){
        let loop=0;
        cc.log("logic.routine.start begin!");
        this.init();
        ccsp.timer.exec(function(){
            var timeInfo=ccsp.time.getDate();


            if(timeInfo.h==10 && timeInfo.min==1 && timeInfo.s==0){
                this.doFixedTimeJob();
            }

            this.doEverySecJob();

            if(loop++%10==0)
                this.doEvery10SecJob();

            if(loop%20==0)
                this.doEvery60SecJob();


        }.bind(this),"logic.routine.1",1);
    },

    init:function(){

    },

    //在固定时间做的事情
    doFixedTimeJob:function(){
        cc.log("logic.routine.doFixedTimeJob:begin!");
    },

    //每60秒都会做的事情
    doEvery60SecJob:function () {
        // g_fundHistoryMgr.cleanOldData();
    },

    //每10秒都会做的事情
    doEvery10SecJob:function () {

    },

    //每秒都会做的事情
    doEverySecJob:function(){

    }
};