import { getData, postData } from '@/utils/request/request_mapi.js'




/*
    管理员登录
    params:{   
        account":"          复检人员账号
        password":""        密码
    }
*/
export const login = (reqData) => {
    const url = '/login';
    const data = reqData;
    return postData(url, data);
}

/*
    获取回收点
    params:{   

    }
*/
export const recoverySelect = (reqData) => {
    const url = '/recovery/select';
    const data = reqData;
    return getData(url, data);
}


/*
    获取历史回收记录
    params:{   
        page:''   页
        limit:''  数量
    }
*/
export const recoveryHistory = (reqData) => {
    const url = '/recovery/history';
    const data = reqData;
    return getData(url, data);
}

/*
    提交回收点垃圾
    params : {
        list: [
            {
                rfid: '', //rfid
                weight: '',// 重量
            }
        ],
        address: '', //回收站名字
        name: '', //回收站名字
        licenseplatenumber:'' //车牌号
    }
*/

export const recoveryRecyclesubmission = (reqData) => {
    const url = '/recovery/recyclesubmission';
    const data = reqData;
    return postData(url, data);
}

/*
    历史记录详情
    params : {
        taskid: '', //回收id
    }    
*/

export const recoveryHistorydetailed = (reqData) => {
    const url = '/recovery/historydetailed';
    const data = reqData;
    return getData(url, data);
}

/*
    车辆经纬度上传  
    params:{   
        longitude: '', //经度
        latitude: '', //纬度
        licenseplatenumber: '', //车牌号
    }
*/
export const transmissionGps = (reqData) => {
    const url = '/transmission/gps';
    const data = reqData;
    return postData(url, data);
}

/*
    车辆出行  
    params:{   
        licenseplatenumber: '', //车牌号
    }
*/
export const transmissionTravel = (reqData) => {
    const url = '/transmission/travel';
    const data = reqData;
    return postData(url, data);
}

/*
    车辆回归  
    params:{   
        licenseplatenumber: '', //车牌号
    }
*/
export const transmissionRegression = (reqData) => {
    const url = '/transmission/regression';
    const data = reqData;
    return postData(url, data);
}

/*
    修改车辆号    --- 废弃
    params:{   
        oldLicenseplatenumber: '', //旧车牌号
        newLicenseplatenumber: '', //新车牌号
    }
*/
export const transmissionModify = (reqData) => {
    const url = '/transmission/modify';
    const data = reqData;
    return postData(url, data);
}

/*
    获取车牌号
    params:{   
    
    }
*/
export const transmissionSelecticenseplatenumber = (reqData) => {
    const url = '/transmission/selecticenseplatenumber';
    const data = reqData;
    return getData(url, data);
}

/*
    获取车辆出行状态
    params:{   
    
    }
*/
export const transmissionObtain = (reqData) => {
    const url = '/transmission/obtain';
    const data = reqData;
    return getData(url, data);
}










