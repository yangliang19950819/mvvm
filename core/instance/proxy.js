import {renderData} from "./render.js";
import {rebuild} from "./mount.js"
import {getValue} from "../util/ObjectUtil.js";
const arrayProto = Array.prototype
function defArrayFunc(obj,func,nameSpace,vm) {
    Object.defineProperty(obj,func,{
        enumerable:true,
        configurable:true,
        value:function (...args) {
            let originl = arrayProto[func]
            const result = originl.apply(this,args)
            rebuild(vm,getNameSpace(nameSpace,""))
            renderData(vm,getNameSpace(nameSpace,""))
            return result
        }
    })
}
function proxyArr(vm,arr,nameSpace) {
    let obj = {
        eleType:Array,
        toString:function () {
            let result = ""
            for(let i =0 ;i <arr.length ;i++){
                result += arr[i] + ", "
            }
            return result.substring(0,result.length - 2)
        },
        push(){},
        pop(){},
        shift(){},
        unshift(){}
    }
    defArrayFunc.call(vm,obj,"push",nameSpace,vm)
    defArrayFunc.call(vm,obj,"pop",nameSpace,vm)
    defArrayFunc.call(vm,obj,"shift",nameSpace,vm)
    defArrayFunc.call(vm,obj,"unshift",nameSpace,vm)
    arr.__proto__ = obj;
    return arr

}

function constructObjectProxy(vm,obj,nameSpace) {
    let proxyObj = {}
    for(let prop in obj){
        Object.defineProperty(proxyObj,prop,{
            configurable:true,
            get:function () {
                return obj[prop]
            },
            set:function (value) {
                obj[prop] = value
                renderData(vm,getNameSpace(nameSpace,prop))
            }
        })
        Object.defineProperty(vm,prop,{
            configurable:true,
            get:function () {
                return obj[prop]
            },
            set:function (value) {
                obj[prop] = value
                let val = getValue(vm._data,getNameSpace(nameSpace,prop))
                if(val instanceof Array){
                    rebuild(vm,getNameSpace(nameSpace,prop))
                    renderData(vm,getNameSpace(nameSpace,prop))
                }else {
                    renderData(vm,getNameSpace(nameSpace,prop))
                }
            }
        })
        if(obj[prop] instanceof Object){
            proxyObj[prop] = constructproxy(vm,obj[prop],getNameSpace(nameSpace,prop))
        }
    }
    return proxyObj
}

export function constructproxy(vm,obj,nameSpace) {
    //vm表示Due对象，obj表示要进行代理的对象，nameSpace
    let proxyObj = null
    if(obj instanceof Array){
        proxyObj = new Array(obj.length)
        for(let i = 0; i < obj.length; i++){
            proxyObj[i] = constructproxy(vm,obj[i],nameSpace)
        }
        proxyObj = proxyArr(vm,obj,nameSpace)
    }else if(obj instanceof Object){
        proxyObj = constructObjectProxy(vm,obj,nameSpace)
    }else {
        throw new Error("error")
    }
    return proxyObj
}

function getNameSpace(nowNameSpace,nowProp) {
    if(nowNameSpace == null || nowNameSpace == ""){
        return nowProp
    }else if(nowProp == null || nowProp == ""){
        return nowNameSpace
    }else {
        return nowNameSpace + "." + nowProp
    }
}