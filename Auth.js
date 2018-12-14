// 权限
import db from '../Db/db.js';

const config = {
    auth_rules:'auth_rules',
    auth_groups:'auth_groups',
    auth_group_access:'auth_group_access'
};

exports.yangAuth = {

    /**
     * 检查权限
     * @param name 需要验证的规则列表
     * @param uid  用户ID
     * @param callback 回调
     */
    check: function(name , uid , callback) {

        let ret = {};

        this.getAuthMsg(uid , function (data) {

            if(data.id === 1){

                let rules = data.rules;

                if(rules.indexOf(name) > -1){

                    ret.id = 1;
                    ret.msg = '权限验证通过';

                    callback (ret);

                }else{

                    ret.id = 2;
                    ret.msg = '该用户没有这个权限';

                    callback (ret);

                }

            }else{

                callback (data);
            }

        });
    },

    /**
     * 根据用户id获取用户组
     * @param uid 用户ID
     * @param callback 回调
     */
    getGroups:async function(uid , callback){
        let ret = {};

        let accesses = await db.sql.table(config.auth_group_access).where({
            uid:uid
        }).querySql();

        if(accesses.length > 0){

            let auth_groups = [];

            accesses.forEach(async(access) => {

                let groups = await db.sql.table(config.auth_groups).where({
                    id:access.group_id
                }).querySql();

                groups.forEach(function (group) {

                    if (group.status === 1){

                        auth_groups.push(group);
                        ret.id = 1;
                        ret.msg = '权限组验证成功';
                        ret.groups = auth_groups;

                        callback (ret);
                    }else{

                        ret.id = 3;
                        ret.msg = '该权限组已被禁用';

                        callback (ret);

                    }

                });

            })

        }else{

            ret.id = 2;
            ret.msg = '暂无该用户的对应的权限组，请联系超级管理员';

            callback (ret);

        }
    },

    /**
     * 获得权限列表
     * @param uid 用户ID
     * @param callback  回调
     */
    getAuthMsg:function (uid , callback) {

        let rules = [];
        let ret = {};
        let num = 0;

        this.getGroups(uid ,  (groups)=> {
            if(groups.groups){

                groups.groups.forEach( (group) =>{

                    let ids =  group.rules.split(',');

                    ids.forEach(async(id)=> {

                        let rule = await db.sql.table(config.auth_rules).where({
                            id:id
                        }).querySql();

                        num = num + 1;

                        if(rule[0]['rule']){

                            rules.push(rule[0]['rule']);

                        }else{

                            rules.push(rule[0]['name']);

                        }

                        if(num === ids.length){


                            ret.id = 1;
                            ret.msg = '获取到该权限组对应的权限';
                            ret.rules = rules;

                            callback (ret);

                        }

                    });

                })

            }else{

                ret.id = 4;
                ret.msg = '该用户暂时没有权限组';

                callback(ret);

            }

        });

    }
};