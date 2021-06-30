
# 目录结构
``` 
└─  src
    ├─ assets               项目公共资源
    ├─ api                  网络请求     
    ├─ components           项目公共组件
    ├─ directive            指令
    ├─ mixins               混入
    ├─ icons                图标
    ├─ layout               布局
    ├─ plugins              外挂程序设置
    ├─ config               配置
    ├─ router               路由
    ├─ styles               公共css
    ├─ store                vuex
    ├─ utils                常用工具
    ├─ views                页面
    ├─ app                  vue入口
    ├─ main                 入口
    ├─ permission           路由守卫
    └─ settings             网页设置
```

## cordova 注意事项
1. main.js 注册vue实例时 要使用deviceready回调注册
``` js
    document.addEventListener('deviceready', vue, false);
```

2. index.html 加入 cordova.js 标签
``` js
    <script type="text/javascript" src="cordova.js"></script>
```


## 数字滚动库
```
vue-countTo
```

## 代替 window.open 用来打开手机其他app
``` js
cordova-plugin-inappbrowser
```

## 文件
``` js
cordova plugin add cordova-plugin-file
```

## 文件传输
``` js
cordova plugin add cordova-plugin-file-transfer
```

## 相机
``` js
cordova plugin add cordova-plugin-camera
```

## 蓝牙
``` js
cordova plugin add cordova-plugin-ble-central
```

## rfid 本地插件
``` js
cordova-plugin-serial
```

## 串口读写 插件
```  
仓库 https://github.com/xseignard/cordovarduino
```

## 定位 插件
```  
不使用 cordova plugin add cordova-amap-location --variable ANDROID_KEY=a8722b4eb3823426c6e1cc9e6e5a340d --variable IOS_KEY=7a39624200180ee16988655ecbba9d59
将参数直接写死在里面配置里面 cordova plugin add cordova-amap-location
仓库 https://github.com/douxc/cordova-amap-location
  
高德 猎鹰定位
AmapTrackPlugin
```


## 使用loading提示
``` js
this.$loading({
    content:'',
    mask:true,
    icon:true,
})
this.$toast({
    content:'',
})
this.$loadingHide();
```

## cordova 默认https 想用http需要配置


头像和昵称未添加
