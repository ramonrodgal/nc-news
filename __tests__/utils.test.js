const {
  formatUsers,
  formatTopics,
  formatDate,
  formatArticles,
  formatComments,
} = require('../utils');

const { formatArticlesResponse } = require('../utils/models');

describe('formatUsers', () => {
  test('Returns an array', () => {
    expect(Array.isArray(formatUsers())).toBe(true);
  });
  test('Returns an array with the user data formatted in the correct order when given an array with a single user object', () => {
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

describe('formatTopics', () => {
  test('Returns an array', () => {
    expect(Array.isArray(formatTopics())).toEqual(true);
  });
  test('Returns an array with the topics data formatted in the correct order when given an array with a single topic object', () => {
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

describe('FormatDate', () => {
  test('Returns a string', () => {
    const date = new Date(1594329060000);
    expect(typeof formatDate(date)).toBe('string');
  });
  test('Returns a string with a formated timestamp when given a date object', () => {
    const date = new Date(1594329060000);
    expect(formatDate(date)).toBe('2020-07-09 21:11:00');
  });
  test('Does not mutate the original input', () => {
    const date = new Date(1594329060000);
    formatDate(date);
    expect(date).toEqual(new Date(1594329060000));
  });
});

describe('formatArticles', () => {
  test('Returns an array', () => {
    expect(Array.isArray(formatArticles())).toBe(true);
  });
  test('Returns an array with the article data formatted in the correct order and date when given an array with a single article object', () => {
    const article = [
      {
        title: 'Living in the shadow of a great man',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'I find this existence challenging',
        created_at: new Date(1594329060000),
        votes: 100,
      },
    ];

    expect(formatArticles(article)).toEqual([
      [
        'Living in the shadow of a great man',
        'I find this existence challenging',
        100,
        'mitch',
        'butter_bridge',
        '2020-07-09 21:11:00',
      ],
    ]);
  });
  test('Returns an array of articles data formatted in the correct order and date when given an array with multiple articles objects', () => {
    const articles = [
      {
        title: 'Living in the shadow of a great man',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'I find this existence challenging',
        created_at: new Date(1594329060000),
        votes: 100,
      },
      {
        title: 'Eight pug gifs that remind me of mitch',
        topic: 'mitch',
        author: 'icellusedkars',
        body: 'some gifs',
        created_at: new Date(1604394720000),
        votes: 0,
      },
    ];

    expect(formatArticles(articles)).toEqual([
      [
        'Living in the shadow of a great man',
        'I find this existence challenging',
        100,
        'mitch',
        'butter_bridge',
        '2020-07-09 21:11:00',
      ],
      [
        'Eight pug gifs that remind me of mitch',
        'some gifs',
        0,
        'mitch',
        'icellusedkars',
        '2020-11-03 09:12:00',
      ],
    ]);
  });
  test('Does not mutate the original input', () => {
    const articles = [
      {
        title: 'Living in the shadow of a great man',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'I find this existence challenging',
        created_at: new Date(1594329060000),
        votes: 100,
      },
      {
        title: 'Eight pug gifs that remind me of mitch',
        topic: 'mitch',
        author: 'icellusedkars',
        body: 'some gifs',
        created_at: new Date(1604394720000),
        votes: 0,
      },
    ];

    formatArticles(articles);

    expect(articles).toEqual([
      {
        title: 'Living in the shadow of a great man',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'I find this existence challenging',
        created_at: new Date(1594329060000),
        votes: 100,
      },
      {
        title: 'Eight pug gifs that remind me of mitch',
        topic: 'mitch',
        author: 'icellusedkars',
        body: 'some gifs',
        created_at: new Date(1604394720000),
        votes: 0,
      },
    ]);
  });
});

describe('formatComments', () => {
  test('Returns an array', () => {
    expect(Array.isArray(formatComments())).toBe(true);
  });
  test('Returns an array with the comment data formatted in the correct order and date when given an array with a single comment object', () => {
    const comment = [
      {
        body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        votes: 16,
        author: 'butter_bridge',
        article_id: 9,
        created_at: new Date(1586179020000),
      },
    ];

    expect(formatComments(comment)).toEqual([
      [
        'butter_bridge',
        9,
        16,
        '2020-04-06 13:17:00',
        "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
      ],
    ]);
  });
  test('Returns an array of comments data formatted in the correct order and date when given an array with multiple comments objects', () => {
    const comments = [
      {
        body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        votes: 16,
        author: 'butter_bridge',
        article_id: 9,
        created_at: new Date(1586179020000),
      },
      {
        body: 'I hate streaming noses',
        votes: 0,
        author: 'icellusedkars',
        article_id: 1,
        created_at: new Date(1604437200000),
      },
    ];

    expect(formatComments(comments)).toEqual([
      [
        'butter_bridge',
        9,
        16,
        '2020-04-06 13:17:00',
        "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
      ],
      ['icellusedkars', 1, 0, '2020-11-03 21:00:00', 'I hate streaming noses'],
    ]);
  });
  test('Does not mutate the original input', () => {
    const comments = [
      {
        body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        votes: 16,
        author: 'butter_bridge',
        article_id: 9,
        created_at: new Date(1586179020000),
      },
      {
        body: 'I hate streaming noses',
        votes: 0,
        author: 'icellusedkars',
        article_id: 1,
        created_at: new Date(1604437200000),
      },
    ];

    formatComments(comments);

    expect(comments).toEqual([
      {
        body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        votes: 16,
        author: 'butter_bridge',
        article_id: 9,
        created_at: new Date(1586179020000),
      },
      {
        body: 'I hate streaming noses',
        votes: 0,
        author: 'icellusedkars',
        article_id: 1,
        created_at: new Date(1604437200000),
      },
    ]);
  });
});

describe('formatArticlesResponse', () => {
  const input = [
    {
      article_id: 1,
      title: 'Living in the shadow of a great man',
      body: 'I find this existence challenging',
      votes: 100,
      topic: 'mitch',
      author: 'butter_bridge',
      created_at: new Date('2020-07-09T20:11:00.000Z'),
      comment_count: '11',
    },
  ];

  test('Returns an object if the passed array with a single article', () => {
    expect(typeof formatArticlesResponse(input)).toBe('object');
  });
  test('Returns an array if the passed array with multiple articles', () => {
    const arr = [1, 2];
    const result = formatArticlesResponse(arr);
    expect(Array.isArray(result)).toBe(true);
  });
  test('Returns an object formatted correctly when passed an array with a single article', () => {
    const expected = {
      author: 'butter_bridge',
      title: 'Living in the shadow of a great man',
      article_id: 1,
      body: 'I find this existence challenging',
      topic: 'mitch',
      created_at: '2020-07-09 20:11:00',
      votes: 100,
      comment_count: 11,
    };

    expect(formatArticlesResponse(input)).toEqual(expected);
  });
});
