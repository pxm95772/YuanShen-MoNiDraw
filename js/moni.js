$(function() {
    //滑轮图片**********************************************************************************************
    for (var i = 1; i <= 31; i++) {
        $('.cardpool_nav').children('li').eq(i - 1).css('background-image', 'url("sucai/photos/cardpool/cardpool' + i + '.jpg")');
        $('.cardpool_nav').children('li').eq(i - 1).attr("index", i - 1);
    };
    var dqkc = 1;
    $('.cardpool_nav li').on('click', function() {
        $('.cardpool').css('background-image', $(this).css("background-image"));
        dqkc = parseInt($(this).attr('index')); //记录当前卡尺数（从0~30）
        // console.log("当前在第" + dqkc + "张图");
        // console.log("当期up角色是：" + heroInformation[kapool[parseInt($(this).attr('index')) + 1].mainup].name);
        // console.log("其他有：" + heroInformation[kapool[parseInt($(this).attr('index')) + 1].otherup[0]].name + "、" + heroInformation[kapool[parseInt($(this).attr('index')) + 1].otherup[1]].name + "、" + heroInformation[kapool[parseInt($(this).attr('index')) + 1].otherup[2]].name);
    });
    //各个图片、文字大小**********************************************************************************************
    // console.log("屏幕的宽度：" + window.innerWidth);
    // console.log("屏幕的高度：" + window.innerHeight);
    // $('.cardpool_nav').css('border-radius', $('.cardpool_nav').width() * 0.2 + 'px');
    //【初始化】这里的currency获取了当前的货币信息字符串
    if (!localStorage.getItem('currency')) {
        console.log('初始化currency货币');
        localStorage.setItem('currency', JSON.stringify({ yuanshi: 1600, pinkball: 150, }))
    }
    //初始清除所有定时器
    for (var i = 1; i < 1000; i++) {
        clearInterval(i);
    };

    // clearInterval();
    var timer1; //定义一个1分钟一次循环的定时器名，方便后面的增删

    //每n分钟调用一次自增粉球**********************************************************************************************
    var jlf = true; //节流阀
    var pinkballup = function() {
        var lsbl = getCurrency('pinkball'); //粉球数量
        if (lsbl < 300) {
            setCurrency('pinkball', lsbl + 1);
            $('.pinkball').text(getCurrency('pinkball'));
            var t1 = new Date();
            localStorage.setItem('sjc', t1.getTime());
            console.log("自增！" + t1.getTime());
        }
        if (getCurrency('pinkball') >= 300) clearInterval(timer1);
    };

    //刷新/重启获取时间戳**********************************************************************************************
    var date = new Date();
    var oneminute = 60000; //定义一分钟,标准用60000，测试用1000或10000
    var t = date.getTime();
    if (localStorage.getItem('sjc')) {
        var s = parseInt(localStorage.getItem('sjc')); //上一次的时间戳
        console.log("本次和上次相隔" + (t - s) / 1000 + "秒,ps:不足1分钟会累加");
        var lsbl = parseInt((t - s) / oneminute); //本次和上次相隔lsbl分钟
        console.log("本次和上次相隔" + lsbl + "分钟,ps:不足1分钟会累加");
        if (getCurrency('pinkball') >= 300) {
            setCurrency('pinkball', getCurrency('pinkball'));
            localStorage.setItem('sjc', t);
        } else if (lsbl + getCurrency('pinkball') < 300) {
            setCurrency('pinkball', lsbl + getCurrency('pinkball'));
            localStorage.setItem('sjc', s + lsbl * oneminute); //更新时间
            //追回浪费时间
            var loss = t - s - lsbl * oneminute;
            console.log("loss:" + loss);
            //该定时器先解决浪费时间，再循环+1
            var timer2 = setTimeout(() => {
                var lsbl = getCurrency('pinkball'); //零时变量存粉球数量
                if (lsbl < 300) { //这肯定是小于的，下次重构
                    setCurrency('pinkball', lsbl + 1);
                    $('.pinkball').text(getCurrency('pinkball'));
                    var t1 = new Date();
                    localStorage.setItem('sjc', t1.getTime());
                    console.log("自增！" + t1.getTime());
                }
                timer1 = setInterval(pinkballup, oneminute);
            }, oneminute - loss);
        } else {
            setCurrency('pinkball', 300);
            localStorage.setItem('sjc', t);
            //也无需开启自增
        }
    } else {
        localStorage.setItem('sjc', t);
        console.log("首次记录时间");
        timer1 = setInterval(pinkballup, oneminute);
    }

    //数据板块**********************************************************************************************
    var czbd = localStorage.getItem('czbd') || 0; //获取/初始化出紫保底
    var cjbd = localStorage.getItem('cjbd') || 0; //获取/初始化出金保底
    $('.czbd').text(czbd); //保底页面同步
    $('.cjbd').text(cjbd); //保底页面同步;
    $('.yuanshi').text(getCurrency('yuanshi')); //原石数量页面同步
    $('.pinkball').text(getCurrency('pinkball')); //粉球数量页面同步

    //消耗道具：获取与修改**********************************************************************************************
    function setCurrency(who, value) {
        var lsbl = JSON.parse(localStorage.getItem('currency'));
        lsbl[who] = value;
        localStorage.setItem('currency', JSON.stringify(lsbl));
        $('.' + who).text(value); //页面更新
    }

    function getCurrency(who) {
        return JSON.parse(localStorage.getItem('currency'))[who];
    }
    //交换原石板块**********************************************************************************************
    //进入小窗的初点击
    $('.yuanshi_kz').on('click', function() {
        $('.changeyy').show();
        tzdx();
    });
    //小窗取消键
    $('.changefalse').on('click', function() {
        $('.changeyy').hide();
    });
    //小窗+/-/max/-5点击功能
    $('.changereduce').on('click', function() {
        if (parseInt($('.changenum').text()) >= 2) {
            $('.changenum').text(parseInt($('.changenum').text()) - 1);
            $('.changetotal span').text(parseInt($('.changenum').text()) * 160);
        }
    });
    $('.changeplus').on('click', function() {
        if (parseInt($('.changetotal span').text()) + 160 <= getCurrency('yuanshi')) {
            $('.changenum').text(parseInt($('.changenum').text()) + 1);
            $('.changetotal span').text(parseInt($('.changenum').text()) * 160);
        }
        if (getCurrency('pinkball') >= 300) {
            clearInterval(timer1);
        }
    });
    $('.changemax').on('click', function() {
        $('.changenum').text(parseInt(getCurrency('yuanshi') / 160));
        $('.changetotal span').text(parseInt($('.changenum').text()) * 160);
        if (getCurrency('pinkball') >= 300) {
            clearInterval(timer1);
        }
    });
    $('.changeffive').on('click', function() {
        if (parseInt($('.changenum').text()) - 5 >= 1) {
            $('.changenum').text(parseInt($('.changenum').text()) - 5);
            $('.changetotal span').text(parseInt($('.changenum').text()) * 160);
        }
    });
    //小窗确认按钮
    $('.changetrue').on('click', function() {
        if (getCurrency('yuanshi') < 160) alert('你来白嫖呢？原石不够了！');
        else {
            setCurrency('yuanshi', getCurrency('yuanshi') - parseInt($('.changetotal span').text()));
            setCurrency('pinkball', getCurrency('pinkball') + parseInt($('.changenum').text()));
        }
        $('.changeyy').hide();
        $('.changenum').text(1);
        $('.changetotal span').text(160);
    });
    //粉球按键提示
    $('.pinkball_kz').on('click', function() {
        alert('纠缠之缘在没bug的情况下每分钟会增长一个(最多自增长到300个)，即使关闭页面或者关机重启、第二天来玩，纠缠支援也会一直增长，且保底机制会一直保留！');
    });
    //抽卡弹出页面**********************************************************************************************
    var tcdh = function(who) {
        $('#dhvideo').prop('class', who);
        $('#dhvideo').prop('src', "sucai/video/" + who + ".mp4");
        $('.' + who).show();
        $('.pass').show();
        $('.' + who)[0].play(0);
        $('.' + who).on('ended pause', function() {
            $('.' + who).hide();
            $('.pass').hide();
            $('.result_bg').show();
        });
    };
    //出货条件**************************************************************************************************
    var goldcondition = function(sj) {
        //出金条件
        if (sj < (40 + cjbd * 7) && sj >= 0 || cjbd >= 90) return true;
        else return false;
    };
    var purplecondition = function(sz) {
        //出紫条件
        if (sz < (510 + czbd * 150) && sz >= 0 || czbd >= 10) return true;
        else return false;
    };

    var geshu = 0; //统计是几抽的
    var szbtn = 0; //记录选择了几抽的
    var cardjl = []; //记录数组

    var chu_j = function() {
        $('.result_name').hide();
        $('.result_bg img').prop('src', "./sucai/photos/qiyuan/" + heroInformation[kapool[dqkc + 1].mainup].name + "f.png");
        var settime = function() {
            setTimeout(() => {
                $('.result_name').html("<p>" + heroInformation[kapool[dqkc + 1].mainup].name + "<p/><p style='font-size: 30px'>⭐⭐⭐⭐⭐</p>");
                $('.result_bg img').prop('src', "./sucai/photos/qiyuan/" + heroInformation[kapool[dqkc + 1].mainup].name + ".png");
                $('.result_name').show();
            }, 600);
        };
        if (geshu === szbtn) {
            $('.dccj,.slcj').on('ended pause', function() {
                settime();
            });
        } else {
            settime();
        }
    };
    var chu_z = function() {
        var givez_hero = parseInt(Math.random() * 3);
        var settime = function() {
            setTimeout(() => {
                $('.result_name').html("<p>" + heroInformation[kapool[dqkc + 1].otherup[givez_hero]].name + "<p/><p style='font-size: 30px'>⭐⭐⭐⭐</p>");
                $('.result_bg img').prop('src', "./sucai/photos/qiyuan/" + heroInformation[kapool[dqkc + 1].otherup[givez_hero]].name + ".png");
                $('.result_name').show();
            }, 600);
        };
        $('.result_name').hide();
        $('.result_bg img').prop('src', "./sucai/photos/qiyuan/" + heroInformation[kapool[dqkc + 1].otherup[givez_hero]].name + "f.png");
        if (geshu === szbtn) {
            $('.dccz,.slcj,.slcz').on('ended pause', function() {
                settime();
            });
        } else {
            settime();
        }
    };
    var chu_l = function() {
        $('.result_bg img').prop('src', "./sucai/photos/qiyuan/ysqiyuanf.png");
        var settime = function() {
            setTimeout(() => {
                // console.log("开始执行");
                var giveys = parseInt(Math.random() * 30) + 20;
                $('.result_name').html("<p>原石×" + giveys + "</p><p style='font-size: 30px'>⭐⭐⭐<p>");
                $('.result_bg img').prop('src', "./sucai/photos/qiyuan/ysqiyuan.png");
                $('.result_name').show();
                setCurrency('yuanshi', getCurrency('yuanshi') + giveys);
            }, 600);
        };
        if (geshu === szbtn) {
            $('.dccl,.slcj,.slcz').on('ended pause', function() {
                settime();
            })
        } else {
            settime();
        }
    };
    var sfpd = function(index) {
        //十发独有的判断
        if (cardjl[index] == 90) { chu_j(); } else if (cardjl[index] == 10) { chu_z(); } else if (cardjl[index] == 1) { chu_l(); }
    };
    //点击了单抽的**********************************************************************************************
    $('.btn1').on('click', function() {
        cjbd++;
        czbd++;
        //判断粉球数量是否够
        if (getCurrency('pinkball') > 0) {
            setCurrency('pinkball', getCurrency('pinkball') - 1);
        } else {
            alert("你的纠缠之源数量不够啦！");
            return false;
        }
        // 抽卡后开始检测循环
        if (getCurrency('pinkball') < 300 && getCurrency('pinkball') + 1 >= 300) timer1 = setInterval(pinkballup, oneminute), console.log("我开启了单抽里的计数器255行");
        //产生随机数
        var sjs = parseInt(Math.random() * 10000);
        $('.rand').text(sjs);
        // console.log("随机数：" + sjs);
        //开始判断
        geshu = 1;
        szbtn = 1;
        if (goldcondition(sjs)) {
            // 出金开场视频
            tcdh('dccj');
            //初始修改出货样式src
            chu_j();
            // console.log('单抽出金！！！');
            //初始化计数器
            cjbd = 0;
            czbd = 0;
        } else if (purplecondition(sjs)) {
            // 出紫开场视频
            tcdh('dccz');
            //初始修改出货样式src
            chu_z();
            // console.log('单抽出紫！');
            //初始化计数器
            czbd = 0;
        } else {
            // 出蓝
            tcdh('dccl');
            //初始修改出货样式src
            chu_l();
            // console.log("单抽出蓝，紫保底：" + czbd);
        }
        localStorage.setItem('czbd', czbd);
        localStorage.setItem('cjbd', cjbd);
        $('.czbd').text(czbd);
        $('.cjbd').text(cjbd);

    });

    // 点击了十发的**********************************************************************************************
    $('.btn10').on('click', function() {
        var flag = true;
        //判断粉球数量是否够
        if (getCurrency('pinkball') >= 10) {
            setCurrency('pinkball', getCurrency('pinkball') - 10);
        } else {
            alert("你的纠缠之源数量不够啦！");
            return false;
        }
        // 抽卡后开始检测循环
        //裴孝明的程序，坚决抵制抄袭
        if (getCurrency('pinkball') < 300 && getCurrency('pinkball') + 10 >= 300) timer1 = setInterval(pinkballup, oneminute), console.log("开启了十发里的计数器305行");
        geshu = 10;
        szbtn = 10;
        for (var i = 0; i < 10; i++) {
            cjbd++;
            czbd++;
            //产生随机数
            var sjs = parseInt(Math.random() * 10000);
            $('.rand').text(sjs); //其实这话不太需要了~~~
            // console.log("第" + (i + 1) + "个随机数：" + sjs);
            //开始判断
            if (goldcondition(sjs)) {
                //出金条件
                flag = false;
                // console.log('出金啦！！！！');
                cardjl[i] = 90;
                //初始化数据
                cjbd = 0;
                czbd = 0;
            } else if (purplecondition(sjs)) {
                // console.log('出紫！');
                cardjl[i] = 10;
                //初始化数据
                czbd = 0;
            } else {
                cardjl[i] = 1;
            }
        }
        if (flag) {
            //十连出紫开场视频
            tcdh('slcz');
            //保证第一个样式改变了
            sfpd(0);
        } else {
            //十连出金开场视频
            tcdh('slcj');
            //保证第一个样式改变了
            sfpd(0);
        }
        localStorage.setItem('czbd', czbd);
        localStorage.setItem('cjbd', cjbd);
        $('.czbd').text(czbd);
        $('.cjbd').text(cjbd);
    });

    //点击跳过的逻辑
    $('.pass').on('click', function() {
        $('#dhvideo')[0].pause();
    });
    //点击出货会下一个
    $('.result_bg').on('click', function() {
        geshu--;
        $('.result_name').hide();
        if (!geshu) $('.result_bg').hide();
        else sfpd(10 - geshu);
    });

    //自适应屏幕**********************************************************************************************
    var cspk = window.innerWidth;
    var cspg = window.innerHeight;
    var k = cspk / cspg;
    console.log("宽：" + cspk + ",高：" + cspg);
    console.log("window的宽：" + window.innerWidth);
    console.log("window的高：" + window.innerHeight);
    console.log("以上是初始的宽高******************");
    //初始化屏幕数值参数函数
    var tzdx = function() {
        $('.cardpool_nav').css('border-radius', $('.cardpool_nav').innerWidth() * 0.15);
        $('.cardpool_nav li').css('border-radius', $('.cardpool_nav li').innerHeight() * 0.2);
        $('.cardpool_nav').css('box-shadow', parseInt($('.cardpool_nav').css('border-radius')) / 13.84 + "px " + parseInt($('.cardpool_nav').css('border-radius')) / 13.84 + "px " + parseInt($('.cardpool_nav').css('border-radius')) / 1.384 + "px rgba(0,0,0,0.5)");
        $('.cardpool').css('border-radius', $('.cardpool').innerHeight() * 0.05);
        $('.yuanshi_kz, .pinkball_kz').css('border-radius', $('.yuanshi_kz').innerHeight() * 0.5);
        $('.yuanshi_kz img, .pinkball_kz img').css('width', $('.yuanshi_kz').innerHeight() * 0.85);
        $('.yuanshi, .pinkball').css('font-size', $('.yuanshi_kz').innerHeight() * 0.5);
        $('.cardpool h1').css('font-size', $('.cardpool').innerHeight() * 0.055);
        //弹窗部分的（抽卡动画的实在不想做了，呜呜呜）
        $('.changeyy').css('width', $('.kuangjia').innerWidth());
        $('.changeyy').css('height', $('.kuangjia').innerHeight());
        $('.changeblock').css('border-radius', $('.changeblock').innerHeight() * 0.1);
        $('.changeblock h2').css('font-size', $('.changeblock').innerHeight() * 0.1);
        $('.changeffive, .changereduce, .changeplus, .changemax').css('font-size', $('.changeblock').innerHeight() * 0.06);
        $('.changenum').css('font-size', $('.changeblock').innerHeight() * 0.11);
        $('.changetotal').css('font-size', $('.changeblock').innerHeight() * 0.065);
        $('.changetrue, .changefalse').css('font-size', $('.changeblock').innerHeight() * 0.08);
        $('.changeffive, .changereduce, .changeplus, .changemax, .changenum').css('border-radius', $('.changenum').innerHeight() * 0.2);
        $('.changetrue, .changefalse').css('border-radius', $('.changetrue').innerHeight() * 0.2);
        $('.changetrue, .changefalse').css('box-shadow', parseInt($('.changetrue').css('font-size')) / 9 + "px " + parseInt($('.changetrue').css('font-size')) / 9 + "px " + parseInt($('.changetrue').css('font-size')) / 3.6 + "px rgba(0,0,0,0.3)");
        $('.changeffive, .changereduce, .changeplus, .changemax, .changenum').css('box-shadow', parseInt($('.changemax').css('font-size')) / 9 + "px " + parseInt($('.changemax').css('font-size')) / 9 + "px " + parseInt($('.changemax').css('font-size')) / 3.6 + "px rgba(0,0,0,0.3)");
    };
    //初始化屏幕数值参数
    tzdx();
    window.addEventListener('resize', function() {
        // console.log("window的宽：" + window.innerWidth);
        // console.log("window的高：" + window.innerHeight);
        // console.log("******************");
        if (window.innerWidth > cspk) {
            // 页面在缩小
            $('.kuangjia').css('width', window.innerWidth);
            $('.dccj').css('width', window.innerHeight * k);
            $('.dccz').css('width', window.innerHeight * k);
            $('.dccl').css('width', window.innerHeight * k);
            $('.slcj').css('width', window.innerHeight * k);
            $('.slcz').css('width', window.innerHeight * k);
            // $('.dccj').css('height', window.innerHeight);
            // $('.dccz').css('height', window.innerHeight);
            // $('.dccl').css('height', window.innerHeight);
            // $('.slcj').css('height', window.innerHeight);
            // $('.slcz').css('height', window.innerHeight);
        } else {
            //页面在放大
            $('.kuangjia').css('width', cspk);
            $('.dccj').css('width', cspk);
            $('.dccz').css('width', cspk);
            $('.dccl').css('width', cspk);
            $('.slcj').css('width', cspk);
            $('.slcz').css('width', cspk);
        }
        if (window.innerHeight < cspg) {
            //页面在放大，我们要保持盒子总宽为初始宽度
            $('.kuangjia').css('height', cspg);
        } else {
            // 页面缩小了，要保持盒子大小为屏幕大小
            $('.kuangjia').css('height', window.innerHeight);
            $('.kuangjia').css('width', window.innerHeight * k);
            // $('.dccj').css('width', window.innerWidth);
            // $('.dccz').css('width', window.innerWidth);
            // $('.dccl').css('width', window.innerWidth);
            // $('.slcj').css('width', window.innerWidth);
            // $('.slcz').css('width', window.innerWidth);
        }
        //也面调整好了，就需要再调整其他的长宽
        tzdx();
    });
});
//裴孝明的程序，坚决抵制抄袭