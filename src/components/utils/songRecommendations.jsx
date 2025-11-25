// Song recommendations based on numerology numbers

// Daily songs based on universal day number
export const DAILY_SONGS = {
  1: [
    { song: "Eye of the Tiger", artist: "Survivor", reason: "New beginnings energy" },
    { song: "Roar", artist: "Katy Perry", reason: "Leadership day" },
    { song: "Stronger", artist: "Kelly Clarkson", reason: "Independence power" }
  ],
  2: [
    { song: "Lean on Me", artist: "Bill Withers", reason: "Partnership day" },
    { song: "You've Got a Friend", artist: "Carole King", reason: "Cooperation energy" },
    { song: "Better Together", artist: "Jack Johnson", reason: "Harmony vibes" }
  ],
  3: [
    { song: "Happy", artist: "Pharrell Williams", reason: "Creative expression day" },
    { song: "Walking on Sunshine", artist: "Katrina & The Waves", reason: "Joyful energy" },
    { song: "Don't Stop Me Now", artist: "Queen", reason: "Self-expression power" }
  ],
  4: [
    { song: "We Built This City", artist: "Starship", reason: "Foundation building day" },
    { song: "Hard Work", artist: "Various", reason: "Discipline energy" },
    { song: "Build Me Up Buttercup", artist: "The Foundations", reason: "Structure day" }
  ],
  5: [
    { song: "Free Fallin'", artist: "Tom Petty", reason: "Freedom day" },
    { song: "Born to Run", artist: "Bruce Springsteen", reason: "Adventure energy" },
    { song: "Changes", artist: "David Bowie", reason: "Embrace change" }
  ],
  6: [
    { song: "Greatest Love of All", artist: "Whitney Houston", reason: "Family/love day" },
    { song: "Home", artist: "Edward Sharpe", reason: "Nurturing energy" },
    { song: "Lean on Me", artist: "Bill Withers", reason: "Care for others" }
  ],
  7: [
    { song: "The Sound of Silence", artist: "Simon & Garfunkel", reason: "Introspection day" },
    { song: "Imagine", artist: "John Lennon", reason: "Spiritual wisdom" },
    { song: "Hallelujah", artist: "Leonard Cohen", reason: "Deep reflection" }
  ],
  8: [
    { song: "Empire State of Mind", artist: "Jay-Z", reason: "Achievement day" },
    { song: "Money", artist: "Pink Floyd", reason: "Abundance energy" },
    { song: "We Are the Champions", artist: "Queen", reason: "Success power" }
  ],
  9: [
    { song: "Heal the World", artist: "Michael Jackson", reason: "Humanitarian day" },
    { song: "Man in the Mirror", artist: "Michael Jackson", reason: "Completion energy" },
    { song: "We Are the World", artist: "USA for Africa", reason: "Universal love" }
  ],
  11: [
    { song: "Imagine", artist: "John Lennon", reason: "Master visionary day" },
    { song: "Bohemian Rhapsody", artist: "Queen", reason: "Spiritual depth" },
    { song: "Stairway to Heaven", artist: "Led Zeppelin", reason: "Illumination energy" }
  ],
  22: [
    { song: "We Are the Champions", artist: "Queen", reason: "Master builder day" },
    { song: "Dream On", artist: "Aerosmith", reason: "Manifest big dreams" },
    { song: "Lose Yourself", artist: "Eminem", reason: "Build your legacy" }
  ],
  33: [
    { song: "What a Wonderful World", artist: "Louis Armstrong", reason: "Master teacher day" },
    { song: "Let It Be", artist: "The Beatles", reason: "Healing energy" },
    { song: "Amazing Grace", artist: "Traditional", reason: "Divine guidance" }
  ]
};

export const SONG_RECOMMENDATIONS = {
  // Life Path songs
  lifePath: {
    1: { song: "Roar", artist: "Katy Perry", reason: "The independent leader who blazes their own trail" },
    2: { song: "Lean on Me", artist: "Bill Withers", reason: "The peacemaker and partner" },
    3: { song: "Happy", artist: "Pharrell Williams", reason: "The creative, joyful expresser" },
    4: { song: "We Built This City", artist: "Starship", reason: "The stable builder and foundation" },
    5: { song: "Free Fallin'", artist: "Tom Petty", reason: "The freedom-loving adventurer" },
    6: { song: "Lean on Me", artist: "Bill Withers", reason: "The nurturer and caretaker" },
    7: { song: "The Sound of Silence", artist: "Simon & Garfunkel", reason: "The seeker of truth and wisdom" },
    8: { song: "Empire State of Mind", artist: "Jay-Z", reason: "The achiever and abundance attractor" },
    9: { song: "Heal the World", artist: "Michael Jackson", reason: "The humanitarian and old soul" },
    11: { song: "Imagine", artist: "John Lennon", reason: "The spiritual intuitive and visionary" },
    22: { song: "We Are the Champions", artist: "Queen", reason: "The master builder of dreams" },
    33: { song: "What a Wonderful World", artist: "Louis Armstrong", reason: "The master teacher and healer" }
  },
  // Expression/Destiny songs
  expression: {
    1: { song: "I Will Survive", artist: "Gloria Gaynor", reason: "Independent self-expression" },
    2: { song: "You've Got a Friend", artist: "Carole King", reason: "Diplomatic communication" },
    3: { song: "Don't Stop Me Now", artist: "Queen", reason: "Creative and joyful expression" },
    4: { song: "Eye of the Tiger", artist: "Survivor", reason: "Disciplined determination" },
    5: { song: "Born to Run", artist: "Bruce Springsteen", reason: "Adventurous expression" },
    6: { song: "Greatest Love of All", artist: "Whitney Houston", reason: "Nurturing expression" },
    7: { song: "Stairway to Heaven", artist: "Led Zeppelin", reason: "Spiritual seeking expression" },
    8: { song: "Money", artist: "Pink Floyd", reason: "Powerful manifestation" },
    9: { song: "Man in the Mirror", artist: "Michael Jackson", reason: "Humanitarian expression" },
    11: { song: "Somewhere Over the Rainbow", artist: "Israel Kamakawiwo'ole", reason: "Intuitive vision" },
    22: { song: "Stronger", artist: "Kanye West", reason: "Master building expression" },
    33: { song: "Let It Be", artist: "The Beatles", reason: "Master healing expression" }
  },
  // Birthday/Soul songs
  birthday: {
    1: { song: "I Gotta Feeling", artist: "Black Eyed Peas", reason: "New beginnings energy" },
    2: { song: "Better Together", artist: "Jack Johnson", reason: "Partnership energy" },
    3: { song: "Walking on Sunshine", artist: "Katrina & The Waves", reason: "Joyful creativity" },
    4: { song: "Build Me Up Buttercup", artist: "The Foundations", reason: "Stable foundation" },
    5: { song: "Live and Let Die", artist: "Paul McCartney", reason: "Freedom and change" },
    6: { song: "Home", artist: "Edward Sharpe", reason: "Family and love" },
    7: { song: "Comfortably Numb", artist: "Pink Floyd", reason: "Inner reflection" },
    8: { song: "Money Money Money", artist: "ABBA", reason: "Material abundance" },
    9: { song: "We Are the World", artist: "USA for Africa", reason: "Universal love" },
    11: { song: "Bohemian Rhapsody", artist: "Queen", reason: "Spiritual depth" },
    22: { song: "Dream On", artist: "Aerosmith", reason: "Big dreams" },
    33: { song: "Amazing Grace", artist: "Traditional", reason: "Divine healing" }
  }
};

export function getSongRecommendations(lifePath, expression, birthday) {
  const recommendations = [];
  
  if (lifePath && SONG_RECOMMENDATIONS.lifePath[lifePath]) {
    recommendations.push({
      type: 'Life Path',
      number: lifePath,
      ...SONG_RECOMMENDATIONS.lifePath[lifePath]
    });
  }
  
  if (expression && SONG_RECOMMENDATIONS.expression[expression]) {
    recommendations.push({
      type: 'Expression',
      number: expression,
      ...SONG_RECOMMENDATIONS.expression[expression]
    });
  }
  
  if (birthday && SONG_RECOMMENDATIONS.birthday[birthday]) {
    recommendations.push({
      type: 'Birthday',
      number: birthday,
      ...SONG_RECOMMENDATIONS.birthday[birthday]
    });
  }
  
  return recommendations;
}