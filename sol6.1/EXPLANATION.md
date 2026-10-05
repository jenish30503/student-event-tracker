# Understanding Show Up

## 1. How the three files connect

index.html contains the page. Its link tag loads style.css, which sets the appearance. Its script tag loads script.js. The defer setting makes the script run after the HTML has been read. JavaScript finds elements by their IDs and adds cards to event-list. Both linked paths are relative, so keep the files together.

## 2. script.js step by step

### Starting variables and listeners

- eventsKey is the storage name, sol6.1-events.
- events is the single main array. Each item has id, name, date and type.
- editingId starts as null, meaning we are adding, not editing.
- activeTab starts as all.
- The const variables hold references to the form, inputs, buttons and card area.
- addEventListener connects form submission, Cancel and typing to functions.
- forEach connects every filter button.
- loadEvents runs first, then renderEvents draws the saved list.

### Functions in file order

1. **loadEvents:** Reads browser storage. On a first visit the result is null, so events stays empty. Otherwise JSON.parse changes saved text into an array. Valid records are kept. try and catch prevent unreadable or blocked storage from crashing the page.
2. **isValidEvent:** Checks the name, date, numeric ID and allowed type of a loaded item. The small date pattern checks the YYYY-MM-DD shape. getTime and isNaN check whether the date can be read. This is a basic saved-data check, not a full calendar-date validator.
3. **saveEvents:** JSON.stringify turns the events array into text. setItem saves that text. If storage fails, a warning tells the user that saving did not work.
4. **clearNameError:** Removes the custom name warning when the user types again or resets the form.
5. **addEvent:** Stops the normal page reload. Reads the inputs and trims spaces from the name. Rejects a blank name or missing date. In add mode, push adds an object; Date.now gives it a numeric ID. In edit mode, forEach calls the nested **updateEvent** function, which updates only the matching ID. It then saves, renders and resets the form.
6. **deleteEvent:** Shows the confirmation question. Cancel returns without changing anything. The nested **keepEvent** function returns true for every other ID, so filter makes the new events array without the deleted item. The function saves and renders, then cancels editing if the deleted item was being edited.
7. **editEvent:** forEach calls the nested **fillForm** function. It finds the matching ID and copies that item's values into the inputs. The button changes to Save changes, Cancel appears and the name input receives focus.
8. **cancelEdit:** Sets editingId to null, resets the form, clears a name warning and restores the Add event button. It does not change the events array.
9. **getLocalDate:** Splits a date string at its hyphens. Number converts the pieces to numbers. The Date constructor receives year, month and day. Months start at zero, so it subtracts one from the month. This creates a local-midnight date instead of reading the string as a UTC date.
10. **getDaysLeft:** Gets the event's local date. Gets today's date and sets its time to midnight. Subtracts the dates, divides by milliseconds per day and rounds upward.
11. **connectTab:** Adds the same click listener to one filter button. forEach calls it once per button during setup.
12. **changeTab:** Reads the clicked button's data-type. The nested **markTab** function removes the old active class and adds it to the selected filter. Cards are then rendered again. This does not change or save events.
13. **updateSummary:** Starts two counters at zero. The nested **countEvent** function counts each event that is zero to seven days away and each event that is overdue. It writes the totals into the summary. These counts use the entire events array.
14. **createCard:** Makes an article and its child elements with createElement. It adds an urgent class for zero to three days away and an overdue class for negative days. The badge gets the event's type as a CSS class. textContent safely inserts the user's name as text. The displayed date is formatted with toLocaleDateString. The countdown displays a number, Today or OVERDUE. The nested **editThisEvent** and **deleteThisEvent** functions remember this card's event ID and call the matching action. append puts the elements together. The completed article is returned.
15. **renderEvents:** Removes old card elements using a while loop. The nested **matchesTab** function selects events for the current filter. The nested **compareDates** function sorts dates from earliest to latest. The nested **showCard** function creates and inserts each card. The empty message is shown when the filtered list has no items. Finally, updateSummary refreshes the counts.

The nested helpers are also ordinary function declarations. They live inside a bigger function so they can use its ID, counters or form values. No second saved array is used: visibleEvents is only a temporary filtered view.

For a change to saved data, the order is: change events, call saveEvents, then call renderEvents. Cancel and filtering do not change stored data.

## 3. Days-left calculation

The formula is:

$$\text{daysLeft} = \left\lceil \frac{\text{eventDate} - \text{today}}{86400000} \right\rceil$$

A normal day has 24 hours, each hour has 60 minutes, each minute has 60 seconds and each second has 1000 milliseconds.

$$24 \times 60 \times 60 \times 1000 = 86400000$$

Example: today is 5 October and the event is 8 October, both at local midnight. With no clock change, the difference is 259200000 milliseconds. Dividing by 86400000 gives 3. Math.ceil keeps that as 3, so the card shows 3 days remaining and an urgent border.

Same date gives 0, so the card shows Today. A past date gives a negative value, so it shows OVERDUE and fades the card. Urgent borders apply only to dates that have not passed.

Both dates use local midnight to avoid mixing UTC dates with local dates. Daylight-saving clock changes can still produce a 23-hour or 25-hour day. The requested fixed-millisecond formula is not perfect calendar-day counting across those changes.

## 4. Filters, sorting and storage

**Filter example:** With one exam and one deadline in events, selecting Exams makes matchesTab keep only the exam. The original events array still has both items. All displays both again.

**Sorting example:** If an event on 20 October was added before an event on 10 October, compareDates returns a positive number for that pair. sort moves the 10 October event first. Overdue dates are also kept in chronological order, before future dates.

**Storage example:** Adding an assignment turns the array into JSON text, such as `[{"id":123,"name":"Assignment","date":"2026-10-08","type":"deadline"}]`. Refreshing starts a new empty JavaScript array, but loadEvents reads and parses this stored text. renderEvents builds the cards again and recalculates days remaining.

localStorage stores strings and belongs to the browser and page location. It is not a server database. Clearing browser data removes saved events. A storage warning means changes may not persist.

## 5. Twelve viva questions

1. **Why use defer?** It lets the HTML finish being read before the script accesses its elements.
2. **Why use an events array?** It keeps all saved event data in one place.
3. **What does preventDefault do?** It stops form submission from reloading the page.
4. **Why trim the name?** A name made only of spaces should not count as a valid name.
5. **What does push do?** It adds an item to the end of an array.
6. **What does filter do?** It makes a new array containing only items that pass a test.
7. **What does sort do here?** It orders the filtered events by their dates.
8. **Why subtract one from the month?** JavaScript Date months run from 0 to 11.
9. **Why set today's time to midnight?** The time of day should not change the countdown.
10. **Why convert events to JSON?** localStorage can store text, not a JavaScript array directly.
11. **Why use textContent for names?** It displays input as text rather than treating it as page markup.
12. **How does editing differ from adding?** editingId selects an existing item to update; null means a new item should be added.

## 6. Revision concepts

**HTML:** doctype, language, metadata, viewport, relative links, deferred scripts, header, main, section, form, article, footer, headings, labels with matching IDs, text and date inputs, required validation, select and option, buttons, hidden attribute, data attributes.

**CSS:** selectors, classes, box sizing, system fonts, spacing, borders, backgrounds, rounded corners, Flexbox, wrapping, Grid, repeat, auto-fill, minmax, focus outlines, hover colors, opacity, overflow wrapping and one phone media query.

**JavaScript:** const, let, arrays, objects, function declarations, nested functions, conditions, return, loops, push, filter, sort, forEach, event listeners, currentTarget, preventDefault, trim, custom form validation, DOM selection, element creation, textContent, classList, append, removeChild, focus, form reset, Date, local midnight, Math.ceil, JSON, localStorage, try/catch, confirm and alert.
