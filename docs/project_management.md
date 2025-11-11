# Project Management Setup

## Operating Model
- **Cadence:** Two-week sprints with Monday planning, Wednesday product review, Friday retro.
- **Tools:** Linear for backlog + roadmap, Notion for knowledge base, Figma for design, Slack for comms.
- **Reporting:** Sprint burndown via Linear; weekly executive summary shared in Notion.

## Roles & Responsibilities
- **Product Lead:** Prioritizes roadmap, aligns stakeholders, curates backlog.
- **Engineering Lead:** Owns architecture decisions, code quality, release management.
- **Design Lead:** Delivers UX/UI assets, conducts usability tests, oversees design system.
- **Ops Specialist:** Coordinates supplier onboarding, manages beta feedback, ensures compliance.

## Backlog Structure
- **Epics:** Mapped to milestones M1–M12.
- **Issue Types:** Feature, Tech Debt, Bug, Research, Ops Task.
- **Definition of Ready:** Clear acceptance criteria, designs attached, dependencies resolved, env vars noted.
- **Definition of Done:** Code merged with tests, QA sign-off, documentation updated, telemetry dashboards configured.

## Collaboration Rituals
- **Daily stand-up:** Async Slack thread before 11am IST.
- **Design dev sync:** Twice weekly for component reviews and implementation alignment.
- **Ops sync:** Weekly check-in to track supplier status, incident follow-up, Razorpay settlements.
- **Security review:** Monthly meeting to audit new integrations, secrets rotation, and threat modeling.

## Documentation Standards
- Use ADRs (Architecture Decision Records) for key technical choices in `docs/adr/`.
- Maintain API contracts in `docs/api/` with OpenAPI specs.
- Store test plans and QA scripts in `docs/qa/`.
- Ensure every significant PR links to documentation updates when necessary.

## Risk Management
- Maintain risk register in Notion; review high/medium risks each sprint.
- Run incident postmortems using blameless template; add learnings to `docs/ops/postmortems/`.
- Schedule quarterly disaster recovery drills covering Postgres backups, Razorpay webhook failovers, and notification provider outages.


