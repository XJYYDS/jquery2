window.onload = function() {
    var chess = document.getElementById("chess"); //获取棋盘

    //绘制棋盘
    var context = chess.getContext("2d"); //获取绘制2d画要用的方法
    context.strokeStyle = "rgb(64, 37, 8)" //线的颜色
    chessBorder();

    //线段绘制
    function chessBorder() {
        //横线
        for (var i = 0; i < 15; i++) {
            //线段绘制起始点
            context.moveTo(15, 15 + i * 30);
            //线段绘制终点
            context.lineTo(435, 15 + i * 30);
            //连线
            context.stroke();
        }
        //竖线
        for (var i = 0; i < 15; i++) {
            //线段绘制起始点
            context.moveTo(15 + 30 * i, 15);
            //线段绘制终点
            context.lineTo(15 + 30 * i, 435);
            //连线
            context.stroke();
        }
    }

    //赢法数组
    var wins = [];
    var count = 0; //赢法编号
    var mywin = []; //记录用户赢法上的分值
    var computerwin = []; //记录计算机赢法上的分值
    //将赢法数组变成三维数组分别用于放入棋子的x,y和赢法编号
    for (var i = 0; i < 15; i++) {
        wins[i] = [];
        for (var j = 0; j < 15; j++) {
            wins[i][j] = [];
        }
    }


    //横线赢法
    for (var i = 0; i < 15; i++) {
        for (var j = 0; j < 11; j++) {
            for (var k = 0; k < 5; k++) {
                wins[j + k][i][count] = true;
            }
            count++;
        }
    }
    //竖线赢法
    for (var i = 0; i < 15; i++) {
        for (var j = 0; j < 11; j++) {
            for (var k = 0; k < 5; k++) {
                wins[i][j + k][count] = true;
            }
            count++;
        }
    }
    //左斜线赢法
    for (var i = 0; i < 11; i++) {
        for (var j = 4; j < 15; j++) {
            for (var k = 0; k < 5; k++) {
                wins[i + k][j - k][count] = true;
            }
            count++;
        }
    }
    //右斜线赢法
    for (var i = 0; i < 11; i++) {
        for (var j = 0; j < 11; j++) {
            for (var k = 0; k < 5; k++) {
                wins[i + k][j + k][count] = true;
            }
            count++;
        }
    }
    //初始化赢法的分值
    //注：一定要在赢法统计完之后再初始化，否则赢法编号会有错
    for (var i = 0; i < count; i++) {
        mywin[i] = 0;
        computerwin[i] = 0;
    }

    //下棋时判断棋盘上这个位置是否已经下过
    var chessboerd = []; //记录哪些位置被下过
    for (var i = 0; i < 15; i++) {
        chessboerd[i] = [];
        for (var k = 0; k < 15; k++) {
            // 0为没下过，1为下过
            chessboerd[i][k] = 0;
        }
    }

    //下棋
    var me = true; //是否轮到我下棋
    var over = false; //游戏是否结束

    chess.onclick = function(e) {
        //如果游戏结束则跳出函数，将无法操作
        if (over) {
            return;
        }
        //如果没有轮到我也无法操作
        if (!me) {
            return;
        }
        //获取点击位置的x,y
        var x = e.offsetX;
        var y = e.offsetY;

        //将点击位置向下取整
        var i = Math.floor(x / 30);
        var j = Math.floor(y / 30);

        //判断下的地方有没有子
        if (chessboerd[i][j] == 0) {
            //下一个子
            oneStep(i, j, me);
            //标记已经下过的子
            chessboerd[i][j] = 1;
            //判断用户是否胜利
            for (var k = 0; k < count; k++) {
                if (wins[i][j][k]) {
                    mywin[k]++;

                    if (mywin[k] == 5) {
                        alert("恭喜你，你赢了！")

                        over = !over;
                        restart();
                    }
                }
            }
            //如果游戏没有结束，轮到计算机下子
            if (!over) {
                //禁止用户下子
                me = !me;
                //计算机落子
                computerAI();
            }
        }


        function computerAI() {

            //空白子在用户算法上的分值
            var myScore = [];
            //空白子在计算机算法上的分值
            var computerScore = [];

            for (var i = 0; i < 15; i++) {
                myScore[i] = [];
                computerScore[i] = [];
                for (var j = 0; j < 15; j++) {
                    myScore[i][j] = 0;
                    computerScore[i][j] = 0;
                }
            }
            //空白子最大分值
            var max = 0;
            //最大分值子的坐标
            let x = 0;
            let y = 0;
            for (var i = 0; i < 15; i++) {
                for (var j = 0; j < 15; j++) {
                    //筛选出所有空白子
                    if (chessboerd[i][j] == 0) {
                        for (var k = 0; k < count; k++) {
                            if (wins[i][j][k]) {
                                if (mywin[k] == 1) {
                                    myScore[i][j] += 200;
                                } else if (mywin[k] == 2) {
                                    myScore[i][j] += 900;
                                } else if (mywin[k] == 3) {
                                    myScore[i][j] += 2000;
                                } else if (mywin[k] == 4) {
                                    myScore[i][j] += 10000;
                                }

                                if (computerwin[k] == 1) {
                                    computerScore[i][j] += 220;
                                } else if (computerwin[k] == 2) {
                                    computerScore[i][j] += 420;
                                } else if (computerwin[k] == 3) {
                                    computerScore[i][j] += 2200;
                                } else if (computerwin[k] == 4) {
                                    computerScore[i][j] += 20000;
                                }
                            }

                        }

                        if (myScore[i][j] > max) {
                            max = myScore[i][j];
                            x = i;
                            y = j;
                        } else if (myScore[i][j] == max) {
                            if (computerScore[i][j] > max) {
                                max = computerScore[i][j];
                                x = i;
                                y = j;
                            }
                        }
                        if (computerScore[i][j] > max) {
                            max = computerScore[i][j];
                            x = i;
                            y = j;
                        } else if (computerScore[i][j] == max) {
                            if (myScore[i][j] > max) {
                                max = myScore[i][j];
                                x = i;
                                y = j;
                            }
                        }

                    }

                }
            }
            oneStep(x, y, me);
            chessboerd[x][y] = 1;

            for (var k = 0; k < count; k++) {
                if (wins[x][y][k]) {
                    computerwin[k]++;

                    if (computerwin[k] == 5) {
                        alert("计算机获胜！")
                        over = !over;
                        restart();

                    }
                }
            }

            if (!over) {
                me = !me;
            }

        }



        //绘制棋子的样式
        function oneStep(x, y, me) {
            //画圆
            context.beginPath();
            context.arc(15 + x * 30, 15 + y * 30, 13, 0, 2 * Math.PI)
            context.closePath();
            var color;
            if (me) {
                color = "#000"
            } else {
                color = "#fff"
            }
            context.fillStyle = color;
            context.fill();
        }

    }
    //游戏结束后点击重新开始按钮重载页面
    function restart() {
        $("#restart").css({
            display: "block"
        }).click(function() {
            window.location.reload();
        })
    }

}