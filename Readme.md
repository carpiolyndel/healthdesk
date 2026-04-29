## Project Structure

```
frontend/
│
├── public/
│   ├── images/
│   │   ├── logo.png
│   │   ├── clinic.jpg
│   │   └── doctors/
│   │       ├── doctor1.jpg
│   │       └── doctor2.jpg
│   ├── css/
│   │   └── global.css
│   ├── js/
│   │   └── shared.js
│   └── favicon.ico
│
├── src/
│   │
│   ├── guest/                 # Public/Guest pages
│   │   ├── index.html
│   │   ├── about.html
│   │   ├── doctors.html
│   │   ├── contact.html
│   │   ├── hours.html
│   │   ├── services.html
│   │   ├── css/
│   │   │   ├── guest-style.css
│   │   │   └── responsive.css
│   │   ├── js/
│   │   │   ├── guest.js
│   │   │   ├── api.js
│   │   │   └── components.js
│   │   └── assets/
│   │       ├── icons/
│   │       └── images/
│   │
│   ├── private/               # Authenticated/Admin pages
│   │   ├── index.html
│   │   ├── login.html
│   │   ├── patients/
│   │   │   ├── list.html
│   │   │   ├── add.html
│   │   │   ├── view.html
│   │   │   ├── edit.html
│   │   │   ├── medical-history.html
│   │   │   └── search.html
│   │   ├── appointments/
│   │   │   ├── calendar.html
│   │   │   ├── schedule.html
│   │   │   ├── list.html
│   │   │   ├── cancel.html
│   │   │   └── reschedule.html
│   │   ├── users/
│   │   │   ├── list.html
│   │   │   ├── add.html
│   │   │   ├── edit.html
│   │   │   └── roles.html
│   │   ├── reports/
│   │   │   ├── clinic-report.html
│   │   │   ├── appointment-report.html
│   │   │   └── patient-report.html
│   │   ├── css/
│   │   │   ├── private-style.css
│   │   │   ├── dashboard.css
│   │   │   ├── forms.css
│   │   │   ├── table.css
│   │   │   └── modal.css
│   │   ├── js/
│   │   │   ├── auth.js
│   │   │   ├── dashboard.js
│   │   │   ├── patients.js
│   │   │   ├── appointments.js
│   │   │   ├── users.js
│   │   │   ├── reports.js
│   │   │   ├── validation.js
│   │   │   ├── confirmation-modal.js
│   │   │   └── api/
│   │   │       ├── authAPI.js
│   │   │       ├── patientAPI.js
│   │   │       ├── appointmentAPI.js
│   │   │       ├── userAPI.js
│   │   │       └── reportAPI.js
│   │   └── assets/
│   │       ├── icons/
│   │       ├── images/
│   │       └── loading.gif
│   │
│   ├── shared/                # Shared components & utilities
│   │   ├── css/
│   │   │   ├── common.css
│   │   │   ├── navbar.css
│   │   │   ├── footer.css
│   │   │   └── buttons.css
│   │   ├── js/
│   │   │   ├── config.js
│   │   │   ├── utils.js
│   │   │   ├── error-handler.js
│   │   │   └── session-manager.js
│   │   ├── components/
│   │   │   ├── navbar.html
│   │   │   ├── sidebar.html
│   │   │   ├── footer.html
│   │   │   └── modal.html
│   │   └── templates/
│   │       ├── header-template.html
│   │       └── footer-template.html
│   │
│   └── assets/                # Global assets
│       ├── fonts/
│       ├── icons/
│       └── images/
│
├── .env                       # Environment variables
├── .env.guest                 # Guest environment config
├── .env.private               # Private/Admin environment config
├── package.json               # Dependencies
└── README.md                  # Documentation
```