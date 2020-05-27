(function (root) {
    function Progress() {
        this.durTime = 0; //存储总时间
        this.frameId = 0; //定时器
        this.startTime = 0; //开始播放的时间
        this.lastPercent = 0; //上一次播放的时间

        this.init();
    }
    Progress.prototype = {
        init: function () {
            //console.log('abc');
            this.getDom();
        },
        getDom: function () {
            this.curTime = document.querySelector('.curTime');
            this.circle = document.querySelector('.circle');
            this.frontBg = document.querySelector('.frontBg');
            this.totalTime = document.querySelector('.totalTime');
        },
        renderAlltime: function (time) {
            this.durTime = time;
            time = this.formatTime(time);
            this.totalTime.innerHTML = time;
        },
        formatTime: function (time) {
            time = Math.round(time);
            var m = Math.floor(time / 60);
            var s = time % 60;

            m = m < 10 ? '0' + m : m;
            s = s < 10 ? '0' + s : s;

            return m + ':' + s;
        },
        move: function (per,isDrag) {
           
            var This = this;

            this.lastPercent = per === undefined ? this.lastPercent : per;

            this.startTime = new Date().getTime();

            cancelAnimationFrame(this.frameId);

            function frame() {
                var curTime = new Date().getTime();
                var per = This.lastPercent + (curTime - This.startTime) / (This.durTime * 1000);

                if (per <= 1) {
                    This.update(per,isDrag);
                } else {
                    cancelAnimationFrame(This.frameId);
                }

                This.frameId = requestAnimationFrame(frame);
            }
            frame();
        },
        update: function (per, isDrag) {
            // console.log('update');

            var time = this.formatTime(per * this.durTime);
            this.curTime.innerHTML = time;

            //更新进度条的位置
            this.frontBg.style.width = per * 100 + '%';

            //如果用户是拖拽，那就不要让圆点自动走了
            if(isDrag){
                return;
            }

            //更新圆点的位置
            var l = per * this.circle.parentNode.offsetWidth;
            this.circle.style.transform = 'translateX(' + l + 'px)';
        },
        stop: function () {
            cancelAnimationFrame(this.frameId);
            var stopTime = new Date().getTime();
            this.lastPercent += (stopTime - this.startTime) / (this.durTime * 1000);
        }
    }
    function instancesProgress() {
        return new Progress();
    }

    function Drag(obj) {
        this.obj = obj;
        this.startPointX = 0;
        this.startleft = 0;
        this.percent = 0;

        this.init();
    }
    Drag.prototype = {
        init: function () {
            var This = this;

            this.obj.style.transform = 'translateX(0)';

            this.obj.addEventListener('touchstart', function (ev) {
                This.startPointX = ev.changedTouches[0].pageX;
                This.startleft = parseFloat(this.style.transform.split('(')[1]);    //['translateX','0)']

                This.start && This.start(); //对外暴露拖拽开始的方法，按下的时候要做的事情就交给用户，通过这个方法去添加
            });

            this.obj.addEventListener('touchmove', function (ev) {
                This.disPointX = ev.changedTouches[0].pageX - This.startPointX;
                var l = This.startleft + This.disPointX;

                console.log(This.startleft);

                if (l < 0) {
                    l = 0;
                } else if (l > this.offsetParent.offsetWidth) {
                    l = this.offsetParent.offsetWidth
                }

                this.style.transform = 'translateX(' + l + 'px)';


                This.percent = l / this.offsetParent.offsetWidth;
               
                This.move && This.move(This.percent); //对外暴露拖拽开始的方法，按下的时候要做的事情就交给用户，通过这个方法去添加
            });

            this.obj.addEventListener('touchend', function (ev) {
                This.end && This.end(This.percent); //对外暴露拖拽开始的方法，按下的时候要做的事情就交给用户，通过这个方法去添加
            });
        }
    }
    function instancesDrag(obj) {
        return new Drag(obj);
    }

    root.progress = {
        pro: instancesProgress,
        drag: instancesDrag,
    }

})(window.player || (window.player = {}));