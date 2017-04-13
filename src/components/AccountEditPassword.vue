<template>
    <div class="oreder_oredercenter"><!-- 修改密码 -->
        <div class="account_mb_titile">修改登录密码</div>
        <div class="account_mb_content" v-if="successful">
            <div class="acc_Password">
                <table>
                    <tbody>
                        <tr>
                            <td><img src="../../static/css/images/gg.png"></td>
                            <td><strong style="font-size: 14px;">修改登录密码成功！</strong></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="account_mb_content" v-else>
            <p class="color4 account_aq1" style="padding-left: 60px;">建议使用字母加数字组合、混合大小写、特殊字符（如@）等提高密码强度。</p>
            <div class="acc_Password">
                <table>
                    <tbody>
                        <tr :class="{error: !!validators.oldPassword, success: validators.oldPassword === false}">
                            <td>原始密码：</td>
                            <td><input type="password" v-model="oldPassword" class="input4_Password"></td>
                            <td class="validate" v-if="validators.oldPassword">{{ validators.oldPassword }}</td>
                        </tr>
                        <tr :class="{error: !!validators.password, success: validators.password === false}">
                            <td>新密码：</td>
                            <td><input type="password" v-model="password" class="input4_Password"></td>
                            <td class="validate" v-if="validators.password">{{ validators.password }}</td>
                        </tr>
                        <tr :class="{error: !!validators.confirmedPassword, success: validators.confirmedPassword === false}">
                            <td>再次输入新密码：</td>
                            <td><input type="password" v-model="confirmedPassword" class="input4_Password"></td>
                            <td class="validate" v-if="validators.confirmedPassword">{{ validators.confirmedPassword }}</td>
                        </tr>
                        <tr>
                            <td></td>
                            <td><a class="keep_CashNum" @click="doChangePassword">保存</a></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
    import * as ajax from '../api';

    export default {
        name: 'ComAccountEditPassword',
        data(){
            return {
                oldPassword: '',
                password: '',
                confirmedPassword: '',

                successful: false,

                validators: {
                    oldPassword: '',
                    password: '',
                    confirmedPassword: ''
                }
            };
        },
        watch: {
            oldPassword(val){
                this.validateOldPassword(val);
            },
            password(val){
                this.validatePassword(val);
            },
            confirmedPassword(val){
                this.validateConfirmedPassword(val);
            },
            '$route'(to, from){
                this.successful = false;
            }
        },
        methods: {
            // mutations

            // actions

            // methods
            doChangePassword(){
                if(!this.validate()) return;

                return ajax.apiChangePassword({
                    oldPassword: this.oldPassword,
                    password: this.password
                }).then(json => {
                    if(json.S === 768){
                        // 密码修改成功
                        this.successful = true;
                    }else{
                        this.$alert({
                            type: "error",
                            title: "错误",
                            content: json.S + ': ' + json.D
                        });
                    }
                });
            },

            // validators
            validate(){
                let flag = true;
                if(!this.validateOldPassword(this.oldPassword)) flag = false;
                if(!this.validatePassword(this.password)) flag = false;
                if(!this.validateConfirmedPassword(this.confirmedPassword)) flag = false;

                return flag;
            },
            validateOldPassword(val){
                if(val === ''){
                    this.validators.oldPassword = '原始密码不能为空！';
                    return false;
                }else if(/[\s\t\n\r]+/g.test(val)){
                    this.validators.oldPassword = '原始密码不能包含空格！';
                    return false;
                }else if(val.length > 20 || val.length < 6){
                    this.validators.oldPassword = '原始密码长度只能是6-20个字符！';
                    return false;
                }

                this.validators.oldPassword = false;
                return true;
            },
            validatePassword(val){
                if(val === ''){
                    this.validators.password = '新密码不能为空！';
                    return false;
                }else if(/[\s\t\n\r]+/g.test(val)){
                    this.validators.password = '新密码不能包含空格！';
                    return false;
                }else if(val.length > 20 || val.length < 6){
                    this.validators.password = '新密码长度只能是6-20个字符！';
                    return false;
                }

                this.validators.password = false;
                return true;
            },
            validateConfirmedPassword(val){
                if(val === ''){
                    this.validators.confirmedPassword = '确认密码不能为空！';
                    return false;
                }else if(val !== this.password){
                    this.validators.confirmedPassword = '确认密码与新密码不一致！';
                    return false;
                }

                this.validators.confirmedPassword = false;
                return true;
            },
        }
    };
</script>
