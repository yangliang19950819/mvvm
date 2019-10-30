//模板找节点
import {getValue} from "../util/ObjectUtil.js";

let tempalte2Vnode = new Map()
//节点找模板
let vnode2Template = new Map()

export function renderMixin(Due) {
    Due.prototype._render = function () {
        renderNode(this,this._vnode)
    }
}

export function renderData(vm,data) {
    let vnodes = tempalte2Vnode.get(data)
    if(vnodes){
        for(let i =0 ;i < vnodes.length;i++){
            renderNode(vm,vnodes[i])
        }
    }
}

function renderNode(vm,vnode) {
    if(vnode.nodeType == 3){
        let templates = vnode2Template.get(vnode)
        if(templates){
            let result = vnode.text;
            for(let i = 0; i < templates.length;i++){
                let templateValue = getTemplateValue([vm._data,vnode.env],templates[i])//参数可来至Due对象,父级节点
                if(templateValue){
                    result = result.replace("{{"+templates[i]+"}}",templateValue)
                }
            }
            vnode.elm.nodeValue = result
        }
    }else {
        for(let i = 0; i < vnode.children.length; i++){
            renderNode(vm,vnode.children[i])
        }
    }
}

function getTemplateValue(objs,templateName) {
    for(let i = 0;i < objs.length;i++){
        let temp = getValue(objs[i],templateName)
        if(temp){
            return temp
        }
    }
    return null
}

export function getTempalte2VnodeMap() {
    return tempalte2Vnode
}

export function getvnode2TemplateMap() {
    return vnode2Template
}

export  function prepareRender(vm,vnode) {//挂载时使用
    if(vnode == null){
        return
    }
    if(vnode.nodeType == 3){
        analysisTemplateString(vnode)
    }
    if(vnode.nodeType == 1){
        for(let i = 0; i < vnode.children.length; i++){
            prepareRender(vm,vnode.children[i])
        }
    }
}

function analysisTemplateString(vnode) {
    let templateStrList = vnode.text.match(/{{[a-zA-z0-9_.]+}}+/g)
    for(let i = 0;templateStrList && i < templateStrList.length; i++){
        setTemplate2Vnode(templateStrList[i],vnode)
        setVnode2Tempalte(templateStrList[i],vnode)
    }
}

function setTemplate2Vnode(template,vnode) {
    let templateName = getTemplateName(template);
    let vnodeSet = tempalte2Vnode.get(templateName);
    if(vnodeSet){
        vnodeSet.push(vnode)
    }else {
        tempalte2Vnode.set(templateName,[vnode])
    }
}

function setVnode2Tempalte(template,vnode) {
    let templateSet = vnode2Template.get(vnode);
    if(templateSet){
        templateSet.push(getTemplateName(template))
    }else {
        vnode2Template.set(vnode,[getTemplateName(template)])
    }
}

function getTemplateName(tempalte) {
    //是否有花括号
    if(tempalte.substring(0,2) == "{{" && tempalte.substring(tempalte.length - 2 ,tempalte.length == "}}")){
        return tempalte.substring(2,tempalte.length - 2)
    }else {
        return tempalte
    }

}