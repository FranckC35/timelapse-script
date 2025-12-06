const now = new Date();
const localISOTime = new Date(now.getTime() - (now.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);

document.body.innerHTML = `
    <ul>
        <li><label>Vues</label> <button onclick='switchClass("vue1")'>1</button><button onclick='switchClass("vue2")'>2</button><button onclick='switchClass("vue3")'>3</button>
        <li><label>Date et Heure</label> <input type='datetime-local' id='datetime-local' value="${localISOTime}"></li>
        <li><button onclick='go()'>Go</button></li>
    </ul>
    <div class="flex imgsContainer"></div>
`;

const go = () => {
    const datetimeLocal = document.getElementById('datetime-local').value;
    const date = new Date(datetimeLocal);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Les mois commencent à 0
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(Math.floor(date.getMinutes() / 5) * 5).padStart(2, '0');
    
    const laDate = `${year}_${month}_${day}_${hours}_${minutes}_`;
    console.log(laDate);    

    const url = "https://s3-eu-west-1.amazonaws.com/timelapsestorage/";
    const ids = ["48043a4cf8b55d0019594df225f998b3", "a2cc7835d2d58445e6615efebe5bbeaf","55a4eb940cb294f7cad1235a8e87b7bf"];
    
    const container = document.querySelector(".flex.imgsContainer");
    container.innerHTML = "";

    ids.forEach(id => {
        console.log(id);
        cam = id;
        div = document.createElement("div");
        for (let i = 0; i < 59; i++) {
            const a = document.createElement("a");
            const suffix = i < 10 ? `0${i}` : i;
            const lienH = `${url}${cam}/HIGH/${laDate}${suffix}.jpg`;
            const lienL = `${url}${cam}/LOW/${laDate}${suffix}.jpg`;

            a.href = lienH;
            a.target = "_blank";
            a.innerHTML = `
                <figure class='zoom' onmousemove='zoom(event)' style='background-image: url(${lienH})'>
                    <img src='${lienH}' onerror='this.parentElement.style.display="none"'/>
                </figure>
                <img src='${lienH}' style='height: 1px!important' onerror='this.style.display="none"'/>
            `;
            div.append(a);
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

go();

const switchClass = (className) => {
    document.querySelector('.imgsContainer').className = 'flex imgsContainer ' + className;
};
