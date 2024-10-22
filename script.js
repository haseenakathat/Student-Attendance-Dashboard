
document.addEventListener('DOMContentLoaded', function() {
    const teacherKey = 'teacher';
    const studentKey = 'students';

    const loginForm = document.getElementById('login-form');
    const dashboardSection = document.getElementById('dashboard-section');
    const authSection = document.getElementById('auth-section');
    const studentTableBody = document.getElementById('student-table-body');
    const addStudentForm = document.getElementById('add-student-form');
    const filterButtons = document.querySelectorAll('.filter-buttons button');
    const logoutBtn = document.getElementById('logout');

    let students = JSON.parse(localStorage.getItem(studentKey)) || [];

    if (localStorage.getItem(teacherKey)) {
        showDashboard();
    } else {
        showLoginForm();
    }

    function showLoginForm() {;
        authSection.style.display = 'block';
        dashboardSection.style.display = 'none';
    }

    function showDashboard() {
        authSection.style.display = 'none';
        dashboardSection.style.display = 'block';
        loadStudents();
    }

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('teacher-username').value;
        const password = document.getElementById('teacher-password').value;

        if (username && password) {
            localStorage.setItem(teacherKey, JSON.stringify({ username, password }));
            showDashboard();
        }
    });
    logoutBtn.addEventListener('click', function() {
        localStorage.removeItem(teacherKey);
        showLoginForm();
    });

    addStudentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const studentId = document.getElementById('student-id').value;
        const studentName = document.getElementById('student-name').value;
        const studentClass = document.getElementById('student-class').value;

        const newStudent = {
            id: studentId,
            name: studentName,
            class: studentClass,
            attendance: 'Not Marked'
        };

        students.push(newStudent);
        localStorage.setItem(studentKey, JSON.stringify(students));
        loadStudents();
    });

    function loadStudents(filter = 'All') {
        studentTableBody.innerHTML = ''; 
        students.forEach(student => {
            if (filter === 'All' || student.attendance === filter) {
                const row = document.createElement('tr');
                const statusClass = getStatusClass(student.attendance);
                
                row.innerHTML = `
                    <td>${student.id}</td>
                    <td>${student.name}</td>
                    <td>${student.class}</td>
                    <td class="${statusClass}">${student.attendance}</td>
                    <td>
                        <button class="mark-btn" onclick="markAttendance('${student.id}')">Mark</button>
                        <button class="delete-btn" onclick="deleteStudent('${student.id}')">Delete</button>
                    </td>
                `;
                studentTableBody.appendChild(row);
            }
        });
    }

    function getStatusClass(attendance) {
        return attendance === 'Present' ? 'present' : attendance === 'Absent' ? 'absent' : 'not-marked';
    }

    window.markAttendance = function(id) {
        students = students.map(student => {
            if (student.id === id) {
                student.attendance = student.attendance === 'Present' ? 'Absent' : 'Present';
            }
            return student;
        });
        localStorage.setItem(studentKey, JSON.stringify(students));
        loadStudents();
    };

    window.deleteStudent = function(id) {
        students = students.filter(student => student.id !== id);
        localStorage.setItem(studentKey, JSON.stringify(students));
        loadStudents();
    };

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = button.innerText;
            loadStudents(filter);
        });
    });

    document.getElementById('reset-attendance').addEventListener('click', function() {
        students = students.map(student => ({ ...student, attendance: 'Not Marked' }));
        localStorage.setItem(studentKey, JSON.stringify(students));
        loadStudents();
    });
});
