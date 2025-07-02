# Project Context for Claude

This file contains important context about the project that Claude should remember across sessions.

## OpenPanel Analytics Tracking Strategy

### Event Naming Conventions
Events follow the pattern: `[noun]_[verb/action]` (e.g., `project_clicked`, `note_created`)

### Event Categories
1. **Navigation**: `link_click`, `social_link_click`, `footer_social_link_click`
2. **Content**: `project_clicked`, `article_link_click`, `link_preview_click`, `tool_link_click`, `about_tool_link_click`
3. **Work/Professional**: `company_link_click`, `company_website_click`, `product_link_click`, `testimonial_linkedin_click`, `headline_link_click`
4. **Notes**: `note_created`, `note_edited`, `note_published`, `note_unpublished`, `note_deleted`, `note_link_copied`
5. **Auth**: `admin_logout`
6. **Global**: `click` (captures all clicks)

### Standard Properties
- Required: `timestamp`, `path`, `sessionId` (auto-added by OpenPanel)
- Common: `id`, `title`, `url`, `type`, `category`, `location`, `platform`, `author`

### Implementation
- Use centralized tracking utility at `/src/lib/analytics/tracking.js`
- Functions: `trackLinkClick()`, `trackSocialClick()`, `trackProjectClick()`, `trackArticleClick()`, `trackWorkClick()`, `trackNoteAction()`, `trackAuthEvent()`
- Always include `location` and `type` properties for context
- Global click tracking with debouncing is implemented in `OpenPanelWrapper.jsx`

### Best Practices
- Be specific with event names
- Include enough context (location, type, identifiers)
- Avoid redundancy (global tracking captures basic clicks)
- Use consistent property names across similar events