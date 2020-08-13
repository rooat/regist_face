import Link from 'next/link';
import { Component } from 'react';
import axios from 'axios';
import { sha256 } from 'js-sha256';
import MD5 from 'md5.js';
import Modal from '../components/Modal'


class Index extends Component{
    state=({
        isvisiable:false,
        phone:"",
        password:"",
        phoneCode:"",
        inviteCode:"",
        tips_false:"❌",
        tips_true:"✅",
        phone_status:false,
        pwd_status:false,
        isSendCode:false,
        countCodeTime:120,
        isOpenMsg:false,
        msgKind:2,
        msgContent:"",
        baseUrl:"https://dgfhtry8fil8e8bas.cbasechain.org",
        codeIsDisable:false

    })
    componentDidMount(){
        let url = window.location.href;        
        if(url.split("?").length>0 && url.split("?")[1]){
            let params = url.split("?")[1];
            params = params.split('=')
            if(params.length>1 && params[0]=='uid'){
                let uid = params[1];
                this.setState({
                    inviteCode:uid
                })
            }
        }
        this.isWeiXin();
    }
    isWeiXin(){
        if(navigator.userAgent.toLowerCase().indexOf("micromessenger") !== -1){
            this.setState({
                isvisiable:true,
                
            })
        }else{
            this.setState({
                isvisiable:false
            })
        }
    }

    registAccount= async ()=>{
        if(this.state.phoneCode && this.state.inviteCode && this.invalidPhone(this.state.phone) && this.state.password.length>10){
            axios.post(this.state.baseUrl+'/filebase/account/registerByPhone',{
                Password:this.state.password,
                InviteCode:this.state.inviteCode,
                MobilePhone:this.state.phone,
                VerifyCode:this.state.phoneCode,
                OSType:'2',
                HTCDesire:'H5'
            }).then((regist_res)=>{
                console.log("regist-res:",regist_res)
                if(regist_res.data.code ==0){
                    console.log("注册成功")
                    this.setState({
                        isOpenMsg:true,
                        msgContent:"注册成功",
                        msgKind:1
                    })
                }else{
                    this.setState({
                        isOpenMsg:true,
                        msgContent:"注册失败",
                        msgKind:2
                    })
                }
            }).catch((err)=>{
                this.setState({
                    isOpenMsg:true,
                    msgContent:"注册失败",
                    msgKind:2
                })
            })
        }else{
            this.setState({
                isOpenMsg:true,
                msgContent:"请输入注册信息",
                msgKind:0
            })
        }
        

    }
    getPhoneCode= async ()=>{
        
        if(this.state.codeIsDisable){
            return;
        }
        if (this.state.phone && this.invalidPhone(this.state.phone)) {
            this.setState({
                codeIsDisable:true
            })
            axios.post(this.state.baseUrl+'/filebase/account/getSMSCodeByReg',{
                AreaCode:'86',
                MobilePhone:this.state.phone
            }).then((codeRes)=>{
                this.setState({
                    msgContent:'验证码已发送，请查收',
                    isOpenMsg:true,
                    msgKind:1
                })
                if(codeRes.data && codeRes.data.code ==0){
                    console.log("验证码发送成功")
                    let time = 119
                    let timeInterval = setInterval(()=>{
                        time--
                        this.setState({
                            countCodeTime:time
                        })
                        if(time==0){
                            clearInterval(timeInterval)
                            this.setState({
                                isSendCode:false,
                                countCodeTime:120,
                                codeIsDisable:false
                            })
                        }
                    },1000)
                    this.setState({
                        isSendCode:true
                    })
                }
            }).catch((error)=>{
                console.log("error--",error)
                this.setState({
                    msgContent:'验证码发送失败',
                    isOpenMsg:true,
                    msgKind:2,
                    codeIsDisable:false
                })
            })
        }else{
            this.setState({
                isOpenMsg:true,
                msgContent:"请输入正确的手机号"
            })
        }
    }
    invalidPhone(phone){
        let regex_phone = /^((\+)?86|((\+)?86)?)0?1[3458]\d{9}$/;
        return regex_phone.test(phone)
    }
    invalidPwd(pwd){
        let regex_pwd = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{6,8}$/;
        return regex_pwd.test(pwd)
    }

    onChangePhone(e){
        if (this.invalidPhone(e.target.value)) {
            this.setState({
                phone:e.target.value,
                phone_status:true
            })
        }else{
            this.setState({
                phone_status:false
            })
        }
        
    }
    onChangePhoneCode(e){
        this.setState({
            phoneCode:e.target.value
        })
    }
    onChangePwd(e){
        if(this.invalidPwd(e.target.value)){            
            this.setState({
                password:new MD5().update(sha256(e.target.value)).digest('hex'),
                pwd_status:true
            })
        }else{
            this.setState({
                pwd_status:false
            })
        }
    }
    setStateModal=(e)=>{
        this.setState({
            isOpenMsg:e
        })
    }
    render(){
        return (
            <div className="relative  text-center">
                <div>
                    <img src="../static/img/banner.png"/>
                </div>
                <div className="flex bg-yellow-50 widthclass border-2 border-orange-200 mb-5 mt-10 h-12 items-center" >
                    <div className="w-1/3 text-left ml-4">
                        手机号码
                    </div>
                    <div className="w-1/3 ">
                        <input onChange={(e)=>this.onChangePhone(e)}  className="bg-opacity-0 h-12" type="number" placeholder="请输入手机号"/>
                    </div>
                    <div className="w-1/4 text-right">
                        {this.state.phone_status?this.state.tips_true:this.state.tips_false}
                    </div>
                </div>
                <div className="flex bg-yellow-50 widthclass border-2 border-orange-200 mt-5 h-12 items-center" >
                    <div className="w-1/3  text-left ml-4">
                        短信验证
                    </div>
                    <div className="w-1/3">
                        <input type="text" onChange={(e)=>this.onChangePhoneCode(e)} placeholder="请输入验证码"/>
                    </div>
                    <div  onClick={this.getPhoneCode} className="text-sm w-1/3 bg-yellow-200 rounded-md p-1 mr-1">
                        {this.state.isSendCode?'( '+this.state.countCodeTime+'s )':'获取验证码'}
                    </div>
                </div>
                <div className="flex bg-yellow-50 widthclass border-2 border-orange-200 mt-5 h-12 items-center" >
                    <div className="w-1/3 text-left ml-4">
                        登陆密码
                    </div>
                    <div className="w-1/3">
                        <input onChange={(e)=>this.onChangePwd(e)} type="password" placeholder="6-8位大小写字母、数字"/>
                    </div>
                    <div className="w-1/4 text-right">
                    {this.state.pwd_status?this.state.tips_true:this.state.tips_false}
                    </div>
                </div>
                <div className="flex bg-yellow-50 widthclass border-2 border-orange-200 mt-5 mb-8 h-12 items-center" >
                    <div className="w-1/3  text-left ml-4">
                        推荐码
                    </div>
                    <div className="w-2/3 text-left">
                        {this.state.inviteCode}
                    </div>
                </div>
                <div className="flex widthclass bg-orange-400 h-12 items-center">
                    <div className="flex-1 textColor text-xl" onClick={this.registAccount}>
                        立即注册
                    </div>
                </div>
                <div className="text-right widthclass mt-3">
                    已有注册账号，<a className="text-orange-400" href="#">立即下载</a>
                </div>
                <Modal setStateModal={this.setStateModal} msgKind={this.state.msgKind} isOpenMsg={this.state.isOpenMsg} msgContent={this.state.msgContent} />
                
                {this.state.isOpenMsg?(
                <div className="fixed z-5 top-0 bg-gray-400 w-full h-full opacity-50"></div>):""}
            </div>
            
        )
    }
}

export default Index