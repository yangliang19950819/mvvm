export default class VNode {
    constructor(tag,//标签类型
                elm,//真是节点
                children,//子节点
                text,//虚拟节点文本
                data,//VNodeData
                parent,//父级节点
                nodeType//节点类型
    ){
        this.tag = tag;
        this.elm = elm;
        this.children = children;
        this.text = text;
        this.data = data;
        this.parent = parent;
        this.nodeType = nodeType;
        this.env = {}; // 环境变量
        this.instructions = null;//存放指令的
        this.template = [];//当前节点涉及到的模板
    }
}