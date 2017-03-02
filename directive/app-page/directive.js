!(function ($app) {
    // 应用分页指令
    $app.directive("appPage", function () {
        return {
            restrict: "EAC",
            replace: true,
            scope: {
                // 绑定在父级$scope的变量
                // page-conf="pf"
                pageConf: "=",
                // 绑定在父级$scope的操作函数名。
                // f(curPage, perPageNum, f)
                // page-req-fn="f(c,p,f)"
                pageReqFn: "&"
            },
            templateUrl:function($element, $attr) {
                      return  $attr.pageHtmlDir + "pagination.html";
                 },
            compile: function appPageCompile($element, $attr) {
                // console.dir($attr);
                // // 绑定在父级$scope的变量名。默认‘appPage’。
                // var pageVariableName = $attr.appPage === "" ? "appPage" : $attr.appPage;
                // // 绑定在父级$scope的操作函数名。
                // // f(page,pageNum,f(totalNum))
                // var pageReqFnName = $attr.pageReqFn;
                // 是否通知？如果不为空则 $scope.$broadcast(pageInitNotify, "init end");
                var pageInitNotify = $attr.pageInitNotify || "";
                // 每一页的条数。默认15
                var pagePerNum = $attr.pagePerNum || 15;
                // 显示多少页数。超过部分用...代替。默认8
                var pagesLength = $attr.pageLength || 8;
                // 一页最多显示条数。默认100
                var pageMaxPerNum = $attr.pageMaxPerNum || 100;
                // 总条数。默认0
                var pageTotalNum = $attr.pageTotalNum || 0;
                // 初始化是否发出数据请求。默认false
                var pageInit = $attr.pageInit && $attr.pageInit === 'true';
                // 如果为true传的总条数，否则传的是总页数 默认 true
                var isTotalNum = !$attr.pageIsNum || $attr.pageIsNum !== 'false';
                // 返回连接函数
                return function appPageLink($scope, $element, $attr, ctrl, $transclude) {
                    // console.dir($scope.pageConf);
                    // console.dir($scope.pageReqFn);
                    var pageReqFn = $scope.pageReqFn || function () {
                        };

                    var paginationConf = $scope.pageConf = {
                        isTotalNum: isTotalNum,
                        curPage: 1,
                        perPageNum: pagePerNum,
                        maxPerPageNum: pageMaxPerNum,
                        totalNum: pageTotalNum,
                        totalPages: pagePerNum === 0 ? 0 : Math.ceil(pageTotalNum / pagePerNum),
                        pagesLength: pagesLength,
                        // 元素{id:1,tag:"1",cur:true}
                        pagesList: [],
                        // 请求数据
                        httpReq: function () {
                            // 上下文环境
                            var ctx = this;
                            pageReqFn({
                                c: this.curPage,
                                p: this.perPageNum,
                                f: function (totalNumOrPage) {
                                    if (ctx.isTotalNum) {
                                        ctx.totalNum = totalNumOrPage;
                                        ctx.totalPages = Math.ceil(ctx.totalNum / ctx.perPageNum);
                                    } else {
                                        ctx.totalPages = totalNumOrPage;
                                    }
                                    // 页码计算，过长时候用'...'代替
                                    var start = 1, end = ctx.totalPages;
                                    ctx.pagesList = [];

                                    do {
                                        if (ctx.totalPages <= ctx.pagesLength) break;
                                        var prevC, suffixC = 0;
                                        if (ctx.curPage < Math.ceil(ctx.totalPages / 2)) {
                                            prevC = Math.ceil(ctx.pagesLength / 2) - 1;
                                            start = ctx.curPage - 1 <= prevC ? 1 : ctx.curPage - prevC;

                                            suffixC = ctx.pagesLength - (ctx.curPage - start + 1);
                                            end = ctx.totalPages - ctx.curPage <= suffixC ? ctx.totalPages : ctx.curPage + suffixC;
                                        } else {
                                            suffixC = Math.ceil(ctx.pagesLength / 2) - 1;
                                            end = ctx.totalPages - ctx.curPage <= suffixC ? ctx.totalPages : ctx.curPage + suffixC;

                                            prevC = ctx.pagesLength - (end - ctx.curPage + 1);
                                            start = ctx.curPage - 1 <= prevC ? 1 : ctx.curPage - prevC;
                                        }

                                    } while (false);

                                    if (start !== 1) {
                                        ctx.pagesList.push({id: -1, tag: "...", cur: false})
                                    }
                                    for (var index = start; index <= end; index++) {
                                        ctx.pagesList.push({id: index, tag: index + "", cur: index === ctx.curPage})
                                    }
                                    if (end !== ctx.totalPages) {
                                        ctx.pagesList.push({id: -1, tag: "...", cur: false})
                                    }
                                    // 如果没有数据，则默认为一页
                                    if (ctx.pagesList.length == 0) {
                                        ctx.pagesList.push({id: 1, tag: "1" + "", cur: true})
                                    }
                                }
                            });
                        },
                        // 改变当前页数
                        onChangeCurPage: function (curPage) {
                            // console.dir("onChangeCurPage");
                            // 允许首页加载
                            if (curPage !== 1 && (curPage <= 0 || curPage > this.totalPages)) {
                                return;
                            }
                            this.curPage = curPage;
                            this.httpReq();
                        },
                        // 改变每一页条数
                        onChangePerPageNum: function (perPageNum) {
                            if (perPageNum <= 0 || perPageNum > this.maxPerPageNum) {
                                return
                            }
                            this.perPageNum = perPageNum;
                            this.httpReq();
                        },
                        // 下一页
                        onNextPage: function () {
                            this.onChangeCurPage(this.curPage + 1);
                        },
                        // 上一页
                        onPrevPage: function () {
                            this.onChangeCurPage(this.curPage - 1);
                        },
                        // 首页
                        onFirstPage: function () {
                            // console.log('%conFirstPage','color:#fff;background:red');
                            this.onChangeCurPage(1);
                        },
                        // 尾页
                        onLastPage: function () {
                            this.onChangeCurPage(this.totalPages);
                        },
                    };
                    // 请求数据
                    if (pageInit) {
                        paginationConf.httpReq();
                    }

                    // 广播初始完成通知
                    if (pageInitNotify !== "") {
                        // console.log('%c' + pageInitNotify, 'color:#fff;background:red');
                        // console.dir($scope.pageConf);
                        $rootScope.$broadcast(pageInitNotify, "init end");
                    }
                };
            }
        }
    });
})(myApp);

