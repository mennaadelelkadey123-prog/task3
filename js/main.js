class Student {
    #name;
    #grades;
    #attendance;

    constructor(name, grades, attendance) {
        this.name = name;
        this.grades = grades;
        this.attendance = attendance;
    }

    set name(value) {
        if (!value.trim()) {
            throw new Error("  أدخل اسم الطالب");
        }
        this.#name = value.trim();
    }

    get name() {
        return this.#name;
    }

    set grades(values) {
        if (!Array.isArray(values) || values.length !== 3) {
            throw new Error("يجب إدخال درجات المواد الثلاث");
        }

        const checkedGrades = values.map((grade) => {
            if (grade === "" || !Number.isFinite(Number(grade)) ||
                Number(grade) < 0 || Number(grade) > 100) {
                throw new Error("الدرجات يجب أن تكون من 0 إلى 100");
            }
            return Number(grade);
        });

        this.#grades = checkedGrades;
    }

    get grades() {
        return [...this.#grades];
    }

    set attendance(value) {
        if (value === "" || !Number.isFinite(Number(value)) ||
            Number(value) < 0 || Number(value) > 100) {
            throw new Error("نسبة الحضور يجب أن تكون من 0 إلى 100");
        }
        this.#attendance = Number(value);
    }

    get attendance() {
        return this.#attendance;
    }

    getAverage() {
        return this.#grades.reduce((total, grade) => total + grade, 0) / 3;
    }
}

const studentsList = [];

const studentNameInput = document.getElementById("studentName");
const grade1Input = document.getElementById("grade1");
const grade2Input = document.getElementById("grade2");
const grade3Input = document.getElementById("grade3");
const attendanceInput = document.getElementById("attendance");

const addStudentBtn = document.getElementById("addStudent");
const mercyBtn = document.getElementById("mercyBtn");

const errorBox = document.getElementById("errorBox");
const studentsListDiv = document.getElementById("studentsList");
const reportBox = document.getElementById("reportBox");

function displayStudents() {
    if (studentsList.length === 0) {
        studentsListDiv.innerHTML =
            '<p class="text-muted">لا يوجد طلاب مضافون حتى الآن.</p>';
        return;
    }

    studentsListDiv.innerHTML = studentsList.map((student) => `
        <div class="alert alert-light border mb-2">
            <strong>اسم الطالب:</strong> ${student.name}
            <br>
            <strong>المتوسط:</strong> ${student.getAverage().toFixed(2)}
            <br>
            <strong>الحضور:</strong> ${student.attendance}%
        </div>
    `).join("");
}

addStudentBtn.onclick = function () {
    try {
        errorBox.classList.add("d-none");
        errorBox.textContent = "";

        const student = new Student(
            studentNameInput.value,
            [
                grade1Input.value,
                grade2Input.value,
                grade3Input.value
            ],
            attendanceInput.value
        );

        studentsList.push(student);
        displayStudents();

        studentNameInput.value = "";
        grade1Input.value = "";
        grade2Input.value = "";
        grade3Input.value = "";
        attendanceInput.value = "";

    } catch (error) {
        errorBox.textContent = error.message;
        errorBox.classList.remove("d-none");
    }
};

mercyBtn.onclick = function () {
    const mercyStudents = studentsList.filter((student) => {
        const average = student.getAverage();
        return average >= 40 && average <= 49;
    });

    if (mercyStudents.length === 0) {
        reportBox.innerHTML = `
            <div class="alert alert-warning">
                لا يوجد طلاب تنطبق عليهم شروط لجنة الرأفة.
                <br>
                عدد الطلاب: 0
                <br>
                المتوسط العام: 0
            </div>
        `;
        return;
    }

    const updatedAverages = mercyStudents.map((student) => {
        return student.getAverage() + 5;
    });

    const total = updatedAverages.reduce((sum, average) => {
        return sum + average;
    }, 0);

    const finalAverage = total / updatedAverages.length;

    const names = mercyStudents.map((student) => student.name).join("، ");

    reportBox.innerHTML = `
        <div class="alert alert-success">
            <h5>التقرير النهائي للجنة الرأفة</h5>
            <strong>أسماء الطلاب:</strong> ${names}
            <br>
            <strong>عدد الطلاب:</strong> ${mercyStudents.length}
            <br>
            <strong>المتوسط العام بعد إضافة 5 درجات:</strong>
            ${finalAverage.toFixed(2)}
        </div>
    `;
};

displayStudents();