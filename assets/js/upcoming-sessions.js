const CLUBS_API_URL = "https://clubs-api.raspberrypi.org/graphql";
const EVENT_PAGE_URL = "https://codeclub.org/en/events/";
const MAX_SESSIONS_SHOWN = 3;
const REQUEST_TIMEOUT_MS = 8000;

const UPCOMING_EVENTS_QUERY = `
  query UpcomingEvents($clubId: ID!) {
    club(id: $clubId) {
      events(first: 20) {
        nodes {
          id
          date
          startTime
          endTime
          remainingTickets
          discardedAt
        }
      }
    }
  }
`;

function toClubGlobalId(clubUuid) {
  return btoa(`gid://clubs-api/Club/${clubUuid}`);
}

function todayAsIsoDate() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

function formatEventDate(isoDate) {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

function describeAvailability(remainingTickets) {
  if (remainingTickets === 1) {
    return "1 place left";
  }
  return `${remainingTickets} places left`;
}

async function fetchUpcomingEvents(clubUuid) {
  const response = await fetch(CLUBS_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: UPCOMING_EVENTS_QUERY,
      variables: { clubId: toClubGlobalId(clubUuid) },
    }),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
  const { data } = await response.json();
  const today = todayAsIsoDate();

  return data.club.events.nodes
    .filter((event) => !event.discardedAt && event.date >= today)
    .sort((first, second) => first.date.localeCompare(second.date))
    .slice(0, MAX_SESSIONS_SHOWN);
}

function bookingUrlFor(event) {
  return `${EVENT_PAGE_URL}${event.id}/bookings/new`;
}

function createTextElement(tag, className, text) {
  const element = document.createElement(tag);
  element.className = className;
  element.textContent = text;
  return element;
}

function createSessionCard(event, venue) {
  const card = document.createElement("div");
  card.className = "card session";
  card.append(
    createTextElement("p", "session-when", formatEventDate(event.date)),
    createTextElement("p", "session-time", `${event.startTime} – ${event.endTime}`),
    createTextElement("p", "session-venue", venue),
  );

  if (event.remainingTickets > 0) {
    card.append(createTextElement("p", "session-availability", describeAvailability(event.remainingTickets)));
    const bookingLink = createTextElement("a", "session-book", "Book this session");
    bookingLink.href = bookingUrlFor(event);
    card.append(bookingLink);
  } else {
    card.append(createTextElement("p", "session-availability", "Fully booked"));
  }

  return card;
}

function pointBookingButtonAtNextSession(events) {
  const bookNextSessionButton = document.getElementById("book-next-session");
  const nextBookableEvent = events.find((event) => event.remainingTickets > 0);
  if (bookNextSessionButton && nextBookableEvent) {
    bookNextSessionButton.href = bookingUrlFor(nextBookableEvent);
  }
}

async function showUpcomingSessions() {
  const sessionList = document.getElementById("upcoming-sessions");
  if (!sessionList) {
    return;
  }

  try {
    const events = await fetchUpcomingEvents(sessionList.dataset.clubId);
    if (events.length > 0) {
      sessionList.replaceChildren(...events.map((event) => createSessionCard(event, sessionList.dataset.venue)));
      pointBookingButtonAtNextSession(events);
    }
  } catch (error) {
    console.warn("Could not load upcoming sessions from Code Club", error);
  }
}

showUpcomingSessions();
