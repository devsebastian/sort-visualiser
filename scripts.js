var arr = [];
var play = false;

var delay = 40;
var iter = [0]
var multiplier = 1;

updateDelay(document.getElementById("delay-slider").value);
updateSize(document.getElementById("number-slider").value);
updateSizeValue(document.getElementById("number-slider").value);

var stack = []

function updateDelay(val) {
    delay = val * multiplier;
    document.getElementById('delayValue').innerHTML = "Delay: " + val * multiplier + " ms";
}

function updateSize(val) {
    iter[0] = 0;
    stack = [];
    arr = [];
    for (var i = 0; i < val; i++) {
        arr.push(i + 1);
    }
    max = Math.max(...arr);
    arr = shuffle();
    printChartOnly();
}

function updateSizeValue(val) {
    document.getElementById('number-value').innerHTML = "Size: " + val;
}

function shuffleArray(){
    arr = shuffle();
    printChartOnly();
}

function shuffle() {
    var m = arr.length, t, i;
    while (m) {
        i = Math.floor(Math.random() * m--);
        t = arr[m];
        arr[m] = arr[i];
        arr[i] = t;
    }
    return arr;
}

function togglePlay() {
    play = !play;
    document.getElementById("sort-btn").innerHTML = play ? "Pause" : "Sort";
}

function sort() {
    togglePlay();
    if (play) {
        delay = document.getElementById("delay-slider").value * multiplier;
        var selection = document.getElementsByTagName("select")[0].selectedIndex
        switch (parseInt(selection)) {
            case 0:
                selectionSort(iter);
                break;
            case 1:
                BubbleSort(iter);
                break;
            case 2:
                iter[0] += 1;
                insertionSort(iter);
                break;
            case 3:
                document.getElementById("sort-btn").innerHTML = "DISABLED";
                document.getElementById("sort-btn").toggleAttribute("disabled");
                mergeSort(0, arr.length - 1);
                break;
        }
    } 
}

function finishSort() {
    console.log("finished");
    printChartOnly();
    iter[0] = 0;
    document.getElementById("sort-btn").innerHTML = "SORT";
    document.getElementById("sort-btn").removeAttribute("disabled");
    togglePlay();
}


function swap(i1, i2) {
    temp = arr[i1];
    arr[i1] = arr[i2];
    arr[i2] = temp;
}

function selectionSort(iter) {
    var j, pos;
    if (iter[0] >= arr.length) {
        finishSort();
        return;
    } else {
        pos = iter[0];
        for (j = iter[0] + 1; j < arr.length; j++) {
            if (arr[j] < arr[pos]) {
                pos = j;
            }
        }
        printChart(iter[0], pos);
        swap(iter[0], pos);
        if (play) {
            iter[0] += 1;
            setTimeout(() => selectionSort(iter), delay);
        }
    }
}


function BubbleSort(iter) {
    if (iter[0] >= arr.length - 1) {
        finishSort();
        return;
    }
    var pos = 0;
    for (j = 0; j < arr.length; j++) {
        if (arr[j] < arr[j - 1]) {
            swap(j, j - 1);
            pos = j;
        }
    }
    printChart(iter[0], pos);
    if (play) {
        iter[0] += 1;
        setTimeout(() => BubbleSort(iter), delay);
    }
}

function insertionSort(iter) {
    if (iter[0] >= arr.length) {
        finishSort();
        return;
    }
    var key = arr[iter[0]];
    var j = iter[0] - 1;
    while (j >= 0 && arr[j] > key) {
        arr[j + 1] = arr[j];
        j = j - 1;
    }
    arr[j + 1] = key;
    printChart(iter[0], j);
    if (play) {
        iter[0] += 1;
        setTimeout(() => insertionSort(iter), delay);
    }
}

function printChartOnly() {
    document.getElementsByClassName("table")[0].innerHTML = "";
    var i;
    for (i = 0; i < arr.length; i++) {
        print(arr[i], max);
    }
}

function printChart(curr, swap) {
    var i;
    for (i = 0; i < arr.length; i++) {
        document.getElementsByClassName("bar")[i].setAttribute("style", "height: " + (arr[i] / max * 100) + "%;");
        if (i == curr) {
            document.getElementsByClassName("bar")[i].classList.toggle("curr");
        } else if (i == swap) {
            document.getElementsByClassName("bar")[i].classList.toggle("swap");
        } else {
            document.getElementsByClassName("bar")[i].classList.remove("swap");
            document.getElementsByClassName("bar")[i].classList.remove("curr");
        }
        
    }
}

function print(num, max) {
    document.body.getElementsByClassName("table")[0].innerHTML += ("<div class='chart'><div class='bar' style='height: " + num / max * 100 + "%;'></div></div>");
}

async function merge(l, m, r) {
    var L = [],
        R = [],
        i, j, k;
    for (i = l; i <= m; i++)
        L.push(arr[i]);
    for (i = m + 1; i <= r; i++)
        R.push(arr[i]);

    for (i = l, j = 0, k = 0; i <= r && j <= m - l && k <= r - m - 1; i++) {
        if (L[j] < R[k])
            arr[i] = L[j++];
        else
            arr[i] = R[k++];
    }
    while (j <= m - l) {
        arr[i++] = L[j++];
    }
    while (k <= r - m - 1) {
        arr[i++] = R[k++];
    }
    await sleep(delay / 4);
    printChart(r, l);
    if (l == 0 && r == arr.length - 1) {
        finishSort();
    }
}


async function mergeSort(l, r) {

    if (l < r) {
        var m = parseInt((l + r) / 2);
        printChart(r, l);
        await mergeSort(l, m);
        printChart(r, l);
        await mergeSort(m + 1, r);
        printChart(r, l);
        await merge(l, m, r);
        await sleep(delay / 4);
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}