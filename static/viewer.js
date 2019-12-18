
const H = 128
const W = 128

var movenum = 0;
var moves = [];
var boards = []

var ctx
function renderCanvas(turn) {
    ctx.fillStyle = "#ffffff"
    ctx.clearRect(0, 0, 512, 512)
    for (var i = 0; i < H; i++) {
        for (var j = 0; j < W; j++) {
            if (boards[turn][i][j] == 0) {
                ctx.fillStyle = "#000000"
            } else {
                ctx.fillStyle = "#ffffff"
            }
            ctx.fillRect(j * 4, i * 4, 4, 4)

        }
    }
    ctx.strokeStyle = "#FF8888"
    ctx.lineWidth = 4;
    if (turn >= 1) {
        ctx.strokeRect(moves[turn - 1][1] * 4, moves[turn - 1][0] * 4, moves[turn - 1][3] * 4 - moves[turn - 1][1] * 4 + 4, moves[turn - 1][2] * 4 - moves[turn - 1][0] * 4 + 4);

    }
}


function buildBoardFromMoves() {
    var curBoard = new Array(H)
    for (var i = 0; i < H; i++) {
        curBoard[i] = new Array(W)
        for (var j = 0; j < W; j++) {
            curBoard[i][j] = 0
        }
    }
    boards.push(JSON.parse(JSON.stringify(curBoard)))
    for (var turn = 0; turn < movenum; turn++) {

        curBoard = JSON.parse(JSON.stringify(boards[turn]))
        for (var i = moves[turn][0]; i <= moves[turn][2]; i++) {
            for (var j = moves[turn][1]; j <= moves[turn][3]; j++) {
                curBoard[i][j] = 1 - curBoard[i][j];
            }
        }
        boards.push(JSON.parse(JSON.stringify(curBoard)))
    }
}


function init(file, callback) {
    ctx = document.getElementById("canvas").getContext("2d")
    console.log(ctx)
    var reader = new FileReader();
    reader.readAsText(file[0]);
    reader.onload = function () {
        var rawOutputList = reader.result.split(/[\s\n]/);
        movenum = Number(rawOutputList[0])
        if (movenum > 1000) {
            alert("操作回数が多すぎます")
            return;
        }
        moves = []
        for (var i = 1; i <= movenum * 4; i += 4) {
            var tmp = []
            for (var j = 0; j < 4; j++) {
                tmp.push(Number(rawOutputList[i + j]))

            }
            moves.push(JSON.parse(JSON.stringify(tmp)))
        }
        buildBoardFromMoves()

        var turn = 0;
        var frame = 0;
        (function animloop() {
            frame++;
            if (frame % 50 == 49) {
                frame = 0;
                renderCanvas(turn);
                turn++;
                if (turn == movenum) {
                    turn = 0
                }
            }
            window.requestAnimationFrame(animloop);
        }());
    }
}

