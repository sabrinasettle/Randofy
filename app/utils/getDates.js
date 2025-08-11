export function getThisWeek(today) {
  const start = new Date(today);
  const day = start.getDay(); // 0 for Sunday, 1 for Monday, and so on
  start.setDate(start.getDate() - day);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);

  return {
    start,
    end,
  };
}

export function getThisMonth(today) {
  const y = today.getFullYear();
  const m = today.getMonth();
  const start = new Date(y, m, 1, 0, 0, 0, 0);
  const end = new Date(y, m + 1, 0, 23, 59, 59, 999);

  return {
    start,
    end,
  };
}

export function getPast6Months(today) {
  const start = new Date(today);

  start.setMonth(today.getMonth() - 6);
  start.setHours(0, 0, 0, 0);

  const end = new Date(today);
  end.setHours(23, 59, 59, 999);
  return {
    start,
    end,
  };
}
