# 📁 HealthDesk - Frontend Folder Structure

```
frontend/
├── 📂 public/ # Student portal static assets
│ ├── 📂 images/ # Student ID photos, campus events
│ ├── 📂 css/ # Student global styles
│ └── 📂 js/ # Shared JS for student features
│
├── 📂 src/
│ ├── 📂 guest/ # 🟢 Public student pages (no login)
│ │ ├── 📄 index.html # Student homepage
│ │ ├── 📄 about.html # About student health services
│ │ ├── 📄 doctors.html # School clinic staff
│ │ ├── 📄 services.html # Student medical services
│ │ └── 📄 contact.html # Student health hotline
│ │
│ ├── 📂 private/ # 🔒 Student dashboard (authenticated)
│ │ ├── 📂 patients/ # Student health records
│ │ ├── 📂 appointments/ # Student clinic appointment scheduler
│ │ ├── 📂 users/ # Student account management
│ │ ├── 📂 reports/ # Student health reports
│ │ ├── 📂 css/ # Student dashboard styles
│ │ └── 📂 js/ # Student dashboard logic
│ │ └── 📂 api/ # Student data API integration
│ │
│ ├── 📂 shared/ # 🔄 Student reusable components
│ │ ├── 📂 css/ # Student UI common styles
│ │ ├── 📂 js/ # Student utilities & helpers
│ │ ├── 📂 components/ # Student navigation components
│ │ └── 📂 templates/ # Student page templates
│ │
│ └── 📂 assets/ # 🎨 Student global assets
│ ├── 📂 fonts/
│ ├── 📂 icons/
│ └── 📂 images/
│
├── 📄 .env # Student environment config
├── 📄 package.json # Student portal dependencies
└── 📄 README.md # Student documentation

```