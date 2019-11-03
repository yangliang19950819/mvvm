import {getValue} from "../../util/ObjectUtil.js";

export function checkVOn(vm,vnode) {
    if(vnode.nodeType != 1){
        return
    }
    let attrNames = vnode.elm.getAttributeNames();
    for(let i = 0; i < attrNames.length;i++){
        if(attrNames[i].indexOf("v-on") || attrNames[i].indexOf("@")){
            von(vm,vnode,attrNames[i].split(":")[1],vnode.elm.getAttribute(attrNames[i]))
        }
    }
}

function von(vm,vnode,event,name) {
    let method = getValue(vm._methods,name)
    if(method){
        vnode.elm.addEventListener(event,proxyEvcute(vm,method))
    }
}

function proxyEvcute(vm,method) {
    return function () {
        method.call(vm)
    }
}