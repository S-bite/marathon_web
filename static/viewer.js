
const H = 128
const W = 128

var movenum = 0;
var moves = [];
var boards = []
var isRunning = false;
var isLoaded = false;

var ctx
function renderCanvas(turn) {
    ctx.fillStyle = "#ffffff"
    ctx.clearRect(0, 0, 512, 512)
    for (var i = 0; i < H; i++) {
        for (var j = 0; j < W; j++) {
            var color = "#"
            for (var k = 0; k < 3; k++) {
                if (boards[turn][i][j][k] == 0) {
                    color += "00"
                } else {
                    color += "ff"
                }
            }
            ctx.fillStyle = color
            ctx.fillRect(j * 4, i * 4, 4, 4)
        }
    }
    ctx.strokeStyle = "#FF8888"
    ctx.lineWidth = 4;
    if (turn >= 1) {
        ctx.strokeRect(moves[turn - 1][1] * 4, moves[turn - 1][0] * 4, moves[turn - 1][3] * 4 - moves[turn - 1][1] * 4 + 4, moves[turn - 1][2] * 4 - moves[turn - 1][0] * 4 + 4);

    }
}

function calcScore(board) {
    var score = 0;
    for (var i = 0; i < H; i++) {
        for (var j = 0; j < W; j++) {
            if ((i + j) % 2 == 0) {
                score += board[i][j][0];
            }
            else {
                score += 1 - board[i][j][1];
            }
        }
    }
    return score
}

function buildBoardFromMoves() {
    boards = []
    var curBoard = new Array(H)
    for (var i = 0; i < H; i++) {
        curBoard[i] = new Array(W)
        for (var j = 0; j < W; j++) {
            curBoard[i][j] = [0, 0, 0]
        }
    }
    boards.push(JSON.parse(JSON.stringify(curBoard)))
    for (var turn = 0; turn < movenum; turn++) {

        curBoard = JSON.parse(JSON.stringify(boards[turn]))
        for (var i = moves[turn][0]; i <= moves[turn][2]; i++) {
            for (var j = moves[turn][1]; j <= moves[turn][3]; j++) {
                if (moves[turn][4] == 0) {
                    curBoard[i][j][0] = 1 - curBoard[i][j][0];
                } else if (moves[turn][4] == 1) {
                    curBoard[i][j][1] = 1 - curBoard[i][j][1];
                } else if (moves[turn][4] == 2) {
                    curBoard[i][j][2] = 1 - curBoard[i][j][2];
                } else if (moves[turn][4] == 3) {
                    curBoard[i][j][0] = 1 - curBoard[i][j][0];
                    curBoard[i][j][1] = 1 - curBoard[i][j][1];
                    curBoard[i][j][2] = 1 - curBoard[i][j][2];
                }
            }
        }
        boards.push(JSON.parse(JSON.stringify(curBoard)))
    }
    document.getElementById('score').innerText = calcScore(boards[movenum]);

}
var turn = 0;
var frame = 0;


function init(file, callback) {
    isLoaded = false;
    document.getElementById('score').innerText = "wait...";
    ctx = document.getElementById("canvas").getContext("2d")
    console.log(ctx)
    var reader = new FileReader();
    reader.readAsText(file[0]);
    reader.onload = function () {
        var rawOutputList = reader.result.split(/[\s\n]/);
        movenum = Number(rawOutputList[0])
        if (movenum > 500) {
            alert("操作回数が多すぎます")
            return;
        }
        moves = []
        for (var i = 1; i <= movenum * 5; i += 5) {
            var tmp = []
            for (var j = 0; j < 5; j++) {
                tmp.push(Number(rawOutputList[i + j]))
            }
            moves.push(JSON.parse(JSON.stringify(tmp)))
        }
        turn = 0;
        frame = 0;

        buildBoardFromMoves()
        renderCanvas(turn)
        isLoaded = true;

    }
}
(function () {
    var slider = document.getElementById('slider1');
    var output = document.getElementById('turn');

    var input = slider.getElementsByTagName('input')[0];
    var root = document.documentElement;
    var dragging = false;
    var value = output.value;// 初期位置
    var width = input.clientWidth / 2;

    var start = document.getElementById('start');
    console.log(document);
    var update = function () {
        id = window.requestAnimationFrame(update);
        if (isRunning == false) {
            window.cancelAnimationFrame(id);
            return;
        }
        if (frame % 5 == 0) {
            frame = 0;
            turn++;
            renderCanvas(turn);
            value = turn
            set_value();

            if (turn == movenum) {
                turn = 0;
                isRunning = false
                start.innerText = '▶';
                cancelAnimationFrame(update);
            }
        }
        frame++;

    };

    start.onclick = function (evt) {
        if (isRunning) {
            isRunning = false;
            start.innerText = '▶';
            cancelAnimationFrame(update);
        } else if (isLoaded) {
            isRunning = true;
            start.innerText = '■';
            update();
        } else if (!isLoaded) {
            alert("ファイルが選択されていません")
        }
    };


    var set_value = function () {
        // つまみのサイズ(input.clientWidth)だけ位置を調整
        input.style.left = (value / movenum * 500 - input.clientWidth / 2) + 'px';
        output.value = value;
    };
    set_value();

    // 目盛り部分をクリックしたとき
    slider.onclick = function (evt) {
        dragging = true;
        document.onmousemove(evt);
        document.onmouseup();
    };
    // ドラッグ開始
    input.onmousedown = function (evt) {
        if (isLoaded) {
            dragging = true;
            return false;

        }
    };
    // ドラッグ終了
    document.onmouseup = function (evt) {
        if (dragging) {
            dragging = false;
            output.value = value;
        }
    };
    document.onmousemove = function (evt) {
        if (dragging) {
            // ドラッグ途中
            if (!evt) {
                evt = window.event;
            }
            var left = evt.clientX;
            var rect = slider.getBoundingClientRect();
            // マウス座標とスライダーの位置関係で値を決める
            value = Math.ceil((left - rect.left + width) / 500 * movenum);
            // スライダーからはみ出したとき
            if (value < 0) {
                value = 0;
            } else if (value > movenum) {
                value = movenum;
            }
            turn = value
            set_value();

            renderCanvas(turn)
            return false;
        }
    };

}());