/**
 * 在Vue3中改变全局Vue行为的API被移动到了由新的createApp方法所创建的应用实例上
 * 他们的影响仅限于该特定的应用实例
 * 调用createApp返回一个应用实例，该实例提供了一个应用上下文
 * 应用实例挂载的整个组件树共享相同的上下文
 * 由于createApp方法返回应用实例本身，因此可以在其后链式调用其他方法
 */
import { createApp } from 'vue'
import Loading from './loading.vue'
import { addClass, removeClass } from '@/assets/js/dom.js'

// g-relative在scss/base.scss中已经定义
const relativeCls = 'g-relative'
/**
 * 自定义指令的钩子函数：
 *  created：在绑定元素的attribute(属性)或事件监听器被应用之前调用，在指令需要附加在普通的v-on事件监听器前调用的事件监听时很有用
 *  beforeMount：当指令第一次绑定到元素并且挂载父组件之前调用
 *  mounted：在绑定元素的父组件被挂载后调用
 *  beforeUpdate：在更新包含组件的VNode之前调用
 *  updated：在包含组件的VNode及其子组件的VNode更新后调用
 *  beforeUnmount：在卸载绑定元素的父组件之前调用
 *  unmounted：当指令与元素解除绑定且父组件已卸载时，只调用一次
 *  ---------------------------------------------------------------
 *  注：VNode => 作为el参数收到的真实DOM元素的蓝图
 *     preVNode => 上一个虚拟节点，仅在beforeUpdate和updated钩子中可用
 */
const loadingDirective = {
  /**
   * 钩子函数参数：
   *  el：指令所绑定的元素，可以用来直接操作DOM
   *  binding：一个对象，包含以下property(特性)
   *    instance：使用指令的组件实例
   *    value：指令的绑定值
   *    oldValue：先前的绑定值，仅在beforeUpdate和updated钩子中可用。无论值是否改变都可用
   *    arg：参数传递给指令
   *    modifiers：包含修饰符的对象
   *    dir：一个对象，在注册指令时作为参数传递
   *  ---------------------------------------------------------------
   *  注：除了el之外应该将这些参数视为只读，并且永远不要修改他们
   */

  // 在绑定元素的父组件被挂载后
  mounted(el, binding) {
    // 检索Loading组件，始终返回构造函数
    const app = createApp(Loading)
    // createApp接收根组件对象作为参数，并返回了一个有mount方法的应用实例对象
    // 创建一个div盒子 createApp链式调用mount
    const instance = app.mount(document.createElement('div'))
    // 挂载动态创建的实例到el上
    el.instance = instance
    // 动态参数
    const title = binding.arg
    if (typeof title !== 'undefined') {
      // 实例中有setTitle 可以自定义title
      instance.setTitle(title)
    }
    // 如果指令绑定的值为true调用append
    if (binding.value) {
      append(el)
    }
  },

  // 在包含组件的VNode及其子组件的VNode更新后调用
  updated(el, binding) {
    // 动态参数
    const title = binding.arg
    if (typeof title !== 'undefined') {
      // 实例中有setTitle 可以自定义title
      el.instance.setTitle(title)
    }
    // 指令现在的值 !== 指令之前的值
    if (binding.value !== binding.oldValue) {
      // 判断指令当前是否有值
      binding.value ? append(el) : remove(el)
    }
  }
}

function append(el) {
  // 获取el的样式属性
  const style = getComputedStyle(el)
  // 判断el的样式中是否有该定位，没有则进行样式的添加
  if (['absolute', 'fixed', 'relative'].indexOf(style.position) === -1) {
    // addClass：向被选元素添加一个或多个类
    addClass(el, relativeCls)
  }
  // appendChild：向节点添加最后一个字节点
  el.appendChild(el.instance.$el)
}

function remove(el) {
  removeClass(el, relativeCls)
  // removeChild：从子节点列表中删除某个节点，删除成功返回被删除的节点 失败则返回null
  el.removeChild(el.instance.$el)
}

export default loadingDirective
