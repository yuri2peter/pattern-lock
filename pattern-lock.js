/**
 * @info 核心代码来源于 https://www.cnblogs.com/amylis_chen/p/4142588.html
 * @author Yuri2
 * @created 2018/04/01
 * */

function PatternLock(p) {
    var R = 26, CW = 400, CH = 320, OffsetX = 30, OffsetY = 30,change=function (LinePoint) {
        alert("密码结果是："+LinePoint.join("->"));
    };
    if(p.radius) R=p.radius;
    if(p.width) CW=p.width;
    if(p.height) CH=p.height;
    if(p.offsetX) OffsetX=p.offsetX;
    if(p.offsetY) OffsetY=p.offsetY;
    if(p.change) change=p.change;

    var box = document.querySelector(p.el);
    var c = document.createElement('canvas');
    box.appendChild(c);

    c.width = CW;
    c.height = CH;
    var cxt = c.getContext("2d");
    var X = (CW - 2 * OffsetX - R * 2 * 3) / 2;
    var Y = (CH - 2 * OffsetY - R * 2 * 3) / 2;
    var PointLocationArr = CaculateNinePointLotion(X, Y);
    InitEvent(c, cxt,change);
    Draw(cxt, PointLocationArr, [],null);

    function CaculateNinePointLotion(diffX, diffY) {
        var Re = [];
        for (var row = 0; row < 3; row++) {
            for (var col = 0; col < 3; col++) {
                var Point = {
                    X: (OffsetX + col * diffX + ( col * 2 + 1) * R),
                    Y: (OffsetY + row * diffY + (row * 2 + 1) * R)
                };
                Re.push(Point);
            }
        }
        return Re;
    }
    function Draw(cxt, _PointLocationArr, _LinePointArr,touchPoint) {
        if (_LinePointArr.length > 0) {
            cxt.beginPath();
            for (var i = 0; i < _LinePointArr.length; i++) {
                var pointIndex = _LinePointArr[i];
                cxt.lineTo(_PointLocationArr[pointIndex].X, _PointLocationArr[pointIndex].Y);
            }
            cxt.lineWidth = 10;
            cxt.strokeStyle = "#627eed";
            cxt.stroke();
            cxt.closePath();
            if(touchPoint!=null)
            {
                var lastPointIndex=_LinePointArr[_LinePointArr.length-1];
                var lastPoint=_PointLocationArr[lastPointIndex];
                cxt.beginPath();
                cxt.moveTo(lastPoint.X,lastPoint.Y);
                cxt.lineTo(touchPoint.X,touchPoint.Y);
                cxt.stroke();
                cxt.closePath();
            }
        }
        for (var i = 0; i < _PointLocationArr.length; i++) {
            var Point = _PointLocationArr[i];
            cxt.fillStyle = "#627eed";
            cxt.beginPath();
            cxt.arc(Point.X, Point.Y, R, 0, Math.PI * 2, true);
            cxt.closePath();
            cxt.fill();
            cxt.fillStyle = "#ffffff";
            cxt.beginPath();
            cxt.arc(Point.X, Point.Y, R - 3, 0, Math.PI * 2, true);
            cxt.closePath();
            cxt.fill();
            if(_LinePointArr.indexOf(i)>=0)
            {
                cxt.fillStyle = "#627eed";
                cxt.beginPath();
                cxt.arc(Point.X, Point.Y, R -16, 0, Math.PI * 2, true);
                cxt.closePath();
                cxt.fill();
            }

        }
    }
    function IsPointSelect(touches,LinePoint){
        for (var i = 0; i < PointLocationArr.length; i++) {
            var currentPoint = PointLocationArr[i];
            var xdiff = Math.abs(currentPoint.X - touches.pageX);
            var ydiff = Math.abs(currentPoint.Y - touches.pageY);
            var dir = Math.pow((xdiff * xdiff + ydiff * ydiff), 0.5);
            if (dir < R ) {
                if(LinePoint.indexOf(i) < 0){ LinePoint.push(i);}
                break;
            }
        }
    }
    function InitEventBak(canvasContainer, cxt,change) {
        var LinePoint = [];
        canvasContainer.addEventListener("touchstart", function (e) {
            IsPointSelect(e.touches[0],LinePoint);
        }, false);
        canvasContainer.addEventListener("touchmove", function (e) {
            e.preventDefault();
            var touches = e.touches[0];
            IsPointSelect(touches,LinePoint);
            cxt.clearRect(0,0,CW,CH);
            Draw(cxt,PointLocationArr,LinePoint,{X:touches.pageX,Y:touches.pageY});
        }, false);
        canvasContainer.addEventListener("touchend", function (e) {
            cxt.clearRect(0,0,CW,CH);
            Draw(cxt,PointLocationArr,LinePoint,null);
            change(LinePoint);
            LinePoint=[];
        }, false);
    }
    function InitEvent(canvasContainer, cxt,change) {
        var LinePoint = [];
        var start=function (p) {
            IsPointSelect(p,LinePoint);
        };
        var move=function (p) {
            var touches = p;
            IsPointSelect(touches,LinePoint);
            cxt.clearRect(0,0,CW,CH);
            Draw(cxt,PointLocationArr,LinePoint,{X:touches.pageX,Y:touches.pageY});
        };
        var end=function () {
            cxt.clearRect(0,0,CW,CH);
            Draw(cxt,PointLocationArr,LinePoint,null);
            change(LinePoint);
            LinePoint=[];
        };

        canvasContainer.addEventListener("touchstart", function (e) {
            e.preventDefault();
            start(e.touches[0]);
        });
        canvasContainer.addEventListener("touchmove", function (e) {
            e.preventDefault();
            move(e.touches[0]);
        });
        canvasContainer.addEventListener("touchend", function (e) {
            e.preventDefault();
            end(e.touches[0]);
        });

        var mousedown=false;
        canvasContainer.addEventListener("mousedown", function (e) {
            mousedown=true;
            e.preventDefault();
            start(e);
        });
        canvasContainer.addEventListener("mousemove", function (e) {
            if(mousedown){
                e.preventDefault();
                move(e);
            }
        });
        canvasContainer.addEventListener("mouseup", function (e) {
            mousedown=false;
            e.preventDefault();
            end(e);
        });

    }
}
