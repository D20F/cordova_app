import store from "@/store/index";

var bles = {
    data() {
        return {
            list: [],
            // audioDom: '', //音频DOM
            startScanWithOptionsTimer: '', // 搜索蓝牙定时关闭回调  -- 暂定15秒
            connectTimer: '',              // 连接蓝牙定时关闭回调  -- 暂定5秒
            weighCache:[],   // 搜索到的 重量蓝牙缓存
            tagCache:[],     // 搜索到的 标签蓝牙缓存
            link_weighCache:[],   // 搜索到的 重量蓝牙缓存
            link_tagCache:[],     // 搜索到的 标签蓝牙缓存
            service_uuid: "0000FFE0-0000-1000-8000-00805F9B34FB", // 厂家 - 固定的UUID
            characteristic_uuid: "0000FFE1-0000-1000-8000-00805F9B34FB", // 厂家 - 固定的UUID
        }
    },
    created() {
        // 有线2     5246020000800010500E010C E28011700000020FEBEAD3B5 1A
        // 蓝牙1     5246020000800010500E010C E28011700000020FEBEB12DC B3 
        // 蓝牙2     5246020000800010500E010C E28011700000020FEBEAD3B5 1A
        // 蓝牙3     5246020000800010500E010C E28011700000020FEBEAEB56 61
    },
    beforeDestroy() { },
    methods: {
        // 有线RFID读写  --- 暂时废弃
        serialOpen() {
            let that = this;
            serial.requestPermission(
                function (successMessage) {
                    serial.open(
                        { baudRate: 115200 },
                        function (successMessage) {
                            serial.registerReadCallback(
                                function success(data) {
                                    let view = new Uint8Array(data);
                                    if (view.length >= 1) {
                                        let str = '';
                                        for (var i = 0; i < view.length; i++) {
                                            str += Number(view[i]).toString(16).length == 1 ? ('0' + Number(view[i]).toString(16)) : Number(view[i]).toString(16);
                                        }
                                        str = str.substr(24, 24);
                                        store.commit("RFIDCacheFun", str);

                                    }
                                },
                                (errorCallback) => { that.$loading({ content: "插件打开失败,请重启应用", mask: true, icon: true, }); }
                            );
                        },
                        (errorCallback) => { that.$loading({ content: "插件打开失败,请重启应用", mask: true, icon: true, }); }
                    );
                },
                (errorCallback) => { that.$loading({ content: "插件打开失败,请重启应用", mask: true, icon: true, }); }
            );
        },

        // 初始化音频播放器
        // 只需要初始化一次 在layout初始就行了
        audioInit() {
            // 语音
            // let mp3 = new Audio();
            // document.querySelector('body').append(mp3);


        },
        // 播放  给不同src播放不一样的
        audioplay(data) {
            // 语音
            // let src = require("@/static/audio/we.mp3");
            // this.audioDom = document.querySelector('audio')
            // this.audioDom.src = src;
            // this.audioDom.play();
            // 应该试试播放被中断 是如何播放音频的
            // mp3.play();   不play不会主动播放
            // load()	重新加载音频元素。 加载后不会自动播放的 
            // play()	开始播放音频。
            // pause()	暂停当前播放的音频。
            TTS.speak({
                text: data,
                locale: 'zh-CN',
                rate: 0.85
            }, function () {

            }, function (reason) {

            });
        },

        // 断开所有蓝牙
        allClose() {
            return new Promise((resolve, reject) => {
                Promise.all([
                    this.disconnect(store.state.recycle.leftDevice),
                    this.disconnect(store.state.recycle.rightDevice),
                    this.disconnect(store.state.recycle.leftTagDevice),
                    this.disconnect(store.state.recycle.righTagtDevice),
                ])
                    .then((res) => {
                        resolve('res')
                        // this.$toast({ content: "断开蓝牙连接成功" });
                    })
                    .catch((err) => {
                        reject('err');
                        // this.$toast({ content: "断开蓝牙连接失败" });
                    });
            })
        },

        // 写入buff 归零称 
        rest(id, type) {
            const buffer = new Uint8Array([
                0x02,
                0x52,
                0x5a,
                0x52,
                0x40,
                0xbe,
                0x0d,
            ]).buffer;
            this.write(buffer, id)
                .then(() => {
                    if (type == "left") {
                        store.commit("leftWeightFun", 0.00);
                    } else {
                        store.commit("rightWeightFun", 0.00);
                    }
                })
                .catch(() => { });
        },
        //报告是否启用了蓝牙
        isEnabled() {
            ble.isEnabled(
                (device) => {
                    // this.$toast("蓝牙已启动");
                    this.timeoutSearch();
                },
                (failure) => {
                    this.enable();
                }
            );
        },
        // 提醒用户启动蓝牙
        enable() {
            ble.enable(
                (device) => {
                    // this.$toast("启动蓝牙成功");
                    this.timeoutSearch();
                },
                (failure) => {
                    // this.$toast({ content: "用户启动蓝牙失败" });
                    this.$loading({
                        content: "请开启蓝牙,并重启软件",
                        mask: true,
                        icon: true,
                    });
                }
            );
        },
        timeoutSearch(){
            // 只搜索15秒 超时取消搜索
            this.$loading({
                content: "蓝牙连接中",
                mask: true,
                icon: true,
            });
            this.startScanWithOptions();
            this.startScanWithOptionsTimer = setTimeout(() => {
                this.stopScan();
                if (this.weighCache.length >= 1 && this.tagCache.length >= 1) {
                    // 连接蓝牙
                    for (let item of this.weighCache) {
                        this.connect(item.device, item.type);
                    }
                    for (let item of this.tagCache) {
                        this.connect(item.device, item.type);
                    }
                    // 注册连接蓝牙回调 
                    this.connectTimer = setTimeout(() => {
                        if (this.link_weighCache.length >= 1 && this.link_tagCache.length >= 1) {
                            this.$toast({ content: "部分蓝牙连接完成" });
                            this.audioplay('部分蓝牙连接完成'); 
                            let arr = JSON.parse(JSON.stringify(this.weighCache.concat(this.tagCache)))
                            let arrs = JSON.parse(JSON.stringify(this.link_weighCache.concat(this.link_tagCache)))
                            for (let i = 0; i < arr.length; i++) {
                                for (let l = 0; l < arrs.length; l++) {
                                    if (arr[i].device == arrs[l].device) {
                                        arr.splice(i,1);
                                        arrs.splice(l,1);
                                    } 
                                }
                            }
                            this.$loadingHide();
                            // 弹出 连接弹窗 
                            this.$bleShow({
                                list: arr
                            });
                        } else{
                            this.$loadingHide();
                            // 弹出切换车牌 弹窗
                            this.$carShow(false);
                            this.$toast({ content: "连接蓝牙少于两个,请检查蓝牙设备" });
                            // this.$loading({
                            //     content: "连接蓝牙少于两个,请检查蓝牙设备",
                            //     mask: true,
                            //     icon: true,
                            // });
                            this.audioplay('连接蓝牙少于两个,请检查蓝牙设备'); 
                        }
                    }, 5000);
                } else{
                    this.$loadingHide();
                    // 弹出切换车牌 弹窗
                    this.$carShow(false);
                    this.$toast({ content: "搜索蓝牙少于两个,请检查蓝牙设备" });
                    // this.$loading({
                    //     content: "搜索蓝牙少于两个,请检查蓝牙设备",
                    //     mask: true,
                    //     icon: true,
                    // });
                    this.audioplay('搜索蓝牙少于两个,请检查蓝牙设备'); 
                }
            }, 10000);
        },
        // 扫描并发现BLE外设
        startScanWithOptions() {
            ble.startScanWithOptions(
                [],
                { reportDuplicates: false },
                (device) => {
                    // 电子秤 电子标签
                    if (device.id == store.state.recycle.leftDevice) {
                        this.weighCache.push( { device:device.id, type:'left_scales' } )
                    } else if (device.id == store.state.recycle.rightDevice) {
                        this.weighCache.push( { device:device.id, type:'right_scales' } )
                    } else if (device.id == store.state.recycle.leftTagDevice) { 
                        this.tagCache.push( { device:device.id, type:'left_tag' } )
                    } else if (device.id == store.state.recycle.righTagtDevice) {
                        this.tagCache.push( { device:device.id, type:'right_tag' } )
                    }
                    // 要考虑多种情况 这个地方只考虑 找满的情况
                    if (this.weighCache.length == 2 && this.tagCache.length == 2) {
                        // 已经停止搜索 取消搜索定时回调
                        clearTimeout(this.startScanWithOptionsTimer);
                        this.stopScan();
                        for (let item of this.weighCache) {
                            this.connect(item.device, item.type);
                        }
                        for (let item of this.tagCache) {
                            this.connect(item.device, item.type);
                        }
                        // 写入连接回调
                        this.connectTimer = setTimeout(() => {
                            if (this.link_weighCache.length >= 1 && this.link_tagCache.length >= 1) {
                                this.$toast({ content: "部分蓝牙连接完成" });
                                this.audioplay('部分蓝牙连接完成'); 
                                let arr = JSON.parse(JSON.stringify(this.weighCache.concat(this.tagCache)))
                                let arrs = JSON.parse(JSON.stringify(this.link_weighCache.concat(this.link_tagCache)))
                                for (let i = 0; i < arr.length; i++) {
                                    for (let l = 0; l < arrs.length; l++) {
                                        if (arr[i].device == arrs[l].device) {
                                            arr.splice(i,1);
                                            arrs.splice(l,1);
                                        } 
                                    }
                                }
                                this.$loadingHide();
                                // 弹出 连接弹窗 
                                this.$bleShow({
                                    list: arr
                                });
                            } else{
                                this.$loadingHide();
                                // 弹出切换车牌 弹窗
                                this.$carShow(false);
                                this.$toast({ content: "连接蓝牙少于两个,请检查蓝牙设备" });
                                // this.$loading({
                                //     content: "连接蓝牙少于两个,请检查蓝牙设备",
                                //     mask: true,
                                //     icon: true,
                                // });
                                this.audioplay('连接蓝牙少于两个,请检查蓝牙设备'); 
                            }
                        }, 5000);
                    }
                },
                (failure) => {
                    // this.$toast({ content: "扫描失败" });
                }
            );
        },
        // 停止扫描
        stopScan() {
            ble.stopScan(
                (device) => {
                    // this.$toast("停止扫描");  // --- 实验停止成功记得注释
                },
                (failure) => {
                    this.$toast({ content: "停止扫描失败" }); // --- 实验停止成功记得注释
                }
            );
        },
        // 连接
        connect(id, type) {
            ble.connect(
                id,
                (device) => {
                    // this.$toast({ content: "蓝牙秤连接成功" + type });
                    // 注册特征值更改
                    this.startNotification(id, type);
                    // 写入连接缓存
                    if (type == "left_scales" || type == "right_scales") {
                        this.link_weighCache.push( { device:id, type:type } )
                    } else {
                        this.link_tagCache.push( { device:id, type:type } )                        
                    }
                    // 同步缓存到vuex
                    let arr = this.link_weighCache.concat(this.link_tagCache)
                    store.commit("linkBleFun", arr);
                    // 完美连接到自己搜索到的蓝牙数
                    if (this.link_weighCache.length == this.weighCache.length && this.link_tagCache.length == this.tagCache.length) {
                        if(this.link_weighCache.length !== 2 && this.link_tagCache.length !== 2){
                            this.audioplay('部分蓝牙连接完成'); 
                        } else{
                            this.audioplay('蓝牙连接完成'); 
                        }
                        // 取消连接回调
                        clearTimeout(this.connectTimer);
                        this.$loadingHide();
                    }
                },
                (failure) => {
                    // this.$toast({ content: "蓝牙秤连接失败" });
                }
            );
        },
        // 断开连接
        disconnect(id) {
            return new Promise((resolve, reject) => {
                ble.disconnect(
                    id,
                    (device) => {
                        resolve("success");
                        // this.$toast({ content: "断开连接成功" });
                    },
                    (failure) => {
                        reject("err");
                        // this.$toast({ content: "断开连接失败" });
                    }
                );
            });
        },
        // 电子秤注册以在特征值更改时得到通知
        startNotification_Scales(buffer, type) {
            let result = this.ab2hex(buffer);
            let str = this.hexCharCodeToStr(result);
            let types = [];
            let state = Number(
                "0x" + result.substring(4, 6)
            ).toString(2);
            if (state.length == 7) {
                state = "0" + state;
            }
            if (state.substring(6, 7) == "1") {
                types.push("稳定");
            } else {
                types.push("不稳定");
            }
            if (state.substring(4, 5) == "1") {
                types.push("称量溢出");
            }
            if (state.substring(7, 8) == "1") {
                types.push("零点");
            }

            // console.log(`重量：${Number(str.substring(3, 10))}kg (${type}), 电量：${str.substring(12, 14)}%`);
            let cache = {
                weight: str.substring(3, 10),
                state: types
            }
            if (type == "left_scales") {
                store.commit("leftWeightFun", cache);
            } else {
                store.commit("rightWeightFun", cache);
            }
        },
        // 电子标签注册以在特征值更改时得到通知
        startNotification_Tag(buffer, type) {
            let view = new Uint8Array(buffer);
            let str = '';
            if (view.length >= 1) {
                for (var i = 0; i < view.length; i++) {
                    str += Number(view[i]).toString(16).length == 1 ? ('0' + Number(view[i]).toString(16)) : Number(view[i]).toString(16);
                }
                str = str.substr(24, 24);
            }
            if (type == "left_tag") {
                store.commit("leftRFIDCacheFun", str);
            } else {
                store.commit("rightRFIDCacheFun", str);
            }
        },
        // 注册以在特征值更改时得到通知。
        startNotification(id, type) {
            return new Promise((resolve, reject) => {
                ble.startNotification(
                    id,
                    this.service_uuid,
                    this.characteristic_uuid,
                    (buffer) => {
                        if (type == "left_scales" || type == "right_scales") {
                            this.startNotification_Scales(buffer, type);
                        } else {
                            this.startNotification_Tag(buffer, type);
                        }
                        resolve('suceess');
                    },
                    (failure) => {
                        // this.$toast({ content: "获取广播失败" });
                        reject("获取广播失败");
                        this.$loadingHide();
                        this.$loading({
                            content: "获取广播失败,请重启软件",
                            mask: true,
                            icon: true,
                        });
                    }
                );
            });
        },
        // 停止特征值广播
        stopNotification(id) {
            return new Promise((resolve, reject) => {
                ble.stopNotification(
                    id,
                    this.service_uuid,
                    this.characteristic_uuid,
                    (buffer) => {
                        // this.$toast({ content: "停止广播成功" });
                        resolve("停止广播成功");
                    },
                    (failure) => {
                        this.$toast({ content: "停止广播失败" });
                        reject("停止广播失败");
                    }
                );
            });
        },
        // 写 ArrayBuffer
        write(buffer, id) {
            return new Promise((resolve, reject) => {
                ble.write(
                    id,
                    this.service_uuid,
                    this.characteristic_uuid,
                    buffer,
                    (device) => {
                        this.audioplay('重置重量成功'); 
                        this.$toast({ content: "重置重量成功" });
                        resolve("写入buffer成功");
                    },
                    (failure) => {
                        this.audioplay('重置重量失败'); 
                        this.$toast({ content: "重置重量失败" });
                        reject("写入buffer失败");
                    }
                );
            });
        },
        hexCharCodeToStr(hexCharCodeStr) {
            var trimedStr = hexCharCodeStr.trim();
            var rawStr =
                trimedStr.substr(0, 2).toLowerCase() === "0x"
                    ? trimedStr.substr(2)
                    : trimedStr;
            var len = rawStr.length;
            if (len % 2 !== 0) {
                alert("存在非法字符!");
                return "";
            }
            var curCharCode;
            var resultStr = [];
            for (var i = 0; i < len; i = i + 2) {
                curCharCode = parseInt(rawStr.substr(i, 2), 16);
                resultStr.push(String.fromCharCode(curCharCode));
            }
            return resultStr.join("");
        },
        ab2hex(buffer) {
            const hexArr = Array.prototype.map.call(
                new Uint8Array(buffer),
                function (bit) {
                    return ("00" + bit.toString(16)).slice(-2);
                }
            );
            return hexArr.join("");
        },



        // 未使用api
        // 扫描
        scan() {
            ble.scan(
                [],
                5,
                (device) => {
                    alert(JSON.stringify(device));
                },
                (failure) => {
                    alert(JSON.stringify(failure));
                }
            );
        },
        // 开始扫描
        startScan() {
            ble.startScan(
                [],
                (device) => {
                    alert(JSON.stringify(device));
                },
                (failure) => {
                    alert(JSON.stringify(failure));
                }
            );
        },
        setPin() {
            ble.setPin(
                "",
                (device) => {
                    this.$toast({ content: "设置pin成功" });
                },
                (failure) => {
                    this.$toast({ content: "设置pin失败" });
                }
            );
        },
        // 自动连接
        autoConnect() {
            ble.autoConnect(
                this.device_id,
                (device) => {
                    alert(JSON.stringify("成功", device));
                },
                (failure) => {
                    alert(JSON.stringify("失败", failure));
                }
            );
        },
        // 读取 ArrayBuffer
        read() {
            ble.read(
                this.device_id,
                this.service_uuid,
                this.characteristic_uuid,
                (device) => {
                    alert(JSON.stringify("成功", device));
                },
                (failure) => {
                    alert(JSON.stringify("失败", failure));
                }
            );
        },
        //报告连接状态。
        isConnected() {
            ble.isConnected(
                this.device_id,
                (device) => {
                    alert(JSON.stringify("成功", device));
                },
                (failure) => {
                    alert(JSON.stringify("失败", failure));
                }
            );
        },
        //报告是否启用了位置服务
        isLocationEnabled() {
            ble.isLocationEnabled(
                (device) => {
                    alert(JSON.stringify("成功", device));
                },
                (failure) => {
                    alert(JSON.stringify("失败", failure));
                }
            );
        },
        // 打开操作系统的蓝牙设置
        showBluetoothSettings() {
            ble.showBluetoothSettings(
                (device) => {
                    alert(JSON.stringify("成功", device));
                },
                (failure) => {
                    alert(JSON.stringify("失败", failure));
                }
            );
        },
        // 查找绑定的设备
        bondedDevices() {
            ble.bondedDevices(
                (device) => {
                    alert(JSON.stringify("成功", device));
                },
                (failure) => {
                    alert(JSON.stringify("失败", failure));
                }
            );
        },
        // string 转换 buff
        stringToBytes(string) {
            var array = new Uint8Array(string.length);
            for (var i = 0, l = string.length; i < l; i++) {
                array[i] = string.charCodeAt(i);
            }
            return array.buffer;
        },
        // buff 转换 string
        bytesToString(buffer) {
            return String.fromCharCode.apply(null, new Uint8Array(buffer));
        },
    },



}
export default bles;
/*
let s = {
    // 废弃RFID代码
    beforeDestroy() {
        let that = this;
        if (typeof Serial != "undefined") {
            // 关闭串口
            Serial.close(
                {},
                function () {
                    // that.$toast({ content: "关闭RFID插件成功" });
                },
                function (err) {
                    that.$toast({ content: "关闭RFID插件失败" });
                }
            );
        }
    },
    methods: {
        initRFID() {
            var that = this;
            that.$loading({
                content: "插件获取中",
                mask: true,
                icon: true,
            });
            if (typeof Serial != "undefined") {
                // 打开串口
                Serial.open(
                    {},
                    // 串口已被打开
                    function () {
                        that.$loadingHide();
                        // 注册一个read回调
                        Serial.registerReadCallback(
                            function success(res) {
                                if (
                                    Object.prototype.hasOwnProperty.call(
                                        res,
                                        "data"
                                    )
                                ) {
                                    // 未获取   bb01ff00011516
                                    // 获取指令1 bb02220011d73400e28011700000020febead3b592b7da
                                    // 获取epc1 e28011700000020febead3b5
                                    // 获取epc2 e28011700000020febeb12dc
                                    // bb02
                                    // 2200
                                    // 11d7
                                    // 3400
                                    // e28011700000020febead3b5
                                    // 92b7da
                                    // console.log("result:", res.data);
                                    let str = res.data;
                                    if (str == "bb01ff00011516") {
                                        that.$toast({
                                            content:
                                                "获取标签失败,请贴近桶标签",
                                        });
                                    } else {
                                        that.RFIDdata = str.substr(16, 24);
                                        that.$toast({
                                            content: "获取标签成功",
                                        });
                                    }
                                }
                            },
                            //read错误回调
                            function (err) {
                                that.$toast({ content: "获取标签失败" });
                                console.error(err);
                            }
                        );
                    },
                    // 打开串口失败的回调
                    function (err) {
                        console.error(err);
                        that.$toast({
                            content: "RFID 插件初始化失败,请重新进入页面",
                        });
                    }
                );
            } else {
                that.$toast({ content: "Serial 为空" });
            }
        },
        searchRFID() {
            // 切割返回的数据
            // 发送指令 BB00220000227E
            if (
                typeof Serial != "undefined" &&
                typeof Serial.writeHex != "undefined"
            ) {
                Serial.writeHex("BB00220000227E");
            } else {
                this.$toast({ content: "serial 为空" });
            }
        },
        initSerial() {
            var that = this;
            that.$loading({
                content: "插件获取中",
                mask: true,
                icon: true,
            });
            if (typeof Serial != "undefined") {
                // 打开串口
                Serial.open(
                    {},
                    // 串口已被打开
                    function () {
                        that.$loadingHide();
                        // 注册一个read回调
                        Serial.registerReadCallback(
                            function success(res) {
                                if (
                                    Object.prototype.hasOwnProperty.call(
                                        res,
                                        "data"
                                    )
                                ) {
                                    // 'ff16210000100014110000002ee28011700000020febeaeb56d3c6f949'
                                    // 'ff162100001000141100000030e28011700000020febead3b592b76bcc'
                                    // e28011700000020febeaeb56
                                    // e28011700000020febead3b5
                                    let str = res.data;
                                    if (str.length == 58) {
                                        that.RFIDdata = str.substr(26, 24);
                                        that.$toast({
                                            content: "获取标签成功",
                                        });
                                    } else {
                                        that.$toast({
                                            content:
                                                "获取标签失败,请贴近桶标签",
                                        });
                                    }
                                }
                            },
                            //read错误回调
                            function (err) {
                                that.$toast({ content: "获取标签失败" });
                                console.error(err);
                            }
                        );

                        // 上电后，模块处于非应用模式，只能接受一些基本指令。不能进行RFID相关指令操作。
                        // 必须使用启动应用固件指令
                        Serial.writeHex("FF00041D0B");
                    },
                    // 打开串口失败的回调
                    function (err) {
                        console.error(err);
                        that.$loadingHide();
                        that.$toast({
                            content: "RFID 插件初始化失败,请重新进入页面",
                        });
                    }
                );
            } else {
                that.$toast({ content: "Serial 为空" });
            }
        },
        searchSerial() {
            // 切割返回的数据
            // 发送指令 FF052101E81000142F6D
            if (
                typeof Serial != "undefined" &&
                typeof Serial.writeHex != "undefined"
            ) {
                Serial.writeHex("FF052101E81000142F6D");
            } else {
                this.$toast({ content: "serial 为空" });
            }
        },
    }
}
*/