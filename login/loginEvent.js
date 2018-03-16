/**
 * @file 绑定登录相关event
 */
// 引入系统配置
const conf = require('jsConf').api.appLogin;
const {addEvent, formPost, jsonp, getCookie, randomGenerator, encrypt} = require('jsCommon');
const debounce = require('lodash/debounce');
const _assign = require('lodash/assign');
const bindEvent = function (opts) {
    let $input = [].slice.call(document.getElementsByClassName('eap-input-needclear'));
    for (let i = 0; i < $input.length; i++) {
        addEvent($input[i], 'input', function (e) {
            let val = this.value;
            if (val && val.trim().length) {
                getId(this.name + '-clearbtn').style.display = 'block';
            }
        })
    }
    let $clear = [].slice.call(document.getElementsByClassName('eap-clearbtn-inner'));
    for (let i = 0; i < $clear.length; i++) {
        addEvent($clear[i], 'click', function (e) {
            getId(this.getAttribute('name')).value = '';
            this.style.display = 'none';
        });
    }
    // 更换验证码
    let $changeBtn = getId('verifycode-anotherimg');
    addEvent($changeBtn, 'click', function (e) {
        let captchaKey = getId('verifycode-wrapper').getAttribute('captchaKey');
        getVerifyCode(captchaKey);
    });
    // 提交
    let $submit = getId('submit');
    addEvent($submit, 'click', function (e) {
        opts.beforeSubmit();
        debounce(submit, {
            leading: true
        })(opts);
        opts.afterSubmit();
    });
};
function submit(opts) {
    let name = getId('username').value;
    if (!(name && name.trim().length)) {
        getId('error').innerText = '请填写用户名';
        return;
    }
    let pwd = getId('password').value;
    if (!(pwd && pwd.trim().length)) {
        getId('error').innerText = '请填写密码';
    }
    // encode处理
    pwd = encodeURIComponent(pwd);
    let timestamp = +new Date();
    let deviceIdType = 'webcode';
    let deviceId = getCookie('BAIDUID') || '-1';
    let salt = randomGenerator(25);
    let resolution = window.screen.width + 'x' + window.screen.height;
    // 加密
    let loginMsg = encrypt(`username=${name}&password=${pwd}&timestamp=${timestamp}&deviceId=${deviceId}&deviceIdType=${deviceIdType}&resolution=${resolution}&salt=${salt}`);
    // 是否自动登录
    let isRememberMe = getId('rememberme').checked;
    let param = {
        appKey: opts.appKey,
        loginMsg: loginMsg,
        loginFlag: true,
        isRememberMe: isRememberMe,
        countryCode: '86',
        clientIp: '127.0.0.1',
        clientVersion: window.navigator.userAgent,
        clientOs: window.navigator.userAgent,
        callback: 'parent.callback_',
        staticPage: conf.staticPage
    };
    // 验证码判断
    if (getId('verifycode-wrapper').style.display === 'block') {
        let verifyCode = getId('verifycode').value;
        if (!(verifyCode && verifyCode.trim().length)) {
            getId('error').innerText = '请填写验证码';
            return;
        }
        let vcodeKey = getId('verifycode-img').getAttribute('vcodeKey');
        param.verifyCode = verifyCode;
        param.vcodeKey = vcodeKey;
    }
    formPost({
        url: conf.action,
        origin: conf.origin,
        type: opts.type,
        data: param,
        success: function (data) {
            getId('error').innerText = '';
            opts.submitSuccess(data);
        },
        error: function (e) {
            getId('error').innerText = e.msg;
            if (e.captchaKey) {
                getId('verifycode-wrapper').setAttribute('captchaKey', e.captchaKey);
                getVerifyCode(e.captchaKey);
            }
        }
    });
}
function getVerifyCode(captchaKey) {
    getId('verifycode-wrapper').style.display = 'block';
    let verifyUrl = conf.verify;
    let verifyParam = {
        appKey: 'mOIxlDN0SGeFVEXVRBGy',
        captchaKey: captchaKey
    };
    jsonp({
        url: verifyUrl,
        data: verifyParam,
        cache: true,
        success: function (data) {
            if (data.code === '200') {
                getId('verifycode-img').src = data.imageUrl;
                getId('verifycode-img').setAttribute('vcodeKey', data.vcodeKey);
            }
        }
    });
};
function getId(selector) {
    return document.getElementById('eap-app-login-' + selector);
}
module.exports = bindEvent;