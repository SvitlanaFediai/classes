'use strict';
import timezones from "./timezone.json" assert { type: "json" };

const timezone = timezones;
console.log(timezone);

class Window {
    constructor() {
        this.window = document.querySelector('.window-overlay');
        this.citiesList = document.querySelector('.cities__list');
        this.searchInput = document.querySelector('.search__input');
        this.timezone = timezone;
        this.sort();
        this.searchBtn();
    }
    
    scroll() {
        this.citiesList.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }

    sort() {
        let sorted = true;
        this.timezone.sort((a, b) => {
            return a.capital != null && b.capital != null ? a.capital.localeCompare(b.capital) : null;
        });
    }

    addTimezone() {
        this.timezone.forEach(country => {
            let newElement = document.createElement('div');
            
            newElement.addEventListener('click', () => {
                this.addCityToDashboard(country);
            });

            newElement.classList.add('cities__item');

            if(country.capital === '' || country.capital === null) {
                newElement.innerHTML = `<h3> ${country.name} </h3>`;
            } else {
                newElement.innerHTML = `<h3>${country.capital}, ${country.name} </h3>`;
            }
           
            this.citiesList.append(newElement);
        })
    }

    searchBtn() {
        this.searchInput.addEventListener('keyup', () => {
            this.searchCity(this.searchInput.value);
        });
    }

    addCityToDashboard(country) {
        console.log(country);
        let clockDashboard = document.querySelector('.clock__dashboard'),
            drawCardTimezone = new Draw();

        clockDashboard.append(drawCardTimezone.render(country));
        
        drawCardTimezone.updateTime();

        this.hide();
    }

    searchCity(city) {
        let cityItems = document.getElementsByClassName('cities__item'),
            filterInput = city.toLowerCase();
        console.log(cityItems.length);

        for(let i = 0; i < cityItems.length; i++) {
            let dataList = cityItems[i].textContent || cityItems[i].innerHTML;
            console.log(dataList);
            if(dataList.toLowerCase().indexOf(filterInput) > -1) {
                cityItems[i].style.display = '';
            } else {
                cityItems[i].style.display = 'none';
            }
        }
    }

    show() {
        this.addTimezone();
        this.window.classList.add('show');
    }

    hide() {
        this.scroll();
        this.searchInput.value = '';
        this.citiesList.innerHTML = '';

        this.window.classList.remove('show');
    }
}

class Draw {
    constructor() {}

    render(country) {
        console.log(country);
        
        let timezone = country.timezones[0],
            divElement = document.createElement('div'),
            countryTitleEl = document.createElement('h3'),
            timeEl = document.createElement('p'),
            dateEl = document.createElement('p'),
            delBtn = document.querySelector('.btn--del').cloneNode(true);

        divElement.classList.add('clock__dashboard--item');
        countryTitleEl.classList.add('clock__dashboard--country');
        timeEl.classList.add('clock__dashboard--time');
        timeEl.setAttribute('timezone', `${timezone}`);
        dateEl.classList.add('clock__dashboard--date');

        /*divElement.innerHTML = `<button type="button" class="btn--del"><i class="fa-regular fa-trash-can"></i></button>
                                <h3 class="clock__dashboard--country">${country.capital}, ${country.name}</h3>
                                <p class="clock__dashboard--time"> ${this.addTime(timezone)} </p>
                                <p class="clock__dashboard--date">${this.addDate(timezone)}<p>
                                `;*/
        countryTitleEl.innerText = `${country.capital}, ${country.name}`;
        
        
        
        dateEl.innerText = this.addDate(timezone);
        timeEl.innerHTML = this.addTime(timezone);

        delBtn.addEventListener('click', () => {
            this.delete();
        })

        divElement.append(delBtn, countryTitleEl, timeEl, dateEl);
        
        return divElement;
    }

    delete() {
        console.log(event.currentTarget.parentElement);
        let el = event.currentTarget.parentElement;
        el.remove();
    }

    addTime(timezone) {
        let date = new Date(),
            newDate = date.toLocaleString('en-US', { timeZone: timezone }),
            time = new Date(newDate),
            h = time.getHours(),
            m = time.getMinutes(),
            s = time.getSeconds(),
            meridies = 'AM';
            
        if (h > 12) {
            h = h - 12;
            meridies = 'PM';
        }
        if (h == 0) {
            h = 12;
        }

        h = (h <= 9) ? '0' + h : h;
        m = (m <= 9) ? '0' + m : m;
        s = (s <= 9) ? '0' + s : s;

        return h + ':' + m + ' ' + ` ${meridies}`;
    }

    addDate(timezone) {
        const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        let date = new Date(),
            newDate = date.toLocaleString('en-US', { timeZone: timezone }),
            time = new Date(newDate),
            weekday = day[time.getDay()],
            curMonth = month[time.getMonth()],
            curDate = time.getDate(),
            curYear = time.getFullYear();

        return weekday + ', ' + curDate + ' ' + curMonth + ' ' + curYear;
    }

    updateTime() {
        let timer = document.querySelectorAll('.clock__dashboard--time');
        
        console.log(timer);

        setInterval(() => {
            timer.forEach(el => {
                let timezone = el.getAttribute('timezone');

                el.innerHTML = this.addTime(timezone);
            });
        }, 1000);
    }
}

let timezoneWindow = new Window(),
    openWindowBtn = document.querySelector('.open--btn'),
    closeWindowBtn = document.querySelector('.close--btn');

openWindowBtn.addEventListener('click', () => {
    timezoneWindow.show();
});

closeWindowBtn.addEventListener('click', () => {
    timezoneWindow.hide();
});




//Show emplotee list
function showEmployees() {
    let employeeList = JSON.parse(localStorage.getItem('employeeList')),
        list = document.querySelector('.list'),
        listItems = document.querySelectorAll('.list__item');

    if(employeeList === null) {
        showWarning('Add employee first');
        return;
    }

    listItems.forEach(item => {
        item.remove();
    });

    let preloader = new Preloader();
    preloader.show();

    employeeList.forEach((item, i) => {
        list.append(new Draw().render(item, i + 1));
    });

    setTimeout(() => {
        preloader.hide();
    }, 500);
   
}
