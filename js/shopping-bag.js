(function () {

    function countChange(e) {
        let target = e && e.target || e.srcElement;
        let btn = target.getAttribute('data-count');

        if (!btn) return;

        if (btn === "plus") {
            target.previousElementSibling.innerHTML++;
        }

        if (btn === "minus") {
            target.nextElementSibling.innerHTML === "1" ? target.nextElementSibling.innerText = 1 : target.nextElementSibling.innerHTML--;
        }
    }

    function initCount() {
        const count = document.querySelectorAll('.count');

        for (let i = 0; i < count.length; i++) {
            count[i].addEventListener('click', countChange);
        }
    }

   setTimeout(function () { initCount(); }, 0)
})();