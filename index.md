---
---

<section class="section" markdown="1">
## Welcome!

We've been running since 2018, with face-to-face sessions at the Harrogate Everyman. Bring a project or bring an idea, and our mentors will help you build it.

We usually have 2-3 ninjas per session, so there's plenty of room for more!
</section>

<section class="section">
  <h2>When and where</h2>
  <div class="cards" id="upcoming-sessions" data-club-id="{{ site.code_club_id }}" data-venue="{{ site.data.sessions[0].venue }} · {{ site.data.sessions[0].area }}">
    {% for session in site.data.sessions %}
    <div class="card session">
      <p class="session-when">{{ session.when }}</p>
      <p class="session-time">{{ session.time }}</p>
      <p>{{ session.venue }} &middot; {{ session.area }}</p>
    </div>
    {% endfor %}
  </div>
  <script src="{{ '/assets/js/upcoming-sessions.js' | relative_url }}" defer></script>
</section>

<section class="section" markdown="1">
## What to bring

- **A laptop.** Borrow one from somebody if needs be. We don't have any to lend, but if you can't get hold of one you can still come along and work with another Ninja.
- **Some ideas.** If you have a great idea, we'll help you develop and code it. If you're a bit stuck, we'll help you with some project ideas.
- **A parent!** (Very important). If you are 12 or under, your parent must stay with you during the session.
</section>

<section class="section">
  <h2>Our mentors</h2>
  <div class="cards">
    {% for mentor in site.data.mentors %}
    <a class="card mentor" href="https://github.com/{{ mentor.github }}">
      <img src="https://github.com/{{ mentor.github }}.png?size=160" alt="" width="80" height="80" loading="lazy">
      <span class="mentor-name">{{ mentor.name }}</span>
      <span class="mentor-handle">@{{ mentor.github }}</span>
    </a>
    {% endfor %}
  </div>
  <p>If you'd like to get involved in mentoring please <a href="mailto:{{ site.contact_email }}">contact us</a>.</p>
</section>

<section class="section">
  <h2>Resources</h2>
  <div class="cards">
    {% for resource in site.data.resources %}
    <a class="card resource" href="{{ resource.url }}">
      <span class="resource-name">{{ resource.name }}</span>
      <span>{{ resource.blurb }}</span>
    </a>
    {% endfor %}
  </div>
</section>
