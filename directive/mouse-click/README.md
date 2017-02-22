# mouse-click
  
      鼠标点击转化成点击事件指令。
          鼠标点击转化成点击事件。`click=mousedown+mouseup`。其中不发生鼠标移动`mousemove`事件。
     
      
> *注意:* 不要在自定义的操作函数中阻止事件传递，如 `event.stopPropagation()`. 可以通过mouse-propagation=true 设置阻止事件传递。      
  
# 快速开始

```javascript
   angular.module('app', ['mouseClick']);
```

```html
 <button mouse-click="count = count + 1" ng-init="count=0">
 Increment
 </button>
 <span>
 count: {{count}}
 </span>
```
 
# 依赖
 * angularJs  v1.x

# 指令说明


## 配置参数

  * `mouse-click` : 像ngClick一样。
  * `mouse-propagation`: 是否阻止事件传递，默认为false。



 
