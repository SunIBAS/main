function hosts() {
    if (location.href.includes('localhost')) {
        return "http://localhost:8080/"
    } else {
        return "http://www.sunibas.cn/"
    }
}
Promise.prototype.toJson = function() { return this.then(__ => __.text()).then(JSON.parse); }
const apis = {
    okCode: 200,
    utils: {
        list(page,size) {
            return fetch(hosts() + `utils/list?page=${page}&size=${size}`,{method: 'post'})
                .toJson()
                .then(_ => {
                    if (_.code == apis.okCode) {
                        return {
                            count: _.data.total,
                            hasNext: _.data.hasNext,
                            hasPrevious: _.data.hasPrevious,
                            list: _.data.list
                        }
                    } else {
                        return {
                            error: _.message,
                            count: 0,
                            hasNext: false,
                            hasPrevious: false,
                            list: []
                        }
                    }
                });
        }
    },
    user: {
        login({password,username}) {
            return fetch(`${hosts()}/login?username=${username}&password=${password}`,{
                method: 'POST'
            })
                .then(_ => _.text())
                .then(JSON.parse)
                .then(_ => {
                    if (_.code === 200) {
                        sessionStorage.setItem('token',_.data.id);
                        return _.data;
                    } else {
                        throw new Error(_.message);
                    }
                });
        },
        info() {
            let token = sessionStorage.getItem("token");
            return fetch( `${hosts()}/info?token=` + token,{method: 'post'})
                .then(_ => _.text()).then(JSON.parse);
        },
        checkLogin(cb) {
            let token = sessionStorage.getItem("token");
            if (this.isLogin) {
                cb(this);
            } else {
                this.isLogin = false;
                UserDao.info(token).then(_ => {
                    if (_.code === 200) {
                        this.userInfo = _.data;
                        this.isLogin = true;
                    }
                    cb(this);
                });
            }
        }
    }
};