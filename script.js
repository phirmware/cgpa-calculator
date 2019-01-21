$(document).ready(() => {

});


var creditPoints = [];

$('#submitNum').click(() => {
    // get number of  courses from input
    var numInput = $('#num').val();

    // convert number of courses to type number
    var numberOfCourses = Number(numInput);
    console.log(numberOfCourses);

    // clear content of div.calculate 
    document.getElementById('courses-container').innerHTML = '';

    // append number of inputs that corresponds to number of courses to calculate
    for (var i = 0; i < numberOfCourses; i++) {
        document.getElementById('courses-container').insertAdjacentHTML("beforeend", `<input class="animated fadeIn" placeholder="COURSE ${i + 1}" type="text">  <input type="number" placeholder="CREDIT UNIT" class="credit-unit animated fadeIn">  <input type="text" placeholder="GRADE" class="grade animated fadeIn"><br/><hr/><br/>`);
    }
});

$('#calculate-btn').click(() => {
    for(var i = 0 ; i < document.getElementsByTagName('input').length ; i++){
        if(document.getElementsByTagName('input')[i].value == ''){
            swal('Fill in all inputs');
            return;
        }
    }
    var allGrades = $('.grade');
    for (var i = 0; i < allGrades.length; i++) {
        var creditUnits = document.getElementsByClassName('credit-unit');
        var grades = document.getElementsByClassName('grade');

        if (grades[i].value == 'a' || grades[i].value == 'A') {
            var gradeValue = 5;
            creditPoints.push(Number(creditUnits[i].value) * gradeValue);
        }
        else if (grades[i].value == 'b' || grades[i].value == 'B') {
            var gradeValue = 4;
            creditPoints.push(Number(creditUnits[i].value) * gradeValue);
        }
        else if (grades[i].value == 'c' || grades[i].value == 'C') {
            var gradeValue = 3;
            creditPoints.push(Number(creditUnits[i].value) * gradeValue);
        }
        else if (grades[i].value == 'd' || grades[i].value == 'D') {
            var gradeValue = 2;
            creditPoints.push(Number(creditUnits[i].value) * gradeValue);
        }
        else if (grades[i].value == 'e' || grades[i].value == 'E') {
            var gradeValue = 1;
            creditPoints.push(Number(creditUnits[i].value) * gradeValue);
        }
        else if (grades[i].value == 'f' || grades[i].value == 'F') {
            var gradeValue = 0;
            creditPoints.push(Number(creditUnits[i].value) * gradeValue);
        }
    }

    var total = 0;
    for (var i = 0; i < creditPoints.length; i++) {
        total += creditPoints[i];
    }

    var totalCreditUnit = 0;
    var allCreditUnitInputs = document.getElementsByClassName('credit-unit');
    for(var i = 0 ; i < allCreditUnitInputs.length ; i ++){
        totalCreditUnit += Number(allCreditUnitInputs[i].value)
    }

    var cgpa = total / totalCreditUnit ;
    document.getElementById('result').innerText = cgpa.toFixed(2);


    // reset all variables 
    creditPoints = [];
    totalCreditUnit = 0;
    cgpa = 0;
});