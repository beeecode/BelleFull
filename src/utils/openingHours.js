export const weekDays = [
  { id: 'monday', label: 'Monday' },
  { id: 'tuesday', label: 'Tuesday' },
  { id: 'wednesday', label: 'Wednesday' },
  { id: 'thursday', label: 'Thursday' },
  { id: 'friday', label: 'Friday' },
  { id: 'saturday', label: 'Saturday' },
  { id: 'sunday', label: 'Sunday' },
];

export const defaultOpeningHours = {
  monday: { isOpen: true, openTime: '09:00', closeTime: '21:00' },
  tuesday: { isOpen: true, openTime: '09:00', closeTime: '21:00' },
  wednesday: { isOpen: true, openTime: '09:00', closeTime: '21:00' },
  thursday: { isOpen: true, openTime: '09:00', closeTime: '21:00' },
  friday: { isOpen: true, openTime: '09:00', closeTime: '21:00' },
  saturday: { isOpen: true, openTime: '10:00', closeTime: '22:00' },
  sunday: { isOpen: false, openTime: null, closeTime: null },
};

export function normalizeOpeningHours(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return defaultOpeningHours;
  }

  return weekDays.reduce((schedule, day) => {
    const savedDay = value[day.id] || {};
    const fallbackDay = defaultOpeningHours[day.id];
    const isOpen = savedDay.isOpen ?? fallbackDay.isOpen;

    schedule[day.id] = {
      isOpen,
      openTime: isOpen ? savedDay.openTime || fallbackDay.openTime : null,
      closeTime: isOpen ? savedDay.closeTime || fallbackDay.closeTime : null,
    };

    return schedule;
  }, {});
}

export function isInvalidOpeningRange(daySchedule) {
  if (!daySchedule.isOpen || !daySchedule.openTime || !daySchedule.closeTime) return false;

  const [openHour, openMinute] = daySchedule.openTime.split(':').map(Number);
  const [closeHour, closeMinute] = daySchedule.closeTime.split(':').map(Number);

  return openHour * 60 + openMinute >= closeHour * 60 + closeMinute;
}

export function hasInvalidOpeningHours(openingHours) {
  const normalizedHours = normalizeOpeningHours(openingHours);

  return weekDays.some(({ id }) => isInvalidOpeningRange(normalizedHours[id]));
}
