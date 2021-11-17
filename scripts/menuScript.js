const buttonSplit = document.querySelector(".split");

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function newQuest(val) {
    const parent = document.querySelector(".menu-left");
    const qdiv = document.createElement('div');
    qdiv.textContent = val;
    qdiv.classList.add("new-list");
    parent.appendChild(qdiv);
}

buttonSplit.addEventListener("click", function() {
    const input = document.querySelector("input");
    const place = document.querySelector(".block2");
    let values = input.value.split("-");
    for (let i = 0; i < values.length; i++) {
        values[i] = values[i].trim();
    }
    values.sort();
    let numsCount = 0;
    let letsCount = 0;
    for (const value of values) {
        if (isNumeric(value)) {
            continue;
        }
        letsCount++;
        const llist = document.createElement('div');
        llist.textContent =  'a' + letsCount + ': ' + value;
        llist.classList.add("new-list");
        llist.id = value;
        place.appendChild(llist);
        llist.addEventListener("click", function (){
            newQuest(value);
        });
    }
    for (const value of values) {
        if (!isNumeric(value)) {
            break;
        }
        numsCount++;
        const nlist = document.createElement('div');
        nlist.textContent =  'n' + numsCount + ': ' + value;
        nlist.classList.add("new-list");
        nlist.id = value;
        place.appendChild(nlist);
        nlist.addEventListener("click", function (){
            newQuest(value);
        });
    }
});