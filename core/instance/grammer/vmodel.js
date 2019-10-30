import {setValue} from "../../util/ObjectUtil.js";
//挂载时使用
export function vmodel(vm,elm,data) {
    elm.onchange = function (event) {
        setValue(vm._data,data,elm.value)
    }
}