function handleOutputFiles(file, callback) {
    var ctx = document.getElementById("canvas").getContext("2d");
    ctx.strokeStyle = "rgb(0,0,0)";
    var reader = new FileReader();
    reader.readAsText(file[0]);
    reader.onload = function () {
        var rawOutputList = reader.result.split(/[\s\n]/);
        var lines = Number(rawOutputList[0]);
        if (isNaN(lines)) {
            /*TODO:err@数ではありません*/
        }
        if (lines != rawOutputList.length * 4 - 1) {
            /*TODO:err@数が一致しません*/
        }
        for (var i = 1; i < lines; i += 4) {
            var y1 = Number(rawOutputList[i]);
            var x1 = Number(rawOutputList[i + 1]);
            var y2 = Number(rawOutputList[i + 2]);
            var x2 = Number(rawOutputList[i + 3]);
            /*TODO:非数のときのハンドリング */
            ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
        }
        console.log(lines);
    }
}

