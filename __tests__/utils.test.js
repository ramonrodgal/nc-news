const { formatUsers, formatTopics } = require('../utils/utils');

describe('formatUsers()', () => {
  test('Returns an array', () => {
    expect(Array.isArray(formatUsers())).toBe(true);
  });
  test('Returns an array with the user data formatted in the correct order when given an array with a user object', () => {
    const user = [
      {
        username: 'butter_bridge',
        name: 'jonny',
        avatar_url:
          'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg',
      },
    ];

    expect(formatUsers(user)[0]).toEqual([
      'butter_bridge',
      'jonny',
      'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg',
    ]);
  });
  test('Returns an array of users data formatted in the correct order when given an array with multiple users objects', () => {
    const user = [
      {
        username: 'butter_bridge',
        name: 'jonny',
        avatar_url:
          'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg',
      },
      {
        username: 'icellusedkars',
        name: 'sam',
        avatar_url:
          'https://avatars2.githubusercontent.com/u/24604688?s=460&v=4',
      },
    ];

    expect(formatUsers(user)).toEqual([
      [
        'butter_bridge',
        'jonny',
        'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg',
      ],
      [
        'icellusedkars',
        'sam',
        'https://avatars2.githubusercontent.com/u/24604688?s=460&v=4',
      ],
    ]);
  });
  test('Does not mutate the original input', () => {
    const user = [
      {
        username: 'butter_bridge',
        name: 'jonny',
        avatar_url:
          'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg',
      },
      {
        username: 'icellusedkars',
        name: 'sam',
        avatar_url:
          'https://avatars2.githubusercontent.com/u/24604688?s=460&v=4',
      },
    ];

    formatUsers(user);

    expect(user).toEqual([
      {
        username: 'butter_bridge',
        name: 'jonny',
        avatar_url:
          'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg',
      },
      {
        username: 'icellusedkars',
        name: 'sam',
        avatar_url:
          'https://avatars2.githubusercontent.com/u/24604688?s=460&v=4',
      },
    ]);
  });
});

describe('formatTopics()', () => {
  test('Returns an array', () => {
    expect(Array.isArray(formatTopics())).toEqual(true);
  });
  test('Returns an array with the topics data formatted in the correct order when given an array with a topic object', () => {
    const topic = [
      {
        description: 'The man, the Mitch, the legend',
        slug: 'mitch',
      },
    ];

    expect(formatTopics(topic)).toEqual([
      ['mitch', 'The man, the Mitch, the legend'],
    ]);
  });
  test('Returns an array of topics data formatted in the correct order when given an array with multiple topics objects', () => {
    const topics = [
      {
        description: 'The man, the Mitch, the legend',
        slug: 'mitch',
      },
      {
        description: 'Not dogs',
        slug: 'cats',
      },
    ];

    expect(formatTopics(topics)).toEqual([
      ['mitch', 'The man, the Mitch, the legend'],
      ['cats', 'Not dogs'],
    ]);
  });
  test('Does not mutate the original input', () => {
    const topics = [
      {
        description: 'The man, the Mitch, the legend',
        slug: 'mitch',
      },
      {
        description: 'Not dogs',
        slug: 'cats',
      },
    ];

    formatTopics(topics);

    expect(topics).toEqual([
      {
        description: 'The man, the Mitch, the legend',
        slug: 'mitch',
      },
      {
        description: 'Not dogs',
        slug: 'cats',
      },
    ]);
  });
});
