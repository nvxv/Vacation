function check() {
    var date1 = new Date(document.getElementById('checkin').value);
    var date2 = new Date(document.getElementById('checkout').value);
    var diff = Math.abs(date2.getTime() - date1.getTime());
    var dayDiff = Math.ceil(diff / (1000 * 3600 * 24));  

    if (date1 > date2){ 
        alert("Check-out date must be after check-in date!")
    }
    else {
        calculate();
    }	
}
