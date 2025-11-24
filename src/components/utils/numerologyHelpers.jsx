// Shared helper to build family member data from calculation results
export function buildMemberDataFromCalc(calc) {
  return {
    life_path_western: calc.lifePath?.reduced,
    life_path_chaldean: calc.lifePathChaldean?.reduced,
    life_path_master: calc.lifePath?.display,
    birthday_vibe: calc.birthday?.display,
    birthday_number: calc.birthday?.reduced,
    birthday_month_number: calc.birthdayMonth?.reduced,
    expression_western: calc.expression?.reduced,
    expression_chaldean: calc.expressionChaldean?.reduced,
    expression_master: calc.expression?.display,
    life_purpose: calc.expression?.reduced,
    soul_urge_western: calc.soulUrge?.reduced,
    soul_urge_chaldean: calc.soulUrgeChaldean?.reduced,
    soul_urge_master: calc.soulUrge?.display,
    personality_western: calc.personality?.reduced,
    personality_chaldean: calc.personalityChaldean?.reduced,
    personality_master: calc.personality?.display,
    master_numbers: calc.masterNumbers?.join(',') || '',
    pythagorean_total: calc.pythagorean?.total,
    chaldean_total: calc.chaldean?.total,
    gematria_total: calc.gematria?.total,
    karmic_debt_number: calc.karmicDebt?.numbers?.join(',') || '',
    karmic_lessons: calc.karmicLessons?.lessons?.join(',') || '',
    sun_sign: calc.astrology?.sunSign || '',
    zodiac_sign: calc.astrology?.sunSign || '',
    ruling_planet: calc.astrology?.rulingPlanet || '',
    element: calc.astrology?.element || '',
    secondary_element: calc.astrology?.secondaryElement || '',
    modality: calc.astrology?.modality || ''
  };
}