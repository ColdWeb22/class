# Product Document
## Student Planner

**Version:** 1.0  
**Date:** December 31, 2025  
**Product Owner:** Development Team

---

## 1. Vision & Strategy

### 1.1 Product Vision
Give students a single, intuitive platform to plan their academic semesters, predict GPA outcomes, optimize study time, and track their progress with clear visualizations and exportable plans.

### 1.2 Problem Statement
Students struggle to:
- Calculate what GPA they need to achieve their target CGPA
- Plan study time effectively across multiple courses
- Compare different academic scenarios before committing
- Visualize their academic progress over time
- Make data-backed decisions for course planning

Current solutions are fragmented across spreadsheets, calculators, and mental math—leading to errors, anxiety, and poor planning.

### 1.3 Product Goals
1. **Simplify Planning**: Make GPA calculations and study planning accessible in under 2 minutes
2. **Enable Comparison**: Let students explore multiple scenarios without commitment
3. **Provide Insights**: Visualize academic trends to inform better decisions
4. **Support Advisors**: Create exportable reports for advising sessions
5. **Build Trust**: Accurate calculations with transparent methodology

---

## 2. Target Market

### 2.1 Primary Users

#### Undergraduate Students (60% of users)
- **Needs**: Track CGPA, plan course loads, hit graduation GPA requirements
- **Pain Points**: Unsure if current grades will meet targets; last-minute panic
- **Goals**: Graduate with desired CGPA; avoid academic probation

#### Transfer Students (20% of users)
- **Needs**: Compare different course paths before enrolling
- **Pain Points**: New institution's GPA scale; credit transfers; uncertainty
- **Goals**: Choose optimal semester plan; maximize transferred credits

#### Working Students (15% of users)
- **Needs**: Balance limited study time across courses
- **Pain Points**: Time management; prioritizing effort; avoiding burnout
- **Goals**: Maintain passing grades while working; efficient studying

#### Graduate Students (5% of users)
- **Needs**: Maintain high GPA requirements (often 3.5+)
- **Pain Points**: Thesis credit balance; competitive cohorts; pressure
- **Goals**: Meet program requirements; research time optimization

### 2.2 Market Size
- **TAM**: 19.6 million U.S. college students (2025)
- **SAM**: Students seeking academic planning tools (~30% = 5.9M)
- **SOM**: Students who actively use GPA calculators (~10% of SAM = 590K)

---

## 3. Value Proposition

### 3.1 Core Value
**"Move from guesswork to data-backed academic planning with quick calculators, visual trends, and exportable reports."**

### 3.2 Key Benefits
- **Speed**: Get required GPA in 30 seconds vs. 10 minutes with spreadsheets
- **Confidence**: Greedy algorithm suggests realistic grade distributions
- **Flexibility**: Compare up to 5 scenarios side-by-side before deciding
- **Clarity**: Visual charts show GPA trends and course distributions
- **Portability**: Export PDF/CSV/TXT for offline review and advising

### 3.3 Differentiation

| Feature | Student Planner | Competitors |
|---------|-----------------|-------------|
| Scenario Comparison | Up to 5 scenarios | 1-2 scenarios |
| Study Hours Planner | Linked to GPA goals | Separate tools |
| Export Formats | PDF + CSV + TXT | PDF only or none |
| Undo/Redo | Yes (GPA Planner) | No |
| Data Visualization | 3 chart types + stats | Limited or none |
| Semester Tracking | Full CRUD with status | Calculator only |

---

## 4. Product Features

### 4.1 Core Features (v1.0 - Shipped)

#### 4.1.1 Authentication & Profile
- **What**: Email/password registration and login with JWT
- **Why**: Secure user data and enable personalization
- **How**: bcrypt password hashing; 7-day JWT expiration; profile with target CGPA

#### 4.1.2 Semester Management
- **What**: Create, edit, delete semesters with courses and status tracking
- **Why**: Organize academic history and plans chronologically
- **How**: Three statuses (planned/in-progress/completed); courses with credits and grades; actual GPA tracking

#### 4.1.3 GPA Planner
- **What**: Calculate required semester GPA to achieve target CGPA
- **Why**: Students' most common question: "What GPA do I need?"
- **How**: Input current CGPA, credits, target CGPA, courses → output required GPA
- **Extra**: Undo/redo for iterative planning; feasibility warnings (>4.0)

#### 4.1.4 Study Hours Planner
- **What**: Generate weekly study hours per course based on units and GPA goals
- **Why**: Working students need to allocate limited time effectively
- **How**: Base hours × unit weight × difficulty × GPA multiplier → hours per course and total
- **Extra**: Export to PDF/CSV/TXT for schedule apps

#### 4.1.5 Grade Analyzer
- **What**: Recommend minimum grades per course to achieve target semester GPA
- **Why**: Students want to know "What's the lowest grade I can afford?"
- **How**: Greedy algorithm distributes grade points across credit-weighted courses
- **Extra**: Visual grade cards with color coding

#### 4.1.6 Comparison Tool
- **What**: Compare up to 5 different academic scenarios side-by-side
- **Why**: Transfer students and planners need to evaluate options before committing
- **How**: Independent GPA calculations per scenario; highlight best (lowest required GPA)
- **Extra**: Export PDF comparison table for advising sessions

#### 4.1.7 Data Insights
- **What**: Visualize GPA trends, course distribution, and grade breakdown
- **Why**: Trends inform future planning and build awareness of patterns
- **How**: Recharts library; line chart (GPA over time), bar chart (courses per semester), pie chart (grade distribution)
- **Extra**: Summary stats cards (highest GPA, average GPA); demo data for guests

#### 4.1.8 Dashboard
- **What**: Overview of academic status with quick actions
- **Why**: Central hub for navigation and at-a-glance status
- **How**: Four stat cards (current/target GPA, semesters, courses); recent semesters grid; CTA buttons

#### 4.1.9 Export Functionality
- **What**: Export plans and comparisons to PDF, CSV, and text files
- **Why**: Students need offline copies for advising, personal records, and review
- **How**: jsPDF for PDFs; Papa Parse for CSV; text templates for TXT

#### 4.1.10 Theme Toggle
- **What**: Switch between light and dark modes
- **Why**: User preference and reduced eye strain during night studying
- **How**: Context provider with localStorage persistence; system preference detection

### 4.2 Future Features (Roadmap)

#### v1.1 (Q1 2026)
- **Google OAuth**: Faster signup without passwords
- **Mobile App**: Progressive Web App with offline capability
- **Notifications**: Reminders for semester planning and GPA checks

#### v1.2 (Q2 2026)
- **Advisor Sharing**: Share read-only semester plans with advisors
- **Class Scheduler**: Integrate course scheduling with study hours
- **GPA Forecasting**: AI-powered predictions based on historical performance

#### v1.3 (Q3 2026)
- **Collaborative Planning**: Group study hours for team projects
- **Institution Presets**: Pre-loaded grading scales for popular universities
- **Accessibility**: WCAG 2.1 AA compliance; screen reader optimization

---

## 5. User Experience

### 5.1 User Journeys

#### Journey 1: First-Time Student Using GPA Planner
1. **Arrive**: Visit site from Google search "how to calculate required GPA"
2. **Explore**: Click "GPA Planner" from homepage (no login required)
3. **Input**: Enter current CGPA (3.2), credits (60), target CGPA (3.5)
4. **Add Courses**: List 5 courses with credits
5. **Calculate**: See required GPA (3.8) with feasibility indicator
6. **Export**: Download PDF for personal records
7. **Sign Up**: Prompted to save calculation (optional)

**Time**: 2 minutes  
**Success Metric**: 70% complete calculation; 30% sign up

#### Journey 2: Returning Student Tracking Semester
1. **Login**: Enter credentials on homepage
2. **Dashboard**: View current CGPA (3.3) and 4 completed semesters
3. **Create Semester**: Click "New Semester" → "Spring 2026"
4. **Add Courses**: 6 courses with target grades
5. **Set Status**: Mark as "in-progress"
6. **Review**: Check dashboard shows updated stats
7. **Later**: Return after grades → update actual grades → view GPA trend chart

**Time**: 5 minutes (initial); 3 minutes (update)  
**Success Metric**: 80% add courses; 50% return to update

#### Journey 3: Transfer Student Comparing Scenarios
1. **Login**: New user signs up
2. **Comparison Tool**: Navigate from dashboard tools menu
3. **Scenario A**: Current school, 4 courses, light load
4. **Scenario B**: Transfer school, 5 courses, aggressive
5. **Scenario C**: Mix: 3 new + 2 repeats
6. **Compare**: See Scenario A requires 3.5 GPA (best), B requires 3.9 (risky)
7. **Export**: Download PDF comparison for advisor meeting
8. **Decide**: Choose Scenario A based on data

**Time**: 8 minutes  
**Success Metric**: 60% create 3+ scenarios; 40% export

### 5.2 User Interface Principles
- **Clarity**: Large, readable fonts; clear labels; no jargon
- **Speed**: Inline calculations; no page reloads; instant feedback
- **Guidance**: Tooltips on hover; feasibility warnings; demo data for new users
- **Responsiveness**: Mobile-first cards; touch-friendly buttons; adaptive layouts
- **Consistency**: Tailwind utility classes; reusable components; unified theme

---

## 6. Success Metrics

### 6.1 Activation Metrics
- **Registration Rate**: 30% of calculator users sign up
- **First Semester Created**: 70% of new users create a semester within first session
- **First Calculation**: 80% run at least one planner tool in first session

### 6.2 Engagement Metrics
- **Weekly Active Users**: 40% of registered users return weekly during academic term
- **Average Planners Used**: 2.5 planner tools per user per semester
- **Scenarios Per Comparison**: 3.2 scenarios average when using comparison tool

### 6.3 Outcome Metrics
- **Export Rate**: 25% of calculations exported to PDF/CSV/TXT
- **Retention**: 60% of users return within 90 days (cross-semester retention)
- **Session Duration**: Average 6 minutes per session
- **Completion Rate**: 85% of started calculations completed (not abandoned)

### 6.4 Reliability Metrics
- **API Error Rate**: < 1% of requests result in errors
- **Uptime**: 99.5% availability during academic semesters
- **Load Time**: < 3 seconds first meaningful paint on broadband

### 6.5 Growth Metrics
- **Organic Traffic**: 60% from Google search (SEO)
- **Word of Mouth**: 25% from direct links (sharing)
- **Month-over-Month Growth**: 15% new user growth during academic year

---

## 7. Technical Strategy

### 7.1 Architecture Decisions

**Why React?**
- Component reusability (planner tools share patterns)
- Strong ecosystem for charts (Recharts) and PDFs (jsPDF)
- Modern hooks for state management (Context API)

**Why Express?**
- Lightweight and fast for RESTful API
- Middleware ecosystem (helmet, rate-limit, CORS)
- Sequelize ORM for database flexibility

**Why JWT?**
- Stateless authentication scales easily
- Client-side token storage (no server sessions)
- 7-day expiration balances security and UX

**Why PostgreSQL on Render?**
- Free tier with automatic backups
- Relational model fits semesters/courses hierarchy
- Sequelize supports PostgreSQL, MySQL, SQLite (dev flexibility)

### 7.2 Trade-offs

| Decision | Trade-off | Rationale |
|----------|-----------|-----------|
| Client-side calculations | Less server control | Faster UX; reduce API load |
| Context API vs Redux | Less tooling; simpler state | Small app; avoid over-engineering |
| SQLite default dev | Production differs | Faster local setup; Sequelize abstracts |
| Max 5 scenarios | Could support more | UI clutter; 95% use cases covered |
| 20 course limit | Artificial cap | Performance; edge case rare |

### 7.3 Scalability Plan
- **Caching**: Add Redis for session storage if JWT grows expensive
- **CDN**: Serve static assets from CDN when traffic spikes (exam seasons)
- **Database**: Upgrade Render PostgreSQL tier or migrate to managed AWS RDS
- **API**: Horizontal scaling with load balancer if > 10K concurrent users
- **Frontend**: Code-split routes and lazy-load charts for faster initial load

---

## 8. Go-to-Market Strategy

### 8.1 Launch Plan (Q4 2025)
1. **Soft Launch**: Beta with 50 university students (1 month)
2. **Feedback Loop**: Iterate based on usability issues and feature requests
3. **Public Launch**: Announce on Reddit r/college, r/GPA, university forums
4. **SEO Content**: Publish blog posts "How to Calculate Required GPA" (organic traffic)
5. **Academic Partnerships**: Reach out to advising offices for pilot programs

### 8.2 Distribution Channels
- **Organic Search**: Target keywords "GPA calculator", "study planner", "semester planner"
- **Social Media**: Reddit, TikTok (#studytok), Instagram (study communities)
- **Word of Mouth**: Viral sharing during finals and midterms
- **Academic Advisors**: Direct outreach to career centers and advising offices
- **Student Organizations**: Sponsor study skill workshops

### 8.3 Pricing Strategy
- **Free Tier**: All core features (current offering)
- **Premium (Future)**: $5/semester or $15/year for:
  - Unlimited semesters (free: 10 limit)
  - Advisor sharing links
  - Priority support
  - Custom institution grading scales
  - Advanced forecasting

### 8.4 Support Strategy
- **Self-Service**: FAQ page and README documentation
- **In-App Help**: Tooltips and demo data for first-time users
- **Community**: Discord server for student support and feature requests
- **Email Support**: Response within 48 hours for bug reports

---

## 9. Risks & Mitigations

### 9.1 Technical Risks

#### Risk: API Fetch Failures After Deployment
- **Impact**: Users see "Failed to fetch" errors; can't login or save data
- **Likelihood**: Medium (CORS misconfiguration is common)
- **Mitigation**: 
  - Verify VITE_API_URL points to deployed backend
  - Configure CORS_ORIGIN to allow frontend domain
  - Add retry logic with exponential backoff
  - Display friendly error messages with troubleshooting links

#### Risk: Database Performance Degradation
- **Impact**: Slow queries as user base grows
- **Likelihood**: Low (relational queries are simple)
- **Mitigation**: 
  - Index foreign keys (user_id, semester_id)
  - Monitor query times in production
  - Upgrade database tier if needed

### 9.2 User Experience Risks

#### Risk: Data Quality Issues
- **Impact**: Incorrect credits/grades lead to wrong calculations
- **Likelihood**: High (user input errors)
- **Mitigation**: 
  - Inline validation (credits > 0, GPA 0-4 range)
  - Feasibility warnings (required GPA > 4.0)
  - Allow undo/redo for easy corrections
  - Tooltips explaining expected formats

#### Risk: Mobile Usability Problems
- **Impact**: Frustrating experience on phones; reduced retention
- **Likelihood**: Medium (complex tables and charts)
- **Mitigation**: 
  - Responsive layouts tested on iOS/Android
  - Simplified card views for small screens
  - Touch-friendly buttons (min 44px)
  - Progressive enhancement (charts optional on mobile)

### 9.3 Market Risks

#### Risk: Low Adoption Rate
- **Impact**: Few users; effort doesn't justify maintenance
- **Likelihood**: Medium (competitive space)
- **Mitigation**: 
  - Focus on differentiators (comparison tool, study hours)
  - Invest in SEO and organic content
  - Partner with student influencers
  - Add social proof (testimonials, usage stats)

#### Risk: Academic Institution Resistance
- **Impact**: Advisors discourage use; students stop relying on tool
- **Likelihood**: Low (advisors appreciate planning)
- **Mitigation**: 
  - Position as supplement, not replacement, for advising
  - Offer free training for advisor offices
  - Build trust with transparent calculations and methodology
  - Add disclaimer: "Use in consultation with your advisor"

---

## 10. Product Roadmap

### Q4 2025 (v1.0) - Foundation ✅
- Authentication (email/password, JWT)
- Profile management (target CGPA)
- Semester CRUD with courses
- GPA Planner (calculate required GPA)
- Study Hours Planner
- Grade Analyzer
- Comparison Tool (5 scenarios)
- Data Insights (charts + stats)
- Dashboard with overview
- Export (PDF/CSV/TXT)
- Theme toggle (light/dark)
- Render deployment

### Q1 2026 (v1.1) - Polish & Growth
- Google OAuth integration (faster signup)
- Mobile PWA (offline capability)
- Email notifications (semester reminders)
- Improved onboarding (tutorial tooltips)
- Performance optimizations (lazy loading)

### Q2 2026 (v1.2) - Collaboration
- Advisor sharing links (read-only semester views)
- Class scheduler integration
- GPA forecasting (AI predictions)
- Batch import courses (CSV upload)
- Multi-institution support (different GPA scales)

### Q3 2026 (v1.3) - Enterprise
- Institutional licensing (university-wide deployments)
- SSO integration (SAML, OAuth for .edu)
- Admin dashboard (usage analytics for institutions)
- Custom branding (white-label for partners)
- Accessibility compliance (WCAG 2.1 AA)

### Q4 2026 (v2.0) - Platform
- Public API for third-party integrations
- Mobile apps (iOS, Android native)
- Course recommendation engine
- Social features (anonymous benchmarking)
- Premium tier launch ($5/semester)

---

## 11. Key Performance Indicators (KPIs)

### 11.1 North Star Metric
**Active Planners Per Week**: Number of unique users who complete at least one calculation (GPA, Study, Grade, or Comparison) in a given week.

**Why?** This metric captures both acquisition and engagement—users must sign up AND find value in the tools.

### 11.2 Supporting Metrics
- **User Acquisition**: New registrations per week
- **Activation**: % of new users who create a semester + run a planner
- **Engagement**: Average calculations per active user per week
- **Retention**: % of users active in Week 4 after signup (cohort analysis)
- **Referral**: % of new users from direct links (word of mouth proxy)
- **Revenue (Future)**: Monthly recurring revenue from premium tier

### 11.3 Target Values (6 Months Post-Launch)
- 500+ weekly active planners
- 70% activation rate (new users → first calculation)
- 2.5 average calculations per active user per week
- 60% W4 retention
- 25% direct traffic (sharing/referral)

---

## 12. Team & Responsibilities

### 12.1 Current Team
- **Full-Stack Developer(s)**: Build and maintain frontend/backend
- **UI/UX Designer**: Design interface and user flows (as needed)
- **QA Tester**: Manual testing and bug reporting (as needed)

### 12.2 Future Roles (As Needed)
- **DevOps Engineer**: Manage scaling, monitoring, CI/CD pipelines
- **Data Analyst**: Track KPIs, build dashboards, inform product decisions
- **Marketing Manager**: SEO, content, partnerships, community building
- **Customer Support**: Handle inquiries, onboard institutions, collect feedback

---

## 13. Appendix

### 13.1 Competitive Analysis

| Product | Strengths | Weaknesses | Our Advantage |
|---------|-----------|------------|---------------|
| **Generic GPA Calculators** | Simple, fast | No persistence, no planning tools | Full semester tracking + scenarios |
| **Spreadsheet Templates** | Customizable | Steep learning curve, no mobile | Guided UX, instant calculations |
| **Institution Portals** | Official data | Read-only, poor UX, no planning | Proactive planning, exports |
| **Study Apps (Notion, Evernote)** | Flexible | Manual setup, no GPA logic | Built-in GPA algorithms |

### 13.2 User Testimonials (Beta)
> "I used to panic about my GPA every semester. This tool showed me I only needed a 3.4 to graduate—huge relief!"  
> — Sarah, Junior, Psychology Major

> "The comparison tool helped me decide between two schedules. I chose the safer path and got a 3.8!"  
> — Miguel, Transfer Student, Engineering

> "Study hours planner is perfect for my part-time job. I know exactly how much time I need per course."  
> — Jessica, Senior, Business Major

### 13.3 Key Assumptions to Validate
1. **Students will sign up**: Hypothesis that tracking > one-time calculator
2. **Comparison tool is valuable**: Do users actually compare 3+ scenarios?
3. **Exports are used**: Do 25%+ users export? Or is it a vanity feature?
4. **Study hours matter**: Is the planner useful or just novelty?
5. **Charts drive retention**: Do visualizations bring users back?

**Validation Methods**:
- Analytics tracking (Mixpanel, Google Analytics)
- User interviews (5-10 per month)
- Feature usage logs (which tools are most used?)
- Cohort retention analysis (do chart viewers return more?)

---

## 14. License & Open Source

**License**: MIT License  
**Repository**: Public (GitHub recommended)  
**Contribution**: Open to community contributions with PR guidelines

**Rationale**: Open-source builds trust with students and academic community; encourages institutional adoption; fosters innovation through community features.

---

## 15. Conclusion

Student Planner solves a real pain point for millions of students navigating academic planning. By combining accurate calculations, scenario comparison, and visual insights in a clean, mobile-friendly interface, we provide value from day one. 

Our phased roadmap balances quick wins (OAuth, notifications) with long-term vision (institutional licensing, AI forecasting). Success depends on activation and retention—getting students to complete that first calculation and return when they need to plan again.

With a focus on simplicity, transparency, and data-backed decision-making, Student Planner has the potential to become the go-to tool for academic planning.

---

**Last Updated**: December 31, 2025  
**Next Review**: March 31, 2026  
**Document Owner**: Product Team

---

**End of Document**
