const db = require('../db/connection.js');
const testData = require('../db/data/test-data/index.js');
const seed = require('../db/seeds/seed.js');

const request = require('supertest');
const app = require('../app');

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe('not valid url', () => {
  test('status 404 : responds with the message "Invalid URL"', async () => {
    const {
      body: { msg },
    } = await request(app).get('/api/not-valid-url').expect(404);
    expect(msg).toBe('Invalid URL');
  });
});

describe('/api/topics', () => {
  describe('GET', () => {
    test('status 200: responds with an array containing all the topics in the correct format', async () => {
      const {
        body: { topics },
      } = await request(app).get('/api/topics').expect(200);
      expect(topics.length).toBe(3);

      const topicTest = {
        slug: expect.any(String),
        description: expect.any(String),
      };

      topics.forEach((topic) => {
        expect(topic).toEqual(topicTest);
      });
    });
  });
});

describe('/api/articles/:article_id', () => {
  describe('GET', () => {
    test('status 200, responds with a single article', async () => {
      const article_id = 1;
      const {
        body: { article },
      } = await request(app).get(`/api/articles/${article_id}`).expect(200);

      const articleTest = {
        author: 'butter_bridge',
        title: 'Living in the shadow of a great man',
        article_id: 1,
        body: 'I find this existence challenging',
        topic: 'mitch',
        created_at: '2020-07-09 20:11:00',
        votes: 100,
        comment_count: 11,
      };

      expect(article).toEqual(articleTest);
    });
    test('status 400, responds with a message', async () => {
      const {
        body: { msg },
      } = await request(app).get('/api/articles/not-valid-id').expect(400);

      expect(msg).toBe('Bad Request');
    });
    test('status 404, responds with a message', async () => {
      const {
        body: { msg },
      } = await request(app).get('/api/articles/9999').expect(404);

      expect(msg).toBe('Article Not Found');
    });
  });
  describe('PATCH', () => {
    test('status 200: responds with the article containing the value of the property votes increased', async () => {
      const article_id = 1;
      const body = {
        inc_votes: 1,
      };
      const {
        body: { article },
      } = await request(app)
        .patch(`/api/articles/${article_id}`)
        .send(body)
        .expect(200);

      const expected = {
        author: 'butter_bridge',
        title: 'Living in the shadow of a great man',
        article_id: 1,
        body: 'I find this existence challenging',
        topic: 'mitch',
        created_at: '2020-07-09 20:11:00',
        votes: 101,
        comment_count: 11,
      };

      expect(article).toEqual(expected);
    });
    test('status 200: responds with the article containing the value of the property votes decreased', async () => {
      const article_id = 1;
      const body = {
        inc_votes: -50,
      };
      const {
        body: { article },
      } = await request(app)
        .patch(`/api/articles/${article_id}`)
        .send(body)
        .expect(200);

      const expected = {
        author: 'butter_bridge',
        title: 'Living in the shadow of a great man',
        article_id: 1,
        body: 'I find this existence challenging',
        topic: 'mitch',
        created_at: '2020-07-09 20:11:00',
        votes: 50,
        comment_count: 11,
      };

      expect(article).toEqual(expected);
    });
    test('status 400: responds with a message', async () => {
      const article_id = 1;

      const body = {
        not_valid: 200,
      };

      const {
        body: { msg },
      } = await request(app)
        .patch(`/api/articles/${article_id}`)
        .send(body)
        .expect(400);

      expect(msg).toBe('Bad Request. Invalid body');
    });
    test('status 404: responds with a message', async () => {
      const article_id = 9999;

      const body = {
        inc_votes: 1,
      };

      const {
        body: { msg },
      } = await request(app)
        .patch(`/api/articles/${article_id}`)
        .send(body)
        .expect(404);

      expect(msg).toBe('Article Not Found');
    });
  });
});

describe('/api/articles', () => {
  describe('GET', () => {
    test('status: 200 responds with all the articles', async () => {
      const {
        body: { articles },
      } = await request(app).get('/api/articles').expect(200);

      expect(articles.length).toBe(12);

      const articleTest = {
        author: expect.any(String),
        title: expect.any(String),
        article_id: expect.any(Number),
        body: expect.any(String),
        topic: expect.any(String),
        created_at: expect.any(String),
        votes: expect.any(Number),
        comment_count: expect.any(Number),
      };

      articles.forEach((article) => {
        expect(article).toEqual(articleTest);
      });
    });
  });
});

describe('/api/articles/:article_id/comments', () => {
  describe('GET', () => {
    test('status 200: responds with an array of comments in the correct format', async () => {
      const article_id = 1;
      const {
        body: { comments },
      } = await request(app)
        .get(`/api/articles/${article_id}/comments`)
        .expect(200);

      expect(comments.length).toEqual(11);

      const commentTest = {
        comment_id: expect.any(Number),
        votes: expect.any(Number),
        created_at: expect.any(String),
        author: expect.any(String),
        body: expect.any(String),
      };

      comments.forEach((comment) => {
        expect(comment).toEqual(commentTest);
      });
    });
    test('status 400: responds with a message', async () => {
      const {
        body: { msg },
      } = await request(app)
        .get('/api/articles/not-valid-id/comments')
        .expect(400);

      expect(msg).toEqual('Bad Request');
    });
    test('status 404: responds with a message', async () => {
      const {
        body: { msg },
      } = await request(app).get('/api/articles/9999/comments').expect(404);

      expect(msg).toEqual('Article Not Found');
    });
  });
  describe.only('POST', () => {
    test('status 200: responds with the posted comment', async () => {
      const article_id = 1;
      const body = {
        username: 'butter_bridge',
        body: 'I like bananas!',
      };

      const {
        body: { comment },
      } = await request(app)
        .post(`/api/articles/${article_id}/comments`)
        .send(body)
        .expect(200);

      const expected = {
        comment_id: 19,
        votes: 0,
        created_at: expect.any(String),
        author: 'butter_bridge',
        body: 'I like bananas!',
      };

      expect(comment).toEqual(expected);
    });
  });
});
