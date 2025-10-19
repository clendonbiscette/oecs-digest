# OECS Education Statistical Digest - Interactive Dashboard

A comprehensive web-based platform for collecting, analyzing, and visualizing education statistics across OECS member states.

## 🌟 Overview

This project digitizes the OECS Education Statistical Digest, providing:
- **Interactive dashboards** for viewing education statistics
- **Data entry system** for member state statisticians
- **AI-powered analysis** using GPT-4o
- **Secure, role-based access** with country-specific data isolation

## 🏗️ Architecture

### Frontend
- **Next.js 15** (App Router)
- **React 18** with TypeScript
- **Tailwind CSS** + Shadcn/ui components
- **Recharts** for data visualization

### Backend & Database
- **Supabase** (PostgreSQL + Authentication)
- **Row Level Security** for data isolation
- **Next.js API Routes** for AI chat

### AI Integration
- **OpenAI GPT-4o** via Vercel AI SDK
- Context-aware educational data analysis

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- A Supabase account (free tier works)
- Git installed

### 1. Clone the Repository

```bash
git clone https://github.com/clendonbiscette/oecs-digest.git
cd oecs-digest
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

Follow the detailed guide in [`SUPABASE_SETUP_GUIDE.md`](./SUPABASE_SETUP_GUIDE.md)

**Quick steps:**
1. Create a new project at [supabase.com](https://supabase.com)
2. Run the SQL schema: Copy contents of `supabase-schema.sql` into Supabase SQL Editor
3. Get your credentials from Project Settings → API

### 4. Configure Environment Variables

Create `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
OPENAI_API_KEY=your-openai-api-key
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
oecs-digest/
├── app/
│   ├── auth/                  # Authentication pages (login, signup)
│   ├── data-entry/            # Data entry system for statisticians
│   │   ├── institutions/      # ✅ Institutions form
│   │   ├── enrollment/        # 🚧 Student enrollment (TODO)
│   │   └── ...                # 🚧 Other worksheets (TODO)
│   ├── dashboard/             # Public dashboard (institutions, enrollment)
│   ├── analytics/             # 🚧 Analytics page (TODO)
│   ├── comparisons/           # 🚧 Country comparisons (TODO)
│   ├── trends/                # 🚧 Trends analysis (TODO)
│   └── api/chat/              # AI chat endpoint
├── components/
│   ├── ui/                    # Shadcn/ui components
│   ├── charts/                # Recharts wrappers
│   └── navbar.tsx             # Navigation component
├── lib/
│   ├── supabase.ts            # Supabase client & helpers
│   ├── database.ts            # Legacy Neon DB (optional)
│   └── data-service.ts        # Data fetching functions
├── DIGEST_WEB/                # Excel template & analysis
│   └── Blank OECS MS Template.xlsx
├── supabase-schema.sql        # Database schema
├── middleware.ts              # Route protection
└── README.md                  # This file
```

## 👥 User Roles

### Statistician
- Assigned to a specific OECS member state
- Can enter/edit data for their country only
- Submit data for approval

### Admin
- View and manage all countries' data
- Approve/reject submissions
- User management

### Viewer
- Read-only access to all data
- Export and analysis capabilities

## 🎯 Features

### ✅ Completed
- Interactive public dashboard (institutions, enrollment)
- Database schema with 9 tables
- Authentication system (login, signup)
- Data entry interface with 1/8 worksheets complete
- Row Level Security (RLS) for data isolation
- AI chat interface for data analysis

### 🚧 In Progress
- 7 remaining data entry worksheets
- Auto-save functionality
- Form validation
- Submission workflow (draft → submit → approve)

### 📋 Planned
- Admin dashboard
- Excel import/export
- Email notifications
- Bulk operations
- Mobile optimization

## 📊 Data Coverage

### OECS Member States (9)
- Anguilla
- Antigua and Barbuda
- Dominica
- Grenada
- Montserrat
- Saint Kitts and Nevis
- Saint Lucia
- Saint Vincent and the Grenadines
- British Virgin Islands

### Education Levels
- Early Childhood (daycare, preschool)
- Primary (K-6)
- Secondary (Forms 1-6)
- Special Education
- TVET
- Post-Secondary

### Data Categories (8 Worksheets)
1. **Institutions** ✅ - Institution counts by type
2. **Student Enrolment** 🚧 - Enrollment by level, gender, age
3. **Staff Qualifications** 🚧 - Teacher qualifications & PD
4. **Staff Demographics** 🚧 - Age & years of service
5. **Internal Efficiency** 🚧 - Repeaters, dropouts, ratios
6. **Systems Output** 🚧 - Exam results (CCSLC, CSEC, CAPE)
7. **Financial** 🚧 - Education budget & expenditure
8. **Population** 🚧 - Population data for calculations

## 🔒 Security

- **Row Level Security (RLS)** ensures users only access their country's data
- **Authentication** via Supabase Auth
- **Environment variables** for sensitive credentials
- **HTTPS** enforced in production
- **Audit trails** for all data changes

## 📖 Documentation

- **[SUPABASE_SETUP_GUIDE.md](./SUPABASE_SETUP_GUIDE.md)** - Complete Supabase setup (15-30 min)
- **[DATA_ENTRY_SYSTEM_STATUS.md](./DATA_ENTRY_SYSTEM_STATUS.md)** - Project status & roadmap
- **[database_schema_recommendations.md](./database_schema_recommendations.md)** - Database design details
- **[ANALYSIS_README.md](./ANALYSIS_README.md)** - Excel template analysis

## 🛠️ Development

### Install Dependencies
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
npm start
```

### Lint Code
```bash
npm run lint
```

## 🚀 Deployment

### Recommended: Vercel

1. Push code to GitHub
2. Import project to [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy!

### Alternative: Any Node.js Host

This is a standard Next.js app and can be deployed to:
- AWS (Amplify, EC2, ECS)
- Google Cloud Platform
- Azure
- DigitalOcean
- Railway
- Render

## 🤝 Contributing

This is an OECS internal project. For access or contributions:
1. Contact the OECS Education Unit
2. Request appropriate role assignment

## 📝 License

Proprietary - OECS Member States

## 📞 Support

- **Technical Issues**: Create an issue in this repository
- **Data Questions**: Contact your OECS coordinator
- **Access Requests**: Contact OECS administration

## 🎓 Academic Year

Current active year: **2024-2025**

Data collection for academic years:
- 2022-2023
- 2023-2024
- 2024-2025 (active)
- 2025-2026 (planned)

## 🔧 Technology Stack

| Category | Technology |
|----------|-----------|
| Framework | Next.js 15, React 18 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 3.4 |
| UI Components | Shadcn/ui (Radix) |
| Charts | Recharts |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| AI | OpenAI GPT-4o via Vercel AI SDK |
| Deployment | Vercel (recommended) |

## 📈 Project Status

**Completion: ~30%**

See [DATA_ENTRY_SYSTEM_STATUS.md](./DATA_ENTRY_SYSTEM_STATUS.md) for detailed progress.

---

**Built for the Organisation of Eastern Caribbean States (OECS)**

*Empowering education through data-driven insights*
