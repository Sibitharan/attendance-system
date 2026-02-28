// ================= PAGE SWITCHING =================
function showPage(pageId){
    const pages = document.querySelectorAll(".page");
    pages.forEach(page => page.style.display = "none");

    document.getElementById(pageId).style.display = "block";
}

// ================= ADMIN LOGIN =================
function adminLogin(){
    const username = document.getElementById("adminUsername").value;
    const password = document.getElementById("adminPassword").value;

    // Default Admin Credentials
    if(username === "admin" && password === "admin123"){
        window.location.href = "admin.html";
    } else {
        document.getElementById("adminError").innerText = "Invalid Admin Credentials!";
    }
}

// ================= STUDENT LOGIN =================
function studentLogin(){

    const username = document.getElementById("studentUsername").value;
    const password = document.getElementById("studentPassword").value;

    fetch("http://3.111.38.83:5000/student/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: username,
            password: password
        })
    })
    .then(response => {
        if(response.ok){
            localStorage.setItem("roll_no", username);
            window.location.href = "student.html";
        } else {
            document.getElementById("studentError").innerText = "Invalid Credentials!";
        }
    })
    .catch(error => {
        console.log(error);
    });
}
window.onload = function(){

    const roll_no = localStorage.getItem("roll_no");

    if(!roll_no) return;

    fetch("http://3.111.38.83:5000/student/report/" + roll_no)
    .then(res => res.json())
    .then(data => {

        const table = document.getElementById("studentReportTable");

        let present = 0;
        let absent = 0;

        data.forEach(item => {

            const row = table.insertRow();
            row.insertCell(0).innerText = item.timestamp;
            row.insertCell(1).innerText = item.status;

            if(item.status === "Present"){
                present++;
            } else {
                absent++;
            }
        });

        // Update stats
        document.querySelector(".stats .glass:nth-child(1) p").innerText = present;
        document.querySelector(".stats .glass:nth-child(2) p").innerText = absent;

        let percentage = 0;
        if((present + absent) > 0){
            percentage = ((present / (present + absent)) * 100).toFixed(2);
        }

        document.querySelector(".stats .glass:nth-child(3) p").innerText = percentage + "%";
    });
}

// ================= LOGOUT =================
function logout(){
    window.location.href = "index.html";
}

// ================= FILTER REPORTS =================
function filterAdminReports(){
    const selectedDate = document.getElementById("adminFilterDate").value;
    const rows = document.querySelectorAll("#adminReportTable tr[data-date]");

    rows.forEach(row => {
        const rowDate = row.getAttribute("data-date");

        if(selectedDate === "" || rowDate === selectedDate){
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });
}

// ================= DOWNLOAD CSV =================
function downloadAdminCSV(){
    const rows = document.querySelectorAll("#adminReportTable tr");
    let csvContent = "";

    rows.forEach(row => {
        const cols = row.querySelectorAll("th, td");
        let rowData = [];

        cols.forEach(col => {
            rowData.push(col.innerText);
        });

        csvContent += rowData.join(",") + "\n";
    });

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", "admin_report.csv");
    a.click();
}

// ================= STUDENT FILTER =================
function filterStudentReports(){
    const selectedDate = document.getElementById("studentFilterDate").value;
    const rows = document.querySelectorAll("#studentReportTable tr[data-date]");

    rows.forEach(row => {
        const rowDate = row.getAttribute("data-date");

        if(selectedDate === "" || rowDate === selectedDate){
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });
}

// ================= STUDENT DOWNLOAD CSV =================
function downloadStudentCSV(){
    const rows = document.querySelectorAll("#studentReportTable tr");
    let csvContent = "";

    rows.forEach(row => {
        const cols = row.querySelectorAll("th, td");
        let rowData = [];

        cols.forEach(col => {
            rowData.push(col.innerText);
        });

        csvContent += rowData.join(",") + "\n";
    });

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", "student_report.csv");
    a.click();
}