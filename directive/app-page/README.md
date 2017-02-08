# app-page
  分页指令
  
 ![效果图](https://github.com/BPing/angular-lib/blob/master/directive/app-page/app-page.png?raw=true)
 
# 依赖
 * angularJs  v1
 * bootstrap  v3

# 指令说明

  app-page

  ## 配置参数

  * `page-conf` : 绑定在父级$scope的变量。以便父级$scope调用
  * `page-req-fn` : 绑定在父级$scope的操作函数名。只要是用来获取数据。page-req-fn="父级$scope函数名(c,p,f)"
  * `page-per-num`: 每一页的条数。默认15
  * `pagesLength` : 显示多少页数。超过部分用...代替。默认8
  * `page-max-per-num` : 一页最多显示条数。默认100
  * `page-total-num` : 总条数。默认0.会随着数据变动而变化的。

  ## 可用变量和方法

  绑定在`page-conf`指定的变量上，对象结构如下：

  ```javascript
  $scope.pageConf = {
                          watchTag: false,
                          curPage: 1,
                          perPageNum: 0,
                          maxPerPageNum: 0,
                          totalNum: 0,
                          totalPages: 0,
                          pagesLength: 0,
                          // 元素{id:1,tag:"1",cur:true}
                          pagesList: [],
                          // 请求数据
                          httpReq: function () {},
                          // 改变当前页数
                          onChangeCurPage: function (curPage) { },
                          // 改变每一页条数
                          onChangePerPageNum: function (perPageNum) {},
                          // 下一页
                          onNextPage: function () {  },
                          // 上一页
                          onPrevPage: function () {},
                          // 首页
                          onFirstPage: function () { },
                          // 尾页
                          onLastPage: function () {  },
                      };
  ```


 
