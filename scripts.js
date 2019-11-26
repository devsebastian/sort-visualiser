var arr = [];
var play = false;

var delay = 40;
var iter = [0]
var multiplier = 1;

updateDelay(document.getElementById("delay-slider").value);
updateSize(document.getElementById("number-slider").value);
updateSizeValue(document.getElementById("number-slider").value);

var l, r;
async function sort() {
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
                disableSort();
                mergeSort(0, arr.length - 1);
                break;
            case 4:
                disableSort();
                await quickSort(0, arr.length - 1);
                printChartOnly();
                finishSort();
                break;

            case 5:
                disableSort();
                heapSort(arr.length);
                console.log(arr);
                break;
        }
    }
}

function enableSort() {
    document.getElementById("sort-btn").innerHTML = "SORT";
    document.getElementById("sort-btn").removeAttribute("disabled");
}

function disableSort() {
    document.getElementById("sort-btn").innerHTML = "DISABLED";
    document.getElementById("sort-btn").setAttribute("disabled", null);
}


async function partition(l, r) {
    var p = l;
    while (l < r) {
        while (arr[l] < arr[p]) {
            l++;
        }
        while (arr[r] > arr[p]) {
            r--;
        }
        if (l < r)
            swap(l, r);
    }
    swap(p, r);
    return r;
}


async function quickSort(l, r) {
    if (l < r) {
        var p = await partition(l, r);
        printRangeCurr(l, r, p);
        await sleep(delay);
        await quickSort(l, p - 1);
        await quickSort(p + 1, r);
    }
}

function updateDelay(val) {
    delay = val * multiplier;
    document.getElementById('delayValue').innerHTML = "Delay: " + val * multiplier + " ms";
}

function updateSize(val) {
    iter[0] = 0;
    arr = [];
    for (var i = 0; i < val; i++) {
        arr.push(i + 1);
    }
    max = Math.max(...arr);
    arr = shuffle();
    finishSort();
}

function updateSizeValue(val) {
    document.getElementById('number-value').innerHTML = "Size: " + val;
}

function shuffleArray() {
    finishSort();
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


function finishSort() {
    printChartOnly();
    iter[0] = 0;
    enableSort();
    play = false;
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
        printRangeCurr(iter[0], arr.length - 1, pos);
        swap(iter[0], pos);
        if (play) {
            iter[0] += 1;
            setTimeout(() => selectionSort(iter), delay);
        }
    }
}

async function heapify(n, i) {
    var largest = i; // Initialize largest as root 
    var l = 2 * i + 1; // left = 2*i + 1 
    var r = 2 * i + 2; // right = 2*i + 2 
    if (l < n && arr[l] > arr[largest])
        largest = l;
    if (r < n && arr[r] > arr[largest])
        largest = r;
    if (largest != i) {
        swap(i, largest);
        await heapify(n, largest);
    }
}

async function heapSort(n) {
    var i;
    for (i = n / 2 - 1; i >= 0; i--)
        await heapify(n, i);
    printRangeCurr(0, i, n);
    await sleep(delay / 2);
    for (i = n - 1; i >= 0; i--) {
        swap(0, i);
        await heapify(i, 0, i);
        printRangeCurr(0, i, i);
        await sleep(delay / 2);
    }
    printChartOnly();
    finishSort();
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
    printRangeCurr(0, pos, iter[0]);
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
    printRangeCurr(iter[0], arr.length - 1, j);
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

// function printChart(curr, swap) {
//     var i;
//     for (i = 0; i < arr.length; i++) {
//         document.getElementsByClassName("bar")[i].setAttribute("style", "height: " + (arr[i] / max * 100) + "%;");
//         if (i == curr) {
//             document.getElementsByClassName("bar")[i].classList.add("curr");
//         } else if (i == swap) {
//             document.getElementsByClassName("bar")[i].classList.add("swap");
//         } else {
//             document.getElementsByClassName("bar")[i].classList.remove("swap");
//             document.getElementsByClassName("bar")[i].classList.remove("curr");
//         }

//     }
// }

function printRange(l, r) {
    var i;
    for (i = 0; i < arr.length; i++) {
        document.getElementsByClassName("bar")[i].setAttribute("style", "height: " + (arr[i] / max * 100) + "%;");
        if (i >= l && i <= r) {
            document.getElementsByClassName("bar")[i].classList.add("unsorted");
        } else {
            document.getElementsByClassName("bar")[i].classList.remove("curr");
            document.getElementsByClassName("bar")[i].classList.remove("unsorted");
        }

    }
}

function printRangeCurr(l, r, curr) {
    var i;
    for (i = 0; i < arr.length; i++) {
        document.getElementsByClassName("bar")[i].setAttribute("style", "height: " + (arr[i] / max * 100) + "%;");
        if (i >= l && i <= r) {
            document.getElementsByClassName("bar")[i].classList.add("unsorted");
        } else {
            document.getElementsByClassName("bar")[i].classList.remove("curr");
            document.getElementsByClassName("bar")[i].classList.remove("unsorted");
        }
        if (i == curr) {
            document.getElementsByClassName("bar")[i].classList.remove("unsorted");
            document.getElementsByClassName("bar")[i].classList.add("curr");
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
    if (l == 0 && r == arr.length - 1) {
        finishSort();
    }
}


async function mergeSort(l, r) {

    if (l < r) {
        var m = parseInt((l + r) / 2);
        printRange(l, r);
        await sleep(delay / 3);
        await mergeSort(l, m); // merge sort
        printRange(l, m);
        await sleep(delay / 3);
        await mergeSort(m + 1, r);  // merge sOrt
        printRange(m + 1, r);
        await sleep(delay / 3);
        await merge(l, m, r);   // finally merge them
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}