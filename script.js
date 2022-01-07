const { jsPDF } = window.jspdf;
let creditPoints = [];
let allCreditUnitInputs = []
let gradeValues = []
let numberOfCourses
let result
let qualityPoints
let gradePoints
let numCoursesInPDF
let uploadedADocument = false

$('#submitNum').click(() => {
    const numInput = $('#num').val();
    // convert number of courses to type number
    numberOfCourses = Number(numInput);
    if(uploadedADocument){
        addNumOfCourses(numberOfCourses)
        document.getElementById('downloadbtn').disabled = true
        numberOfCourses += numCoursesInPDF
        return numberOfCourses
    }


    // clear content of div.calculate 
    document.getElementById('courses-container').innerHTML = '';

    //clear content to display final result
    document.getElementById('result').innerText = '';

    // append number of inputs that corresponds to number of courses to calculate
    addNumOfCourses(numberOfCourses)
    document.getElementById('downloadbtn').disabled = true
    return numberOfCourses
});

const addNumOfCourses = (numberOfCourses) => {
    for (var i = 0; i < numberOfCourses; i++) {
        document.getElementById('courses-container').insertAdjacentHTML("beforeend", `<input class="course animated fadeIn" placeholder="COURSE ${i + 1}" type="text">  <input type="number" placeholder="CREDIT UNIT" class="credit-unit animated fadeIn">  <input type="text" placeholder="GRADE" class="grade animated fadeIn"<br/><hr/><br/>`);
    }
  
}

$('#calculate-btn').click(() => {
    for (var i = 0; i < document.getElementsByClassName('fadeIn').length; i++) {
        if (document.getElementsByClassName('fadeIn')[i].value == '') {
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
            findQualityPoint(gradeValue, creditUnits[i])
        }
        else if (grades[i].value == 'b' || grades[i].value == 'B') {
            var gradeValue = 4;
            findQualityPoint(gradeValue, creditUnits[i])

        }
        else if (grades[i].value == 'c' || grades[i].value == 'C') {
            var gradeValue = 3;
            findQualityPoint(gradeValue, creditUnits[i])

        }
        else if (grades[i].value == 'd' || grades[i].value == 'D') {
            var gradeValue = 2;
            findQualityPoint(gradeValue, creditUnits[i])

        }
        else if (grades[i].value == 'e' || grades[i].value == 'E') {
            var gradeValue = 1;
            findQualityPoint(gradeValue, creditUnits[i])

        }
        else if (grades[i].value == 'f' || grades[i].value == 'F') {
            var gradeValue = 0;
            findQualityPoint(gradeValue,creditUnits[i])

        }
        else {
            swal('Invalid Entry');
            // reset all variables 
            creditPoints = [];
            allCreditUnitInputs = [];
            gradeValues = []
            cgpa = 0
            return;
        }
    }
    qualityPoints = creditPoints
    gradePoints = gradeValues
    var total = creditPoints.reduce((acc, next) => acc + next)
    var totalCreditUnit = allCreditUnitInputs.reduce((acc, next) => acc + next)


    var cgpa = total / totalCreditUnit;
    result = cgpa
    document.getElementById('result').innerText = cgpa.toFixed(2);
    document.getElementById('downloadbtn').disabled = false

    // reset all variables 
    creditPoints = [];
    allCreditUnitInputs = [];
    gradeValues = []
    cgpa = 0;
    uploadedADocument = false

});

$('#downloadbtn').click(() => {
    for (var i = 0; i < document.getElementsByClassName('fadeIn').length; i++) {
        if (document.getElementsByClassName('fadeIn')[i].value == '') {
            swal('Fill in inputs and calculate your cgpa first');
            return;
        }
    }

    for (var i = 0; i <= numberOfCourses; i++) {
        if (i === numberOfCourses) {
            document.querySelector('tbody').insertAdjacentHTML('beforeend', `<tr><td>Your CGPA is ${result.toFixed(2)}</td></tr>`)
            document.querySelector('tr').style.fontWeight = 'bold'
        } else {
            var courses = document.getElementsByClassName('course');
            var creditUnits = document.getElementsByClassName('credit-unit');
            var grades = document.getElementsByClassName('grade');
            document.querySelector('tbody').insertAdjacentHTML('beforeend', `<tr><td>${courses[i].value}</td><td>${creditUnits[i].value}</td><td>${grades[i].value.toUpperCase()}</td><td>${gradeValues[i]}</td><td>${qualityPoints[i]}</td></tr>`)
        }
    }

    const doc = new jsPDF()
    doc.autoTable({ html: '#myspreadsheet' })
    doc.save('mySpreadsheet.pdf')

    document.querySelector('tbody').textContent = ''
})


function findQualityPoint(gradeValue,creditUnit){
    gradeValues.push(gradeValue)
    allCreditUnitInputs.push(Number(creditUnit.value))
    var qualityPoint = Number(creditUnit.value) * gradeValue
    creditPoints.push(qualityPoint);
    
}

