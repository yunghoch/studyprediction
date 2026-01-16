# AI 학생학습 스타일 예측기 - Design Guidelines

## Design Approach
**Selected Approach:** Clean Utility Design System  
**Justification:** Form-heavy application requiring clarity, efficient data input, and readable results display. Korean language support with minimal distractions to enhance focus.

**Core Principles:**
- Maximum readability for Korean text
- Clear visual hierarchy between input and output sections
- Distraction-free interface focusing user attention on the task
- Spacious, breathable layouts preventing cognitive overload

---

## Typography

### Font Families
- **Primary (Korean/Mixed):** 'Noto Sans KR', sans-serif (via Google Fonts CDN)
- **Secondary (English/Numbers):** 'Inter', sans-serif (via Google Fonts CDN)

### Type Scale
- **Page Title:** text-3xl md:text-4xl, font-bold
- **Section Headers:** text-xl md:text-2xl, font-semibold
- **Form Labels:** text-sm font-medium
- **Input Text:** text-base
- **Button Text:** text-sm md:text-base, font-semibold
- **Results Content:** text-base, leading-relaxed
- **Helper Text:** text-xs md:text-sm

---

## Layout System

### Spacing Primitives
**Tailwind Units:** 2, 4, 6, 8, 12, 16, 20, 24
- Micro spacing (form elements): p-2, gap-2
- Standard spacing (sections): p-6, p-8, gap-6
- Major spacing (page structure): p-12, p-16, mt-20, mb-24

### Container Structure
- **Main Container:** max-w-4xl mx-auto px-6 md:px-8
- **Form Container:** bg-card rounded-2xl shadow-sm p-8 md:p-12
- **Results Container:** mt-12 rounded-2xl shadow-sm p-8 overflow-hidden

### Grid System
- **Form Layout:** Single column, stacked inputs with gap-6
- **Birth Info Row:** grid grid-cols-2 md:grid-cols-4 gap-4
- **AM/PM Selection:** grid grid-cols-2 gap-3

---

## Component Library

### Form Elements

**Text Inputs:**
- Class: `w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all`
- Placeholder styling: text-gray-400
- Label structure: Block label above input with mb-2

**Select Dropdowns:**
- Same base styling as text inputs
- Chevron icon from Heroicons (via CDN)
- Full width on mobile, auto-width options

**Radio Button Group (AM/PM):**
- Custom styled with rounded-lg borders
- Active state: ring effect
- Label + input wrapped in clickable container
- padding: p-4

**MBTI Input:**
- 16 predefined options in dropdown
- Alternative: Four separate dropdowns (E/I, S/N, T/F, J/P) with grid layout

### Buttons

**Primary CTA (AI 예측분석하기):**
- Size: w-full md:w-auto px-12 py-4
- Typography: text-base font-semibold
- Shape: rounded-xl
- Icon: Sparkles icon from Heroicons positioned left of text
- States: Disabled state with opacity-50 cursor-not-allowed

### Results Display

**Container:**
- Sidebar: Fixed width 280px on desktop, full-width on mobile
- Content Area: flex-1 with max-height and overflow-y-auto
- Layout: flex flex-col md:flex-row gap-8

**Results Header:**
- Display student name
- Timestamp of analysis
- Quick stats cards (grid grid-cols-2 gap-4)

**Results Content:**
- Structured sections with clear headings
- Prose-friendly formatting with leading-relaxed
- List items with custom bullet styling
- Code-like blocks for specific predictions (rounded-lg p-4)

**Scrollbar Styling:**
- Custom thin scrollbar for results
- Smooth scroll behavior

---

## Navigation & Structure

**Page Header:**
- Centered title with icon
- Subtle tagline below (text-sm)
- Top padding: pt-12 md:pt-20

**Footer:**
- Minimal: Just copyright text-xs, py-8
- Centered alignment

---

## Icon System
**Library:** Heroicons (via CDN)
**Usage:**
- Sparkles icon for AI analysis button
- User icon for name field
- Calendar icon for birth date fields
- Clock icon for time selection
- Brain/Academic cap icon for MBTI/results
- Size: w-5 h-5 for inline icons, w-6 h-6 for feature icons

---

## Accessibility

- All form inputs have associated labels (htmlFor)
- ARIA labels for icon-only buttons
- Focus indicators on all interactive elements (ring-2)
- Keyboard navigation support for radio groups
- Color contrast ratios meet WCAG AA standards
- Error messages with role="alert"

---

## Responsive Behavior

**Mobile (< 768px):**
- Single column layout throughout
- Full-width buttons
- Stacked birth info fields
- Sidebar becomes top section for results

**Desktop (≥ 768px):**
- Optimal reading width container
- Side-by-side layouts where appropriate
- Enhanced padding and spacing
- Sidebar for results navigation

---

## Animation & Transitions
**Minimal Approach - Use Sparingly:**
- Form input focus: transition-all duration-200
- Button hover: subtle transform scale-105
- Results appearance: fade-in with opacity transition
- Loading state: Simple spinner, no elaborate animations

---

## Images
**No hero image required** - This is a utility application focused on form completion and results. The interface should be clean and distraction-free without decorative imagery.