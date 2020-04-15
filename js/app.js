let DB;

const form = document.querySelector('form');
const namePet = document.querySelector('#pet');
const nameClient = document.querySelector('#client');
const phone = document.querySelector('#phone');
const date = document.querySelector('#date');
const time = document.querySelector('#time');
const symptoms = document.querySelector('#symptoms');
const dates = document.querySelector('#dates');
const headingAdmin = document.querySelector('#admin');

document.addEventListener('DOMContentLoaded', () => {
    let createDB = window.indexedDB.open('dates', 1);

    createDB.onerror = function() {
        console.log('Something went wrong');
    }

    createDB.onsuccess = function() {
       // console.log('ok');

        DB = createDB.result;
       // console.log(DB);

       showDates();
    }

    //only runs ONCE

    createDB.onupgradeneeded = function(e){
        //It runs the data base itself!
        let db = e.target.result;

        let objectStore = db.createObjectStore('dates', {keyPath: 'key', autoIncrement: true} );
       // keypath = index

       objectStore.createIndex('pet', 'pet', {unique : false} );
       objectStore.createIndex('client', 'client', {unique : false} );
       objectStore.createIndex('phone', 'phone', {unique : false} );
       objectStore.createIndex('date', 'date', {unique : false} );
       objectStore.createIndex('time', 'time', {unique : false} );
       objectStore.createIndex('symptoms', 'symptoms', {unique : false} );
    }

    form.addEventListener('submit', addData);
    
    function addData(e){
        e.preventDefault();

        const newDate = {
            pet: namePet.value,
            client: nameClient.value,
            phone: phone.value,
            date: date.value,
            time: time.value,
            symptoms: symptoms.value
        }
        //console.log(newDate);

        //we use transactions

        let transaction = DB.transaction(['dates'], 'readwrite');
        let objectStore = transaction.objectStore('dates');
        //console.log(objectStore);

        let request = objectStore.add(newDate);

        request.onsuccess = () => {
            form.reset();
        }

        transaction.oncomplete = () => {
            console.log('Date upgraded');
            showDates();
        }

        transaction.onerror = () => {
            console.log('Oh no :(');
        }

    }

    function showDates() {
        while(dates.firstChild) {
            dates.removeChild(dates.firstChild);
        }

        let objectStore = DB.transaction('dates').objectStore('dates');

        objectStore.openCursor().onsuccess = function(e) {
            let cursor = e.target.result;

            if(cursor) {
                let dateHTML = document.createElement('li');
                dateHTML.setAttribute('data-date-id', cursor.value.key);
                dateHTML.classList.add('list-group-item'); // bootstrap

                dateHTML.innerHTML = `
                <p class="font-weigth-bold">Pet: <span class="font-weight-normal">${cursor.value.pet}</span></p>
                <p class="font-weigth-bold">Client: <span class="font-weight-normal">${cursor.value.client}</span></p>
                <p class="font-weigth-bold">Phone: <span class="font-weight-normal">${cursor.value.phone}</span></p>
                <p class="font-weigth-bold">Date: <span class="font-weight-normal">${cursor.value.date}</span></p>
                <p class="font-weigth-bold">Time: <span class="font-weight-normal">${cursor.value.time}</span></p>
                <p class="font-weigth-bold">Symptoms: <span class="font-weight-normal">${cursor.value.symptoms}</span></p>
                `;

                const deleteButton = document.createElement('button');
                deleteButton.classList.add('delete', 'btn', 'btn-danger');
                deleteButton.innerHTML = '<span aria-hidden="true">X</span> Delete';
                deleteButton.onclick = deleteDate;
                dateHTML.appendChild(deleteButton);

                dates.appendChild(dateHTML);
                cursor.continue();
            } else {
            if(!dates.firstChild) {
                headingAdmin.textContent = 'Add dates to start';
                let list = document.createElement('p');
                list.classList.add('text-center'); // bootstrap
                list.textContent = 'There is no registers';
                dates.appendChild(list);
            } else {
                headingAdmin.textContent = 'Take a look to your dates';
            }
            }
        }
    }

    function deleteDate(e){
        let dateID = Number(e.target.parentElement.getAttribute('data-date-id')) ;

        let transaction = DB.transaction(['dates'], 'readwrite');
        let objectStore = transaction.objectStore('dates');
        //console.log(objectStore);

        let request = objectStore.delete(dateID);

        transaction.oncomplete = () => {
            e.target.parentElement.parentElement.removeChild(e.target.parentElement);
            console.log(`Date deleted ID number: ${dateID}`);

            if(!dates.firstChild) {
                headingAdmin.textContent = 'Add dates to start';
                let list = document.createElement('p');
                list.classList.add('text-center'); // bootstrap
                list.textContent = 'There is no registers';
                dates.appendChild(list);
            } else {
                headingAdmin.textContent = 'Take a look to your dates';
            }
        }
    }
    
        
    
})