# Show Up — sol6.1

Author: [Your name]

Replace the author placeholder with your name. Study the code and follow your college's rules about acknowledging assistance.

## How to run

Keep all five files in the same folder. Open index.html in a modern browser. No installation, internet connection, library or build step is needed.

Use the same browser and the same file location when reopening the project. Browser storage belongs to that browser and location. Private browsing, clearing browser data or blocking storage can remove or prevent saved events. A storage warning means changes may not survive refresh.

## Features

- Add a named event with a date and one of four types.
- Countdown cards sorted from earliest to latest date.
- Today label, red overdue label and faded overdue cards.
- Green hackathon, red deadline, blue exam and yellow event badges.
- Urgent red borders for dates from today through three days away.
- Delete with a confirmation prompt.
- Save and reload events using localStorage.
- Reject empty names, whitespace-only names and missing dates.
- Responsive laptop and phone layout.

Exactly three extras:
1. All, Deadlines, Hackathons, Exams and Events filter buttons.
2. Summary of total events, events due from today through seven days away, and overdue events. The summary always counts all events, not just the selected filter.
3. Edit an event in the existing form, with Save changes and Cancel.

## Files

- index.html: page structure and form.
- style.css: layout, colors and phone styles.
- script.js: events, countdowns, filtering and saving.
- README.md: author, running instructions and features.
- EXPLANATION.md: code walkthrough and viva revision.

## Date rule

Dates are saved as YYYY-MM-DD strings and converted to local midnight. The calculation follows the required millisecond formula. On daylight-saving clock-change days, a local day can have 23 or 25 hours; the fixed 86400000 divisor can then differ from calendar-day counting. There is no live timer: dates are recalculated on opening the page and whenever cards are rendered.
