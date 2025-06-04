//뱃지 관련 유틸리티 함수

const badgeMap = {
  region: {            // 모집지역
    서울:    'badge-region-seoul',
    경기:    'badge-region-gg',
    인천:    'badge-region-incheon',
    부산:    'badge-region-busan',
    대구:    'badge-region-daegu',
    대전:    'badge-region-daejeon',
    광주:    'badge-region-gwangju',
    울산:    'badge-region-ulsan',
    경남:    'badge-region-gyeongnam',
    경북:    'badge-region-gyeongbuk',
    충남:    'badge-region-chungnam',
    충북:    'badge-region-chungbuk',
    전남:    'badge-region-jeonnam',
    전북:    'badge-region-jeonbuk',
    강원:    'badge-region-gangwon',
    제주:    'badge-region-jeju',
    세종:    'badge-region-sejong',
    해외:    'badge-region-overseas',
    온라인:  'badge-region-online'
    // …추가
  },
  field: {             // 모집분야
    프론트엔드: 'badge-field-fe',
    백엔드:     'badge-field-be',
    웹:       'badge-field-web',
    앱:       'badge-field-app',
    데이터:   'badge-field-data',
    AI:       'badge-field-ai',
    디자인:   'badge-field-design',
    기획:     'badge-field-planning',
    마케팅:   'badge-field-marketing',
    게임:     'badge-field-game',
    블록체인: 'badge-field-blockchain',
    IoT:     'badge-field-iot',
    클라우드: 'badge-field-cloud',
    보안:     'badge-field-security',
    기타:     'badge-field-etc'

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