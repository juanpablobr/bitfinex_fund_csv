/**
 * Created by joe on 2017/11/14.
 */
/**
 * Created by joe on 2017/5/9.
 */
class dataListModel{
    constructor(tableName,conditionJson,sort,primaryKey,cb){
        this.view=new ccsp.table_view_list(g_db,tableName,conditionJson,sort,cb);
        this._objList={};
        this._tableName=tableName;
        this._conditionJson=conditionJson;
        if(!primaryKey)
            primaryKey="id";
        this._primaryKey=primaryKey;
    }

    setSynchronizeWithMgrModel(dataMgrModel){
        this._syncDataMgrModel=dataMgrModel;
    }

    //return all data
    //the key is the value of uniqueKeyName
    //the value is one line data
    // dump(uniqueKeyName){
    //     if(!uniqueKeyName)
    //         uniqueKeyName="id";
    //     var dataList=this.view.dump();
    //     if(!dataList)
    //         return null;
    //     let retList={};
    //     for(let v of dataList){
    //         if(!v[uniqueKeyName])
    //             return null;
    //         retList[v[uniqueKeyName]]=v;
    //     }
    //     return retList;
    // }

    syncInsert(jsonData){
        this.view.insert(jsonData).then(newID=>{
            jsonData.id=newID;
            this._syncDataMgrModel.insertOnlyMem(jsonData);
            return newID;
        });
    }

    syncUpdate(jsonData){
        this.view.update(jsonData).then(changed=>{
            if(changed)
                return this._syncDataMgrModel.updateOnlyMem(jsonData);
            return 0;
        });
    }

    syncDel(jsonData){
        this.view.del(jsonData).then(changed=>{
            if(changed)
                return this._syncDataMgrModel.delOnlyMem(jsonData);
            return 0;
        });
    }

    getLineData(valueInPrimaryKey){
        var index=ccsp.arrayMgr.findIndexOfKV(this.dump(),this._primaryKey,valueInPrimaryKey);
        if(index===null)
            return null;
        return this.dump()[index];
    }

    //return all data by array
    dump(){
        return this.view.dump();
    }

    createObject(valueJson){
        return this.view.insert(valueJson);
    }

    updateObject(valueJson){
        var conditionJson=ccsp.objMgr.clone(this._conditionJson);
        conditionJson[this._primaryKey]=valueJson[this._primaryKey];
        return this.view.update(valueJson,conditionJson);
    }

    addObject(k,obj){
        this._objList[k]=obj;
    }

    delOnlyMem(v){
        delete this._objList[v];
    }

    delObject(k,v){
        var self=this;
        var delJson={};
        delJson[k]=v;
        return this.view.del(delJson).then(delRow=>{
            if(delRow && self._objList[v]){
                delete self._objList[v];
            }
            return delRow;
        });
    }

    getObject(k){
        return this._objList[k];
    }

    getObjectByID(id) {
        if(this._objList[id])
            return this._objList[id];
        return null;
    }

    getObjectByTid(tid) {
        for(var i in this._objList){
            if(this._objList[i].view.tid==tid){
                return this._objList[i];
            }
        }
        return null;
    }

    reload(){
        return this.view.reload();
    }

}

logic.dataListModel=dataListModel;