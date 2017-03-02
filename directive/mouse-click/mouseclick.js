!(function (angular) {
    /**
     * @doc directive
     * @name mouseClick
     *
     * @description
     *    鼠标点击指令。
     *    鼠标点击转化成点击事件。click=mousedown+mouseup。其中不发生鼠标移动mousemove事件。
     *    注意不要在自定义的操作函数中阻止事件传递，如 `event.stopPropagation()`.
     *    可以通过mouse-propagation=true 设置阻止事件传递。
     *
     * @element ANY
     * @priority 0
     * @param {expression} mouseClick 像ngClick一样。
     * @param {bool} mousePropagation 是否阻止事件传递，默认为false。
     *
     *
     * @example
     <example name="mouse-click">
     <file name="index.js">
     angular.module('app', ['mouseClick'])
     </file>
     <file name="index.html">
     <button mouse-click="count = count + 1" ng-init="count=0">
     Increment
     </button>
     <span>
     count: {{count}}
     </span>
     </file>
     <file name="protractor.js" type="protractor">
     it('should check mouse-click', function() {
         expect(element(by.binding('count')).getText()).toMatch('0');
         element(by.css('button')).click();
         expect(element(by.binding('count')).getText()).toMatch('1');
       });
     </file>
     </example>
     */
    angular.module('mouseClick', [])
        .directive("mouseClick", ['$parse', function ($parse) {
            return {
                restrict: 'A',
                compile: function mouseClickCompile($element, $attr) {
                    // console.log("mouseClickCompile");
                    // $parse表达式
                    var fn = $parse($attr["mouseClick"], /* interceptorFn */ null, /* expensiveChecks */ true);
                    // 是否阻止事件传递，默认为false。
                    var _isStopPropagation = $attr["mousePropagation"] && $attr["mousePropagation"]=== 'true';
                    // 返回连接函数
                    return function mouseClickLink($scope, $element, $attr) {
                        // console.log("mouseClickLink");
                        // 是否有鼠标移动事件存在
                        var _isMouseMoved = false;
                        $element.on("mousedown", function (event) {
                            if (_isStopPropagation)
                                event.stopPropagation();
                            _isMouseMoved = false;
                        });
                        $element.on("mousemove", function (event) {
                            if (_isStopPropagation)
                                event.stopPropagation();
                            _isMouseMoved = true;
                        });
                        $element.on("mouseup", function (event) {
                            if (_isStopPropagation)
                                event.stopPropagation();
                            // 如果有移动，则不是click事件
                            if (_isMouseMoved) return;

                            var callback = function () {
                                fn($scope, {$event: event});
                            };
                            $scope.$apply(callback);
                        });
                    };
                }
            }
        }]);
})(angular);
