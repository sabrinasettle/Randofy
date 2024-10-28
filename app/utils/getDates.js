export function getThisWeek(today) {
  const currentDay = today.getDay(); // 0 for Sunday, 1 for Monday, and so on

  // Calculate the start of the week (Sunday)
  // const startOfWeek = new Date(today);
  // startOfWeek.setDate(today.getDate() - 7);
  // startOfWeek.setHours(0, 0, 0, 1);

  // Calculate the end of the week (Saturday)
  const endOfWeek = new Date(today);
  endOfWeek.setDate(today.getDate() - 7);
  endOfWeek.setHours(0, 0, 0, 1);
  return {
    start: endOfWeek,
    end: new Date(),
  };
}

export function getThisMonth(today) {
  const y = today.getFullYear();
  const m = today.getMonth();
  const firstDay = new Date(y, m, 1);
  const lastDay = new Date(y, m + 1, 0);

  return {
    start: firstDay,
    end: lastDay,
  };
}

export function getPast6Months(today) {
  // const y = today.getFullYear();
  // const m = today.getMonth();

  // const firstDay = new Date(y, m, 1);
  const firstDay = new Date();

  firstDay.setMonth(today.getMonth() - 6);
  console.log("getDates", firstDay);
  // const monthsAgo = today.setMonth(today.getMonth() - 6);
  return {
    start: firstDay,
    end: today,
  };
}
