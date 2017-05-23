        function formData() {

            var datas = new Array();
            //存储就绪队列
            var queue1Arrary = new Array();
            var queue2Arrary = new Array();
            var queue3Arrary = new Array();
            //分别为三个队列的初始化数组
            var queue3Arrary2 = new Array();

            var queueResult = new Array();
            //统计结果数组
            var randomNumber = 1;
            //随机数记录标志
            var queue_1_page = 2;
            var queue_2_page = 4;
            var queue_3_page = 8;
            //默认的队列时间片大小
            var total = 0; //一共的执行次数
            var totalCurrent = 0; //当前执行的次数
            var timeSpeed = 500; //运行速度设置


            return {
                totalCurrent,
                number: function() {
                    return randomNumber++;
                },
                queue_1: function() {
                    return queue_1_page;
                },

                queue_2: function() {
                    return queue_2_page;
                },
                queue_3: function() {
                    return queue_3_page;
                },
                //返回时间片的值
                setQueue_1: function(data) {
                    queue_1_page = data;
                },
                setQueue_2: function(data) {
                    queue_2_page = data;
                },
                setQueue_3: function(data) {
                    queue_3_page = data;
                },
                //分别设置三个队列的时间片大小
                list: function() {
                    return datas;
                },
                //返回就绪队列
                add: function(data) {
                    datas.push(data);
                },
                //添加就绪队列
                queueAdd: function(data) {
                    queue1Arrary.push(data);

                },
                queueList: function() {
                    return queue1Arrary;
                },

                queue2Add: function(data) {
                    queue2Arrary.push(data);

                },
                queue2List: function() {
                    return queue2Arrary;
                },
                queue3Add: function(data) {
                    queue3Arrary.push(data);

                },
                queue3List: function() {
                    return queue3Arrary;
                },
                queue3_1Add: function(data) {
                    queue3Arrary2.push(data);

                },
                queue3_1List: function() {
                    return queue3Arrary2;
                },
                //各个队列的返回值和添加功能
                time: function() {
                    return timeSpeed;
                },
                timeSet: function(data) {
                    timeSpeed = data;
                },
                totalTime: function(data) {
                    total = data;
                },
                times: function() {
                    return total;
                },
                resultAdd: function(data) {
                    queueResult.push(data);
                },
                outResult: function() {
                    return queueResult;
                }


            };
        }
        //该服务包含所有用到的的公共数据部分，可为所用控制器共享

        angular.module('osApp', [])

        .service('formData', [formData])
            .controller('MainCtrl', ['$scope', 'formData', '$interval', function($scope, formData, $interval) {

                var self = this;
                self.number = 0;
                // var formData = new Array();
                // var formDataQueue1 = new Array();
                // var formDataQueue2 = new Array();
                // var formDataCopy = new Array();
                // var randomNumber = 0;
                self.queue_1 = 2;
                self.queue_2 = 4;
                self.queue_3 = 8;
                self.id = 1;

                self.submit = function() {
                    for (var i in formData.list()) {

                        if (self.processName == formData.list()[i].processName) {
                            return (alert("进程名重复，请重新命名！"));

                        }
                    }
                    //如果进程名重复则报错

                    formData.add({
                        processName: self.processName,
                        enterTime: self.enterTime,
                        serverTime: self.serverTime,
                        remainTime: self.serverTime
                    });
                    //输入正常则添加进程

                    self.list = formData.list();
                    self.processName = null;
                    self.enterTime = null;
                    self.serverTime = null;
                    //输入表单清零
                    self.number = formData.list().length;
                };
                //进程添加函数

                self.create = function() {
                    self.processName = 'random' + formData.number();
                    self.enterTime = 0;
                    self.serverTime = Math.floor(Math.random() * 30) + 1;
                };
                //进程随机生成函数

                self.createQueue = function() {
                        self.queue_1 = Math.floor(Math.random() * 10);
                        self.queue_2 = self.queue_1 + 2;
                        self.queue_3 = self.queue_2 + 4;
                    }
                    //随机生成时间片

                self.submitQueue = function() {
                    formData.setQueue_1(self.queue_1);

                    formData.setQueue_2(self.queue_2);
                    formData.setQueue_3(self.queue_3);

                }

                self.setFlag_1 = function() {
                        formData.timeSet(1000);
                    }
                    //正常速度

                self.setFlag_2 = function() {
                        formData.timeSet(500);
                    }
                    //倍速
                self.setFlag_3 = function() {
                        formData.timeSet(10);
                    }
                    //极速


            }])

        .controller('childCtrl', ['$scope', 'formData', '$interval', function($scope, formData, $interval) {
            var self = this;
            self.percentNumber = 0 + '%';
            self.queue_1 = formData.queue_1();
            self.queue_2 = formData.queue_2();
            self.queue_3 = formData.queue_3();

            function loop_1() {
                queue3_j = 0;
                queue3_i = formData.queue3List().length - 1;
                queue3Length = formData.queue3List().length;
                $interval(function() {
                    if (queue3_i >= 0) {
                        self.queue3Arrary1[queue3_i].remainTime -= 1;
                        queue3_j++;
                    }
                    //如果队列中数组不为空，则服务时间减1，标志数组加1
                    if (self.queue3Arrary1[queue3_i].remainTime <= 0) {

                        formData.resultAdd({
                            processName: self.queue3Arrary1[queue3_i].processName,
                            serverTime: self.queue3Arrary1[queue3_i].serverTime,
                            delayTime: formData.totalCurrent,
                            averageDelayTime: formData.totalCurrent / self.queue3Arrary1[queue3_i].serverTime
                        });
                        self.result = formData.outResult();
                        self.queue3Arrary1.pop();

                        queue3_i--;
                        queue3_j = 0;
                    }
                    //如果服务时间小于等于0，则直接退出队列
                    if (queue3_j == formData.queue_3()) {
                        formData.queue3_1Add(self.queue3Arrary1[queue3_i]);
                        self.queue3Arrary1.pop();

                        queue3_i--;
                        queue3_j = 0;

                    }
                    if ((self.queue3Arrary1.length == 0) && (formData.queue3_1List().length != 0)) {
                        loop();
                    }
                    formData.totalCurrent++;
                    $scope.percent = { width: (formData.totalCurrent / formData.times()) * 100 + '%' }
                    self.percentNumber = (formData.totalCurrent / formData.times()) * 100 + '%';

                }, formData.time(), formData.queue_3() * queue3Length);
            }

            function loop() {
                queue3_j = 0;
                queue3_i = formData.queue3_1List().length - 1;
                queue3Length = formData.queue3_1List().length;
                $interval(function() {
                    if (queue3_i >= 0) {
                        self.queue3Arrary2[queue3_i].remainTime -= 1;
                        queue3_j++;
                    }
                    //如果队列中数组不为空，则服务时间减1，标志数组加1
                    if (self.queue3Arrary2[queue3_i].remainTime <= 0) {
                        formData.resultAdd({
                            processName: self.queue3Arrary2[queue3_i].processName,
                            serverTime: self.queue3Arrary2[queue3_i].serverTime,
                            delayTime: formData.totalCurrent,
                            averageDelayTime: formData.totalCurrent / self.queue3Arrary2[queue3_i].serverTime
                        });
                        self.result = formData.outResult();
                        self.queue3Arrary2.pop();

                        queue3_i--;
                        queue3_j = 0;
                    }
                    //如果服务时间小于等于0，则直接退出队列
                    if (queue3_j == formData.queue_3()) {
                        formData.queue3Add(self.queue3Arrary2[queue3_i]);
                        self.queue3Arrary2.pop();
                        // console.log(formData.queue3List()[queue3_i]);
                        // self.queue3Arrary1.length = [];
                        queue3_i--;
                        queue3_j = 0;

                    }
                    if ((self.queue3Arrary2.length == 0) && (formData.queue3List().length != 0)) {
                        loop_1();
                    }
                    formData.totalCurrent++;
                    $scope.percent = { width: (formData.totalCurrent / formData.times()) * 100 + '%' }
                    self.percentNumber = (formData.totalCurrent / formData.times()) * 100 + '%';
                }, formData.time(), formData.queue_3() * queue3Length);
            }


            self.queueRun = function() {
                self.queue_1 = formData.queue_1();
                self.queue_2 = formData.queue_2();
                self.queue_3 = formData.queue_3();
                var total = 0;
                for (var i in formData.list()) {
                    formData.queueAdd(formData.list()[i]);

                    total += formData.list()[i].serverTime;
                }
                formData.totalTime(total);

                self.queue1Arrary1 = formData.queueList();
                self.queue2Arrary1 = formData.queue2List();
                self.queue3Arrary1 = formData.queue3List();
                // 
                var queue1Length = formData.queueList().length;
                var queue2Length = 0;
                var queue3Length = 0;
                //分别获取第一第二和第三队列数组的长度

                var queue1_i = formData.queueList().length - 1;
                var queue2_i = 0;
                var queue3_i = 0;
                //分别获取第一第二和第三队列数组的长度，泳衣遍历数组

                var queue1_j = 0;
                var queue2_j = 0;
                var queue3_j = 0;
                //时间片记录标志
                console.log(formData.queue_1());
                $interval(function() {

                    if (queue1_i >= 0) {
                        self.queue1Arrary1[queue1_i].remainTime -= 1;
                        queue1_j++;
                    }
                    //如果队列中数组不为空，则服务时间减1，标志数组加1
                    if (self.queue1Arrary1[queue1_i].remainTime <= 0) {
                        formData.resultAdd({
                            processName: self.queue1Arrary1[queue1_i].processName,
                            serverTime: self.queue1Arrary1[queue1_i].serverTime,
                            delayTime: formData.totalCurrent,
                            averageDelayTime: formData.totalCurrent / self.queue1Arrary1[queue1_i].serverTime
                        });
                        self.result = formData.outResult();

                        self.queue1Arrary1.pop();
                        queue1_i--;
                        queue1_j = 0;
                    }
                    //如果服务时间小于等于0，则直接退出队列
                    if (queue1_j == formData.queue_1()) {
                        formData.queue2Add(self.queue1Arrary1[queue1_i]);
                        self.queue1Arrary1.pop();
                        queue1_i--;
                        queue1_j = 0;
                    }
                    //如果时间片执行完毕，则该进程退出队列，并加入下一队列
                    if (self.queue1Arrary1.length == 0) {
                        self.queue2Arrary1 = formData.queue2List();
                        //更新第二队列数组长度
                        queue2Length = formData.queue2List().length;
                        queue2_i = formData.queue2List().length - 1;
                        queue2_j = 0;
                        $interval(function() {

                            if (queue2_i >= 0) {
                                self.queue2Arrary1[queue2_i].remainTime -= 1;
                                queue2_j++;

                            }
                            //如果队列中数组不为空，则服务时间减1，标志数组加1
                            if (self.queue2Arrary1[queue2_i].remainTime <= 0) {
                                formData.resultAdd({
                                    processName: self.queue2Arrary1[queue2_i].processName,
                                    serverTime: self.queue2Arrary1[queue2_i].serverTime,
                                    delayTime: formData.totalCurrent,
                                    averageDelayTime: formData.totalCurrent / self.queue2Arrary1[queue2_i].serverTime
                                });
                                self.result = formData.outResult();

                                self.queue2Arrary1.pop();

                                queue2_i--;
                                queue2_j = 0;
                            }
                            //如果服务时间小于等于0，则直接退出队列
                            if (queue2_j == formData.queue_2()) {
                                formData.queue3Add(self.queue2Arrary1[queue2_i]);
                                self.queue2Arrary1.pop();
                                queue2_i--;
                                queue2_j = 0;
                            }
                            //如果时间片执行完毕，则该进程退出队列，并加入下一队列
                            if (self.queue2Arrary1.length == 0) {

                                self.queue3Arrary1 = formData.queue3List();
                                self.queue3Arrary2 = formData.queue3_1List();
                                //更新第二队列数组长度
                                queue3Length = formData.queue3List().length;
                                queue3_i = formData.queue3List().length - 1;
                                queue3_j = 0;

                                // while (arrLength--) {
                                // self.queue3Arrary1 = formData.queue3List();
                                // //更新第二队列数组长度
                                // queue3Length = self.queue3Arrary1.length;
                                // queue3_i = self.queue3Arrary1.length - 1;
                                // queue3_j = 0;
                                $interval(function() {
                                    if (queue3_i >= 0) {
                                        self.queue3Arrary1[queue3_i].remainTime -= 1;
                                        queue3_j++;
                                    }
                                    //如果队列中数组不为空，则服务时间减1，标志数组加1
                                    if (self.queue3Arrary1[queue3_i].remainTime <= 0) {
                                        formData.resultAdd({
                                            processName: self.queue3Arrary1[queue3_i].processName,
                                            serverTime: self.queue3Arrary1[queue3_i].serverTime,
                                            delayTime: formData.totalCurrent,
                                            averageDelayTime: formData.totalCurrent / self.queue3Arrary1[queue3_i].serverTime
                                        });
                                        self.result = formData.outResult();
                                        self.queue3Arrary1.pop();
                                        queue3_i--;
                                        queue3_j = 0;
                                    }
                                    //如果服务时间小于等于0，则直接退出队列
                                    if (queue3_j == formData.queue_3()) {
                                        formData.queue3_1Add(self.queue3Arrary1[queue3_i]);
                                        self.queue3Arrary1.pop();
                                        // console.log(formData.queue3List()[queue3_i]);
                                        // self.queue3Arrary1.length = [];
                                        console.log(self.queue3Arrary1.length);
                                        console.log(self.queue3Arrary2.length);
                                        console.log(queue3_i);
                                        console.log(queue3_j);
                                        queue3_i--;
                                        queue3_j = 0;

                                    }
                                    if ((self.queue3Arrary1.length == 0) && (self.queue3Arrary2.length != 0)) {
                                        loop();
                                    }
                                    formData.totalCurrent++;
                                    $scope.percent = { width: (formData.totalCurrent / formData.times()) * 100 + '%' }
                                    self.percentNumber = (formData.totalCurrent / formData.times()) * 100 + '%';
                                }, formData.time(), formData.queue_3() * queue3Length);

                            }
                            formData.totalCurrent++;
                            $scope.percent = { width: (formData.totalCurrent / formData.times()) * 100 + '%' }
                            self.percentNumber = (formData.totalCurrent / formData.times()) * 100 + '%';
                        }, formData.time(), formData.queue_2() * queue2Length);

                    }
                    formData.totalCurrent++;
                    $scope.percent = { width: (formData.totalCurrent / formData.times()) * 100 + '%' }
                    self.percentNumber = (formData.totalCurrent / formData.times()) * 100 + '%';
                }, formData.time(), formData.queue_1() * queue1Length);




            }
            self.reload = function() {
                location.reload();
            }

        }])