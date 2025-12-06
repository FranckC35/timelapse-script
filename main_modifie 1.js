const now = new Date();
const localISOTime = new Date(now.getTime() - (now.getTimezoneOffset() * 60000)).toISOString().slice(0,16);

document.body.innerHTML = `
<ul>
    <li><label>Vues</label> 
        <button onclick='switchClass("vue1")'>1</button>
        <button onclick='switchClass("vue2")'>2</button>
        <button onclick='switchClass("vue3")'>3</button>
    </li>
    <li><label>Date et Heure</label> 
        <input type='datetime-local' id='datetime-local' value="${localISOTime}">
    </li>
    <li><button onclick='go()'>Go</button></li>
</ul>
<div class="flex imgsContainer"></div>
`;

const url = "https://s3-eu-west-1.amazonaws.com/timelapsestorage/";
const ids = ["48043a4cf8b55d0019594df225f998b3", "a2cc7835d2d58445e6615efebe5bbeaf","55a4eb940cb294f7cad1235a8e87b7bf"];

const go = () => {
    const datetimeLocal = document.getElementById('datetime-local').value;
    const date = new Date(datetimeLocal);

    const container = document.querySelector(".flex.imgsContainer");
    container.innerHTML = "";

    ids.forEach(cam => {
        let div = document.createElement("div");

        // tester 5 minutes précédentes + minute actuelle
        for (let m = 0; m < 5; m++) {
            let testDate = new Date(date.getTime() - m*60000); // soustraction de m minutes
            const year = testDate.getFullYear();
            const month = String(testDate.getMonth() + 1).padStart(2,'0');
            const day = String(testDate.getDate()).padStart(2,'0');
            const hours = String(testDate.getHours()).padStart(2,'0');
            const minutes = String(testDate.getMinutes()).padStart(2,'0');
            const baseDate = `${year}_${month}_${day}_${hours}_${minutes}_`;

            for (let i = 0; i < 60; i++) {
                const suffix = i < 10 ? `0${i}` : i;
                const lienH = `${url}${cam}/HIGH/${baseDate}${suffix}.jpg`;
                const lienL = `${url}${cam}/LOW/${baseDate}${suffix}.jpg`;

                const a = document.createElement("a");
                a.href = lienH;
                a.target = "_blank";
                a.innerHTML = `
                    <figure class='zoom' onmousemove='zoom(event)' style='background-image: url(${lienH})'>
                        <img src='${lienH}' onerror='this.parentElement.style.display="none"'/>
                    </figure>
                    <img src='${lienH}' style='height:1px!important' onerror='this.style.display="none"'/>
                `;
                div.append(a);
            }
        }
        container.append(div);
    });
}

const zoom = (e) => {
    const zoomer = e.currentTarget;
    const offsetX = e.offsetX ? e.offsetX : e.touches[0].pageX;
    const offsetY = e.offsetY ? e.offsetY : e.touches[0].pageX;
    const x = (offsetX / zoomer.offsetWidth) * 100;
    const y = (offsetY / zoomer.offsetHeight) * 100;
    zoomer.style.backgroundPosition = `${x}% ${y}%`;
}

const switchClass = (className) => {
    document.querySelector('.imgsContainer').className = 'flex imgsContainer ' + className;
};