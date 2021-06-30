

/**
 * 回收
 * @property {string}   leftDevice               左秤device id
 * @property {string}   rightDevice              右秤device id
 * @property {string}   leftTagDevice            左rfid id
 * @property {string}   righTagtDevice           右rfid id
 * @property {string}   linkBle                  已连接蓝牙
 * @property {string}   rightWeight              右秤重量  
 * @property {string}   rightWeight              右秤重量  
 * @property {string}   leftRFIDCache            左rfid读取数据   
 * @property {string}   rightRFIDCache           右rfid读取数据  
 * @property {string}   RFIDCache                RFID有线读取标签暂存  -- 暂时弃用
 * @property {string}   RFIDState                RFID读取开关  -- 暂时弃用 回调函数那块创建的时候读取不到变化的rfidstate 可以考虑用函数即使调用
**/
const RECYCLE = {
    state: () => ({
        leftDevice: '',
        rightDevice: '',
        leftTagDevice: '',
        righTagtDevice: '',
        linkBle: [],
        leftWeight: {
            weight: '0.00',
            state: '初始'
        },
        rightWeight: {
            weight: '0.00',
            state: '初始'
        },
        leftRFIDCache: "",
        rightRFIDCache: "",
        RFIDCache: "",    // -- 暂时弃用
        RFIDState: false,  // -- 暂时弃用
    }),
    mutations: {
        leftDeviceFun(state, data) {
            state.leftDevice = data;
        },
        rightDeviceFun(state, data) {
            state.rightDevice = data;
        },
        leftTagDeviceFun(state, data) {
            state.leftTagDevice = data;
        },
        righTagtDeviceFun(state, data) {
            state.righTagtDevice = data;
        },
        linkBleFun(state, data) {
            state.linkBle = data;
        },
        leftWeightFun(state, data) {
            state.leftWeight = data;
        },
        rightWeightFun(state, data) {
            state.rightWeight = data;
        },
        RFIDCacheFun(state, data) {
            state.RFIDCache = data;
        },
        leftRFIDCacheFun(state, data) {
            state.leftRFIDCache = data;
        },
        rightRFIDCacheFun(state, data) {
            state.rightRFIDCache = data;
        },
        RFIDStateFun(state, data) {
            state.RFIDState = data;
        },
    },
    actions: {

    },
    modules: {

    }
}

export default RECYCLE

