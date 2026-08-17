export function formatDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function formatDateTime(date, time = "00:00") {
  return new Date(`${formatDateKey(date)}T${time}`);
}

export function getMonthDays(date) {
  const year = date.getFullYear();
  const month = date.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const days = [];

  for (let i = 0; i < firstDay.getDay(); i++) {
    days.push(null);
  }

  for (let day = 1; day <= lastDay.getDate(); day++) {
    days.push(new Date(year, month, day));
  }

  while (days.length % 7 !== 0) {
    days.push(null);
  }

  return days;
}

export function groupPostsByDate(posts) {
  return posts.reduce((groups, post) => {
    if (!post.date) {
      return groups;
    }

    if (!groups[post.date]) {
      groups[post.date] = [];
    }

    groups[post.date].push(post);

    return groups;
  }, {});
}

export function sortPostsByDate(posts) {
  return [...posts].sort((a, b) => {
    const dateA = new Date(
      `${a.date || ""}T${a.time || "00:00"}`
    );

    const dateB = new Date(
      `${b.date || ""}T${b.time || "00:00"}`
    );

    return dateA - dateB;
  });
}

export function getCalendarEvent(post) {
  return {
    id: post.id,
    title: post.title,
    date: post.date,
    time: post.time,
    duration: post.duration || 30,
    platform: post.platform,
    content: post.content,
  };
}

export function mapPostsToCalendarEvents(posts) {
  return posts.map(getCalendarEvent);
}

export function isToday(date) {
  if (!date) {
    return false;
  }

  const today = new Date();

  return (
    today.getFullYear() === date.getFullYear() &&
    today.getMonth() === date.getMonth() &&
    today.getDate() === date.getDate()
  );
}