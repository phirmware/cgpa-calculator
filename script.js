const { jsPDF } = window.jspdf;
let creditPoints = [];
let allCreditUnitInputs = []
let gradeValues = []
let numberOfCourses
let numCoursesInPDF
let uploadedADocument = false
let cgpa 

$('#submitNum').click(() => {
    const numInput = $('#num').val();
    numberOfCourses = Number(numInput);

    if(uploadedADocument){
        // remove previously added rows
        document.querySelectorAll('.new-row').forEach(newRow => {
            newRow.remove()
        })
        addNumOfCourses(numberOfCourses)
        window.scrollTo(0,window.scrollY + document.querySelectorAll('.new-row')[0].getBoundingClientRect().top);
        document.getElementById('downloadbtn').disabled = true
        numberOfCourses += numCoursesInPDF
        $('#num').val('')
        return
    }


    // clear content of div.calculate 
    document.getElementById('courses-container').innerHTML = '';

    //clear content to display final result
    document.getElementById('result').innerText = '';

    // append number of inputs that corresponds to number of courses to calculate
    addNumOfCourses(numberOfCourses)

    document.getElementById('downloadbtn').disabled = true

    $('#num').val('')
});

const addNumOfCourses = (numberOfCourses) => {
    //create clear button element
    const clearButton = document.createElement('button')
    clearButton.innerText = 'Clear a row'
    clearButton.style.backgroundColor = 'black'
    clearButton.style.color = 'white'
    clearButton.style.marginBottom = '15px'
    clearButton.classList.add('btn')
    clearButton.classList.add('new-row')
    clearButton.addEventListener('click', function(e){
        e.target.previousElementSibling.classList.add('animated')
        e.target.previousElementSibling.classList.add('fadeOut')
        setTimeout(() => {
            if(document.getElementById('courses-container').childElementCount == 2){
                e.target.previousElementSibling.remove()
                e.target.remove()
            }else{
                e.target.previousElementSibling.remove()
            }
        }, 500);
    })

    if(uploadedADocument){
        for (let i = numCoursesInPDF; i < (numberOfCourses + numCoursesInPDF); i++) {
            document.getElementById('courses-container').insertAdjacentElement("beforeend", createRowElement(i));
        }
        document.getElementById('courses-container').insertAdjacentElement('beforeend', clearButton);

    }else{
       
        for (let i = 0; i < numberOfCourses; i++) {
            document.getElementById('courses-container').insertAdjacentElement("beforeend", createRowElement(i))
        }
        document.getElementById('courses-container').insertAdjacentElement('beforeend', clearButton);
    }
  
}

function createRowElement(i){
        const containerDiv = document.createElement('div')
        if(uploadedADocument){
            containerDiv.classList.add('new-row')
        }
        const creditUnitInput = document.createElement('input')
        creditUnitInput.classList.add('grade')
        creditUnitInput.classList.add('animated')
        creditUnitInput.classList.add('fadeIn')
        creditUnitInput.setAttribute('type', 'text')
        creditUnitInput.setAttribute('placeholder', 'GRADE')
        creditUnitInput.addEventListener('change', function () {
          this.value = this.value.toUpperCase()
       })
       containerDiv.insertAdjacentHTML("beforeend", `<input class="course animated fadeIn" placeholder="COURSE ${i + 1}" type="text">  <input type="number" placeholder="CREDIT UNIT" class="credit-unit animated fadeIn">`)
       containerDiv.insertAdjacentElement('beforeend', creditUnitInput)
       containerDiv.insertAdjacentHTML('beforeend', ' <hr/>')
       return containerDiv
    
}

$('#calculate-btn').click(() => {
    // reset all variables 
    creditPoints = [];
    allCreditUnitInputs = [];
    gradeValues = []
      
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
            return;
        }
    }


    var total = creditPoints.reduce((acc, next) => acc + next)
    var totalCreditUnit = allCreditUnitInputs.reduce((acc, next) => acc + next)


    cgpa = total / totalCreditUnit;
    document.getElementById('result').innerText = cgpa.toFixed(2);
    document.getElementById('downloadbtn').disabled = false

});

$('#downloadbtn').click(downloadPdf)

function downloadPdf(){
    for (var i = 0; i < document.getElementsByClassName('fadeIn').length; i++) {
        if (document.getElementsByClassName('fadeIn')[i].value == '') {
            swal('Fill in inputs and calculate your cgpa first');
            return;
        }
    }

    // insert calculated values in a tabulated format
    for (var i = 0; i <= numberOfCourses; i++) {
        if (i === numberOfCourses) {
            document.querySelector('tbody').insertAdjacentHTML('beforeend', `<tr><td>Your CGPA is ${cgpa.toFixed(2)}</td></tr>`)
            document.querySelector('tr').style.fontWeight = 'bold'
        } else {
            var courses = document.getElementsByClassName('course');
            var creditUnits = document.getElementsByClassName('credit-unit');
            var grades = document.getElementsByClassName('grade');
            document.querySelector('tbody').insertAdjacentHTML('beforeend', `<tr><td>${courses[i].value}</td><td>${creditUnits[i].value}</td><td>${grades[i].value.toUpperCase()}</td><td>${gradeValues[i]}</td><td>${creditPoints[i]}</td></tr>`)
        }
    }

    const doc = new jsPDF()
    doc.autoTable({ html: '#myspreadsheet' })
    doc.save('mySpreadsheet.pdf')

    document.querySelector('tbody').textContent = ''
}


function findQualityPoint(gradeValue,creditUnit){
    gradeValues.push(gradeValue)
    allCreditUnitInputs.push(Number(creditUnit.value))
    var qualityPoint = Number(creditUnit.value) * gradeValue
    creditPoints.push(qualityPoint);
}



var BASE64_MARKER = ';base64,'

function ExtractText() {
    var input = document.getElementById("file-id");
    var fReader = new FileReader();
    fReader.readAsDataURL(input.files[0]);
    fReader.onloadend = function (event) {
        convertDataURIToBinary(event.target.result);
    }
}


function convertDataURIToBinary(dataURI) {

    var base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
    var base64 = dataURI.substring(base64Index);
    var raw = window.atob(base64);
    var rawLength = raw.length;
    var array = new Uint8Array(new ArrayBuffer(rawLength));

    for (var i = 0; i < rawLength; i++) {
        array[i] = raw.charCodeAt(i);
    }
    pdfAsArray(array)

}

function getPageText(pageNum, PDFDocumentInstance) {
    // Return a Promise that is solved once the text of the page is retrieved
    return new Promise(function (resolve, reject) {
        PDFDocumentInstance.getPage(pageNum).then(function (pdfPage) {
            // The main trick to obtain the text of the PDF page, use the getTextContent method
            pdfPage.getTextContent().then(function (textContent) {
                var textItems = textContent.items;
                var finalString = "";

                // Concatenate the string of the item to the final string
                for (var i = 0; i < textItems.length; i++) {
                    var item = textItems[i];

                    finalString += item.str + " ";
                }

                // Solve promise with the text retrieved from the page
                resolve(finalString);
            });
        });
    });
}

function pdfAsArray(pdfAsArray) {

    PDFJS.getDocument(pdfAsArray).then(function (pdf) {

        var pdfDocument = pdf;
        // Create an array that will contain our promises
        var pagesPromises = [];

        for (var i = 0; i < pdf.pdfInfo.numPages; i++) {
            // Required to prevent that i is always the total of pages
            (function (pageNumber) {
                // Store the promise of getPageText that returns the text of a page
                pagesPromises.push(getPageText(pageNumber, pdfDocument));
            })(i + 1);
        }

        // Execute all the promises
        Promise.all(pagesPromises).then(function (pagesText) {
            for (var pageNum = 0; pageNum < pagesText.length; pageNum++) {
                  const allValues =  pagesText[pageNum].split(' ')
                  const endValue = allValues.length - 9
                  const selectedValues = allValues.slice(6,endValue)
                  for(let i = 3; i<selectedValues.length; i += 3){
                      selectedValues.splice(i,2)
                  }
                   numCoursesInPDF = selectedValues.length / 3
                   document.getElementById('courses-container').innerHTML = '';

                  for (var i = 1; i <= numCoursesInPDF; i++) {
                    document.getElementById('courses-container').insertAdjacentHTML("beforeend", `<input class="course animated fadeIn" placeholder="COURSE ${i + 1}" type="text">  <input type="number" placeholder="CREDIT UNIT" class="credit-unit animated fadeIn">  <input type="text" placeholder="GRADE" class="grade animated fadeIn"<br/><hr/><br/>`);
                }
                 const inputs = document.querySelectorAll('.fadeIn')
                 for(let i = 0;i < inputs.length; i++){
                     inputs[i].value = selectedValues[i]
                 }
            }
        });
        uploadedADocument = true

    }, function (reason) {
        // PDF loading error
        console.error(reason);
    });
}
