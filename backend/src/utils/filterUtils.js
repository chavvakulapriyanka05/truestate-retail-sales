export function textSearch(record, searchTerm) {
  if (!searchTerm) return true;
  const term = searchTerm.toLowerCase();
  return (
    (record.customerName && record.customerName.toLowerCase().includes(term)) ||
    (record.phoneNumber && record.phoneNumber.toLowerCase().includes(term))
  );
}

export function inMultiSelect(value, selected) {
  if (!selected || selected.length === 0) return true;
  if (!value) return false;
  return selected.includes(value);
}

export function tagsMatch(recordTags, selectedTags) {
  if (!selectedTags || selectedTags.length === 0) return true;
  if (!recordTags || recordTags.length === 0) return false;
  return selectedTags.every(tag => recordTags.includes(tag));
}

export function inNumericRange(value, min, max) {
  if (value == null || Number.isNaN(value)) return false;
  if (min != null && !Number.isNaN(min) && value < min) return false;
  if (max != null && !Number.isNaN(max) && value > max) return false;
  return true;
}

export function inDateRange(dateStr, start, end) {
  if (!start && !end) return true;
  if (!dateStr) return false;

  const value = new Date(dateStr);
  if (Number.isNaN(value.getTime())) return false;

  if (start) {
    const s = new Date(start);
    if (value < s) return false;
  }

  if (end) {
    const e = new Date(end);
    if (value > e) return false;
  }

  return true;
}

export function sortRecords(records, sortBy, sortOrder = "asc") {
  if (!sortBy) return records;

  const dir = sortOrder === "desc" ? -1 : 1;

  return [...records].sort((a, b) => {
    let va;
    let vb;

    switch (sortBy) {
      case "date":
        va = new Date(a.date);
        vb = new Date(b.date);
        break;
      case "quantity":
        va = a.quantity;
        vb = b.quantity;
        break;
      case "customerName":
        va = a.customerName?.toLowerCase() ?? "";
        vb = b.customerName?.toLowerCase() ?? "";
        break;
      default:
        return 0;
    }

    if (va < vb) return -1 * dir;
    if (va > vb) return 1 * dir;
    return 0;
  });
}
