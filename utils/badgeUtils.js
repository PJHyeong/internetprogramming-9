
const badgeMap = {
  region: {            // 모집지역
    서울:    'badge-region-seoul',
    경기:    'badge-region-gg',
    // …추가
  },
  field: {             // 모집분야
    프론트엔드: 'badge-field-fe',
    백엔드:     'badge-field-be',
    // …추가
  },
  status: {            // 모집중/마감
    모집중: 'badge-status-open',
    마감:   'badge-status-closed'
  }
};

/**
 * tag: { id, name, type }
 * return: { id, name, type, badgeClass }
 */
function withBadge(tag) {
  const cls =
    badgeMap[tag.type] &&
    badgeMap[tag.type][tag.name]
      ? badgeMap[tag.type][tag.name]
      : 'badge-default';
  return { ...tag, badgeClass: cls };
}

module.exports = { withBadge };