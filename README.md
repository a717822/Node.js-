# node-auth
### 简介
ThinkPHP里的Auth.class权限验证类，将该类的思想移植到Node.js里


### 如何使用
1）在main.js引入
``` bash

var auth = require('node-auth');

或

import auth from 'node-auth';

```

### 方法介绍

1、检查权限 check

``` bash
    /**
     * 检查权限
     * @param name 需要验证的规则列表
     * @param uid  用户ID
     * @param callback 回调
     */
    check: function(name , uid , callback) {}
```

2、根据用户id获取用户组  getGroups

``` bash
/**
     * 根据用户id获取用户组
     * @param uid 用户ID
     * @param callback 回调
     */
    getGroups:async function(uid , callback){}
```

3、获得权限列表 getAuthMsg
``` bash
/**
     * 获得权限列表
     * @param uid 用户ID
     * @param callback  回调
     */
    getAuthMsg:function (uid , callback) {}
```