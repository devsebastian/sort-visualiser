var arr = [];
var play = false;

var delay = 1;
var iter = [0]
var multiplier = 1;

updateDelay(1);
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
    shuffleArray();
    printChartOnly();
}

function updateSizeValue(val) {
    document.getElementById('number-value').innerHTML = "Size: " + val;
}

// function updateRange(val) {
//     val = "arr" + val;
//     arr = [...window[val]];
//     max = Math.max(...arr);
//     iter[0] = 0;
//     printChartOnly();
//     stack = [];
// }

function shuffleArray() {
    iter[0] = 0;
    arr = shuffle(arr);
    printChartOnly();
    stack = [];
}

function shuffle(array) {
    var m = array.length,
        t, i;
    while (m) {
        i = Math.floor(Math.random() * m--);
        t = array[m];
        array[m] = array[i];
        array[i] = t;
    }
    return array;
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
                mergeSortSleep(0, arr.length - 1);
                // mergeSort(0, arr.length - 1);
                // playstack(0);
                break;
        }
    } else {

    }
}

function playstack(i) {
    if (i >= stack.length) {
        finishSort();
        return;
    }
    setTimeout(() => {
        printChartArr(stack[i], i, i);
        playstack(++i);
    }, delay);
}

function printStack(arr, a) {
    var bars = document.getElementsByClassName("bar");
    for (var i = 0; i < bars.length; i++) {
        bars[i].setAttribute("style", "height: " + (arr[i] / max * 100) + "%;");
    }
}

function finishSort() {
    console.log("finished");
    printChartOnly();
    iter[0] = 0;
    // document.getElementById("sort-btn").classList.toggle("disabled");
    document.getElementById("sort-btn").innerHTML = "SORT";
    document.getElementById("sort-btn").removeAttribute("disabled");
    togglePlay();
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

function swap(i1, i2) {
    temp = arr[i1];
    arr[i1] = arr[i2];
    arr[i2] = temp;
}


function printChartOnly() {
    document.getElementsByClassName("table")[0].innerHTML = "";
    var i;
    for (i = 0; i < arr.length; i++) {
        print(arr[i], max);
    }
}

function printChart(curr, swap) {
    document.getElementsByClassName("table")[0].innerHTML = "";
    var i;
    for (i = 0; i < arr.length; i++) {
        document.body.getElementsByClassName("table")[0].innerHTML += ("<div class='chart'><div class=" + (i == curr ? "'current-bar'" : i == swap ? "'swap-bar'" : "'bar'") + " style='height: " + arr[i] / max * 100 + "%;'></div></div>");
    }
}

function print(num, max) {
    document.body.getElementsByClassName("table")[0].innerHTML += ("<div class='chart'><div class='bar' style='height: " + num / max * 100 + "%;'></div></div>");
}



function merge(l, m, r) {
    var L = [],
        R = [],
        i, j, k;
    for (i = l, j = 0; i <= m; i++)
        L.push(arr[i]);
    for (i = m + 1, k = 0; i <= r; i++)
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

}


function mergeSort(l, r) {
    if (l < r) {
        var m = parseInt((l + r) / 2);
        mergeSort(l, m);
        mergeSort(m + 1, r);
        stack.push([...arr]);

        merge(l, m, r);
    }
}


async function mergeSleep(l, m, r) {
    var L = [],
        R = [],
        i, j, k;
    for (i = l, j = 0; i <= m; i++)
        L.push(arr[i]);
    for (i = m + 1, k = 0; i <= r; i++)
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


async function mergeSortSleep(l, r) {

    if (l < r) {
        var m = parseInt((l + r) / 2);
        printChart(r, l);
        await mergeSortSleep(l, m);
        printChart(r, l);
        await mergeSortSleep(m + 1, r);
        printChart(r, l);
        await mergeSleep(l, m, r);
        await sleep(delay / 4);
    }
}


function printChartOnlyArr(arr) {
    if (arr == undefined) return;
    document.getElementsByClassName("table")[0].innerHTML = "";
    var i;
    for (i = 0; i < arr.length; i++) {
        print(arr[i], max);
    }
}

function printChartArr(arr, curr, swap) {
    document.getElementsByClassName("table")[0].innerHTML = "";
    var i;
    for (i = 0; i < arr.length; i++) {
        document.body.getElementsByClassName("table")[0].innerHTML += ("<div class='chart'><div class=" + (i == curr ? "'current-bar'" : i == swap ? "'swap-bar'" : "'bar'") + " style='height: " + arr[i] / max * 100 + "%;'></div></div>");
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}