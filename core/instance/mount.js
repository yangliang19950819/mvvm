import VNode from "../vdom/vnode.js";
import {prepareRender,getTempalte2VnodeMap,getvnode2TemplateMap} from "./render.js";
import {vmodel} from "./grammer/vmodel.js";

export function initMount(Due) {
    Due.prototype.$mount = function (el) {
        let vm = this;
        let rootDom = document.getElementById(el)
        mount(this,rootDom)
    }
}
export function mount(vm,elm) {
    //挂载
    vm._vnode = constructVNode(vm,elm,null)
    //进行预备渲染(建立渲染索引，通过模板找vnode,通过vnode找模板)
    prepareRender(vm,vm._vnode)
    // console.log(getTempalte2VnodeMap(),getvnode2TemplateMap())
}

function analysisAttr(vm,elm,parent) {
    if(elm.nodeType == 1){
        let attrNames = elm.getAttributeNames()
        if(attrNames.indexOf("v-model") > -1){
            vmodel(vm,elm,elm.getAttribute("v-model"))
        }
    }
}

function constructVNode(vm,elm,parent) {//深度优先搜索
    analysisAttr(vm,elm,parent)
    let vnode = null;
    let children = [];
    let text = getNodeText(elm);
    let data = null;
    let nodeType = elm.nodeType;
    let tag = elm.nodeName;
    vnode = new VNode(tag,elm,children,text,data,parent,nodeType);
    let childs = vnode.elm.childNodes;
    for(let i = 0;i < childs.length;i ++){
        let childNodes = constructVNode(vm,childs[i],vnode);
        if(childNodes instanceof VNode){
            vnode.children.push(childNodes)
        }else {
           vnode.children = vnode.children.concat(childNodes)
        }
    }
    return vnode
}

function getNodeText(elm) {
    if(elm.nodeType == 3){
        return elm.nodeValue
    }else {
        return ""
    }
}

