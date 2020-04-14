let DB;

const form = document.querySelector('form');
const namePet = document.querySelector('#pet');
const nameClient = document.querySelector('#client');
const phone = document.querySelector('#phone');
const date = document.querySelector('#date');
const time = document.querySelector('#time');
const symptoms = document.querySelector('#symptoms');
const dates = document.querySelector('#dates');
const headinAdmin = document.querySelector('#admin');

document.addEventListener('DOMContentLoaded', () => {
    let createDB = window.indexedDB.open('dates', 1);

    createDB.onerror = function() {
        console.log('Something went wrong');
    }

    createDB.onsuccess = function() {
       // console.log('ok');

        DB = createDB.result;
       // console.log(DB);
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
            time: TimeRanges.value,
            symptoms: symptoms.value
        }
        console.log(newDate);

    }
})