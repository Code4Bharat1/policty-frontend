# Policy Care Project Explanation

## 1. Project Overview

Policy Care is a web-based insurance management platform. It is designed to bring insurance comparison, quotations, policy administration, renewals, claims, payments, documents, customer support, and operational reporting into one digital system.

The platform serves three main groups:

- Customers who want to compare, purchase, and manage insurance.
- Insurance advisors or agents who manage customers, leads, quotations, policies, renewals, claims, follow-ups, and commissions.
- Administrators and operations teams who manage the complete insurance business, including companies, products, customers, agents, policies, claims, payments, reports, content, permissions, and audit records.

The application is currently a demonstration product. It uses simulated, deterministic data rather than a live backend, insurer APIs, payment gateway, database, or production authentication service.

## 2. Technology Foundation

The project is built with Next.js using the App Router architecture. Pages are organized according to URL routes, so each folder under the application directory represents a section of the website or a portal.

The interface uses React components and client-side interaction where users need filtering, forms, charts, authentication state, navigation state, or asynchronous data loading.

The main technology areas are:

- Next.js for routing, page rendering, layouts, and application structure.
- React for interactive user interfaces.
- React Query for retrieving, caching, and managing asynchronous service data.
- Tailwind CSS for layout, spacing, colors, typography, and responsive styling.
- Radix UI components for accessible interface primitives such as accordions, dialogs, selects, sliders, tabs, checkboxes, and switches.
- Lucide React for interface icons.
- Recharts for dashboard charts and visual reporting.
- React Hook Form and Zod for form handling and validation support.
- Sonner for toast notifications.
- date-fns and local formatting helpers for dates and currency values.

The project uses an import alias so internal modules can be referenced from the source directory through a consistent alias instead of long relative paths.

## 3. Public Website

The public part of the application is the customer acquisition and information website. It is wrapped in a shared site layout containing the main navigation, responsive mobile navigation, authentication or dashboard actions, and the footer.

The public navigation includes:

- Home
- Insurance products
- About
- Blog
- Frequently asked questions
- Contact

The public site communicates Policy Care as an insurance platform that replaces fragmented spreadsheets, messaging threads, paper files, and manual follow-up with a structured digital experience.

### Home Page

The home page introduces the platform through a prominent hero section. It presents Policy Care as a place where policies, renewals, and claims can be managed from one dashboard. It includes actions to explore insurance products or request a quote.

The page also presents:

- Insurance service statistics.
- Health, life, motor, travel, home, and business insurance categories.
- Featured insurance plans.
- Benefits of using Policy Care instead of buying directly or working through an offline agent.
- A four-step explanation of the customer journey.
- A comparison table between Policy Care, insurer websites, and offline agents.
- Customer testimonials.
- Frequently asked questions.
- A final request-a-quote call to action.

The home page obtains categories, products, FAQs, and testimonials from the catalog service.

### Insurance Marketplace

The products page acts as an insurance marketplace. Customers can browse available plans and narrow the results using:

- Free-text search by plan name or benefit.
- Insurance category.
- Insurance company.
- Maximum starting premium.

Each product presents its plan type, rating, summary, benefits, minimum premium, and maximum coverage. Customers can open a product detail page or select up to three products for comparison.

The comparison view shows important differences such as coverage, starting premium, deductible, benefits, add-ons, eligibility, and exclusions. The customer can then request a quotation for a selected product.

### Product Detail Pages

Product detail routes are intended to give customers a complete view of a specific plan. The product data includes:

- Product and insurer identity.
- Insurance category and plan type.
- Description and positioning statement.
- Benefits.
- Eligibility rules.
- Optional add-ons and their premiums.
- Exclusions.
- Different plan tiers.
- Coverage and premium information.

The product flow leads toward quotation requests rather than directly connecting to an insurer purchase API.

### Supporting Public Pages

The project also contains pages for:

- About the company.
- Blog articles about insurance concepts and decisions.
- Contact information and enquiry submission.
- Frequently asked questions.
- Privacy information.
- Terms and conditions.
- Unauthorized access.

These pages support customer education, trust, and initial enquiry generation.

## 4. Customer Portal

The customer portal is a protected area for policyholders. A signed-in customer is sent to the customer dashboard and receives a navigation menu focused on personal insurance servicing.

The customer navigation includes:

- Dashboard
- Insurance marketplace
- My policies
- Quotes
- Renewals
- Claims
- Payments
- Documents
- Notifications
- Support
- Profile

### Customer Dashboard

The customer dashboard summarizes the policyholder's insurance position. It calculates and displays:

- Number of active policies.
- Total sum insured across policies.
- Number of open claims.
- Number of policies needing renewal.
- Recent successful premium payments in a chart.
- Upcoming renewals with policy numbers, plans, expiry dates, and premiums.
- Recent claims and their current statuses.
- Customer notifications.

The dashboard only loads records associated with the signed-in customer's linked customer identifier. This demonstrates scoped access to personal data.

### Customer Policy Management

The policy area is intended to provide access to the customer's insurance portfolio. Customers can review policy information such as the policy number, plan, category, insurer, coverage amount, premium, dates, status, and nominee information.

Policy statuses in the demonstration data include active, expiring soon, expired, pending, and cancelled.

### Quotes and Insurance Purchase Journey

Customers can review quotation records and start quote requests from the public marketplace or product pages. A quote request creates a simulated quotation number and returns the submitted information as a successful response.

There is no live underwriting, document verification, payment settlement, policy issuance, or insurer integration in the current version.

### Renewals

The renewal area identifies policies that are expiring soon or already expired. This supports the intended workflow of reminding customers before expiry and helping them keep coverage continuous.

### Claims

Customers can view their submitted claims and inspect claim details. Claims have a type, amount, status, related policy, submitted date, and, where relevant, an approved amount.

The application models claim progress using statuses such as:

- Submitted
- Under review
- Documents required
- Approved
- Rejected
- Settled

Claim detail pages are designed to show the history and progression of a claim through a timeline.

### Payments, Documents, Notifications, Support, and Profile

The customer portal includes supporting servicing areas for payment history, document storage, notifications, support requests, and profile information.

Payment records represent premium transactions and their statuses. Documents represent policy-related files associated with a customer. Notifications can be scoped to customers or shared with all users in a role. Support and profile pages provide the expected customer-service extension points.

## 5. Advisor or Agent Portal

The advisor portal supports insurance professionals who manage a book of customers and business activity.

The advisor navigation includes:

- Dashboard
- Customers
- Leads
- Quotations
- Policies
- Renewals
- Claims
- Follow-ups
- Commissions
- Notifications
- Profile

### Advisor Dashboard

The advisor dashboard focuses on sales productivity and servicing workload. It displays:

- Assigned customer count.
- Active lead count.
- Number of policies sold.
- Premium written through the advisor's policies.
- Pending commission amount.
- Monthly premium booked.
- Lead distribution by pipeline stage.
- Follow-ups scheduled for the day.
- High-priority leads.

The dashboard uses charts to make business activity visible. Leads are grouped by stages such as new, contacted, qualified, proposal, converted, and lost. Policies and commissions are filtered by the advisor's linked identifier.

### Customer and Lead Management

Advisors can work with customers assigned to them and manage lead records. Lead information represents prospects, their insurance interest, estimated premium, priority, stage, contact information, and next action.

This provides the foundation for a CRM workflow from initial enquiry through qualification, quotation, conversion, and policy servicing.

### Quotations and Policies

Advisors can manage quotation records and policies associated with their customers. This reflects the advisor's role in comparing plans, explaining coverage, preparing quotations, supporting acceptance, and tracking issued policies.

### Renewals, Claims, and Follow-ups

Advisors have dedicated views for upcoming renewals, customer claims, and follow-up tasks. These areas support proactive servicing and continued customer relationships after policy issuance.

### Commissions

The commission area represents earnings generated from policies. Commission records include the advisor, policy relationship, amount, and status. The dashboard highlights pending commission entries.

## 6. Administrator Console

The administrator console is the broadest operational area. Administrators can access the whole insurance business rather than a single customer or advisor portfolio.

The administrator navigation includes:

- Dashboard
- Customers
- Agents
- Insurance companies
- Products
- Quotes
- Policies
- Renewals
- Claims
- Payments
- CRM and leads
- Commissions
- Notifications
- Reports
- CMS
- Documents
- Roles and permissions
- Audit logs
- Settings

### Administrator Dashboard

The administrator dashboard gives an operational overview of the complete simulated book. It shows:

- Total customers.
- Active policy count.
- Open claims.
- Successful premium collected.
- Monthly premium and claim trends.
- Advisor performance by premium written.
- A list of advisors and their policy totals.
- Administrative alerts and notifications.

This dashboard combines operational records and computed statistics rather than relying on manually entered summary values.

### Administration Modules

The administrator pages provide the structure for managing the core business entities:

- Customers and their account status, KYC status, and advisor assignment.
- Agents and their contact information, status, ratings, and joining dates.
- Insurance companies and their descriptions, contact details, websites, and claim settlement ratios.
- Products and plan configuration.
- Quotes and quotation status.
- Policies and policy lifecycle status.
- Renewals and expiry management.
- Claims and claim processing.
- Payments and transaction status.
- Leads and CRM activity.
- Commissions and advisor compensation.
- Documents and customer files.
- Notifications.
- Reports and business trends.
- CMS content such as FAQs and blog content.
- Roles and permissions.
- Audit logs.
- System settings.

Several list screens use a shared data table component that supports searching, sorting, pagination, optional exporting, loading states, empty states, and clickable rows.

## 7. Authentication and Access Control

Authentication is implemented as a demonstration mechanism using browser local storage. When a user signs in, the application looks up the email in the local demo user collection and accepts a password with at least four characters.

The login page provides demo accounts for:

- Administrator.
- Advisor or agent.
- Customer.

The demo password is the same for all listed accounts.

After sign-in, the application stores the user session in local storage and redirects the user according to their role:

- Administrators go to the administrator dashboard.
- Advisors go to the advisor dashboard.
- Customers go to the customer dashboard.

The authentication layer defines permissions for super administrators, administrators, agents, and customers. The portal shell also checks whether the current user is allowed to access the requested portal. Unauthenticated users are redirected to the login page, while users in the wrong portal are redirected to the unauthorized page.

This is useful for demonstrating the intended permission model, but it is not production security. A production version would need server-side sessions or tokens, secure password handling, backend authorization checks, protected APIs, database access controls, and secure document handling.

## 8. Data and Service Architecture

The application does not currently connect to an external backend. The main data source is a local mock data module.

The mock data contains records for:

- Six insurance categories.
- Five insurance companies.
- Ten insurance products.
- Multiple plan tiers for each product.
- Ten agents.
- Twenty-four customers.
- Forty-eight policies.
- Eighteen claims.
- Twenty-two quotes.
- Forty payments.
- Twenty-eight leads.
- Twenty follow-up tasks.
- Commission records.
- Notifications.
- Customer documents.
- Audit logs.
- FAQs.
- Testimonials.
- Blog posts.
- Demo users.
- Monthly reporting series.

Many records are generated from arrays and deterministic pseudo-random values. This means the data remains stable between renders and is predictable for demonstration and testing purposes.

A service layer sits between the pages and the mock data. Services expose operations such as listing, retrieving, filtering, and calculating records for catalogs, customers, agents, policies, claims, quotes, payments, leads, follow-ups, commissions, documents, notifications, audits, and reports.

The service layer adds a short artificial delay to imitate network requests. This allows the interface to display loading skeletons, empty states, and asynchronous dashboard behavior in a way that resembles a real application.

## 9. Shared Interface Architecture

The application has two main visual shells.

The public site layout provides:

- A sticky public header.
- Desktop navigation.
- Mobile navigation menu.
- Sign-in or dashboard actions.
- Shared footer content.
- Company, product, contact, and support links.

The portal shell provides:

- A role-specific sidebar.
- Responsive mobile navigation.
- Active route highlighting.
- Portal identity such as Customer Portal, Advisor Portal, or Admin Console.
- Current user information.
- Notifications shortcut.
- Sign-out behavior.
- Session and authorization checks.

The portal page wrapper standardizes page headers and allows each screen to provide a title, description, eyebrow label, and actions.

Reusable interface components include:

- Statistic cards.
- Section cards.
- Data tables.
- Status badges.
- Empty states.
- Loading rows and skeletons.
- Detail lists.
- Timelines.
- Forms and form controls.
- Tables, dialogs, accordions, tabs, selects, sliders, switches, checkboxes, and notifications.

This shared component structure keeps the many portal pages visually and behaviorally consistent.

## 10. Visual Design

The visual language is intended to feel like an enterprise insurance SaaS product.

The main design characteristics are:

- Deep navy for primary branding and portal navigation.
- Blue for secondary actions and interactive elements.
- Teal for accents and positive emphasis.
- Amber for warnings.
- Red for destructive or urgent states.
- Light neutral backgrounds for the main application surface.
- White card surfaces with subtle borders and shadows.
- Plus Jakarta Sans as the primary typeface.
- Lucide icons for navigation and actions.
- Responsive layouts that adapt from mobile screens to large desktop dashboards.

The design emphasizes scanning and operational clarity. Dashboards use compact statistic cards, structured sections, charts, tables, status indicators, and direct actions rather than decorative content.

## 11. Important Demonstration Limitations

The current project should be understood as a frontend prototype and workflow demonstration.

It does not currently provide:

- A real database.
- A backend API.
- Production-grade authentication.
- Real password verification.
- Server-side authorization enforcement.
- Live insurer integrations.
- Live policy issuance.
- Real underwriting.
- Real payment processing.
- Actual document uploads or storage.
- Real email, SMS, or push notification delivery.
- Real claim submission to an insurer.
- Persistent creation or editing of most records.
- A production export pipeline.
- Real audit-log immutability.

Some interface actions are represented by toast messages or simulated service responses. For example, quote requests return generated quotation numbers, and export actions indicate that a CSV has been queued even though no external export job is currently running.

## 12. Intended Production Evolution

To become a production platform, the project would need a backend and persistent data model for users, roles, customers, insurers, products, plans, quotations, policies, claims, payments, documents, notifications, follow-ups, commissions, and audit events.

It would also need:

- Secure authentication and session management.
- Server-side permission enforcement.
- Database migrations and relationships.
- Validation at the API boundary.
- Insurer and payment integrations.
- Secure document storage.
- Background jobs for reminders and notifications.
- Real reporting aggregation.
- Transaction and reconciliation handling.
- Monitoring, logging, backups, and error reporting.
- Automated tests for critical insurance workflows.

The existing frontend provides a useful foundation for those additions because the major business areas, user roles, navigation structure, service boundaries, data relationships, and visual patterns have already been established.

## 13. Summary

Policy Care is a multi-role insurance platform prototype with a public marketplace and three protected operational portals.

Customers can discover plans and manage their personal insurance portfolio. Advisors can manage prospects, customers, policies, claims, renewals, and commissions. Administrators can oversee the entire business through operational dashboards and management modules.

The project is structured around reusable layouts, shared components, role-aware navigation, local services, deterministic mock data, and simulated asynchronous behavior. Its current goal is to demonstrate the complete product experience and information architecture. Connecting it to real services, persistent storage, and production security would be the next major stage of development.
