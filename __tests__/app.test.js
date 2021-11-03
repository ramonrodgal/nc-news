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
    test('status 400: responds with a message for invalid key in body', async () => {
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
    test('status 400: responds with a message for invalid data type in body', async () => {
      const article_id = 1;

      const body = {
        inc_votes: 'A lot of votes',
      };

      const {
        body: { msg },
      } = await request(app)
        .patch(`/api/articles/${article_id}`)
        .send(body)
        .expect(400);

      expect(msg).toBe('Bad Request. Invalid body');
    });
    test('status 404: responds with a message for invalid article_id', async () => {
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
    test('status:200 responds with all the articles sorted by date in desc order (default)', async () => {
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

      expect(articles).toBeSorted({ key: 'created_at', descending: true });
    });
    test('status:200 responds with all the articles sorted by any valid column in desc order(default)', async () => {
      const columns = [
        'article_id',
        'title',
        'body',
        'votes',
        'topic',
        'author',
        'created_at',
        'comment_count',
      ];

      for (let column of columns) {
        const { body: articles } = await request(app)
          .get(`/api/articles?sort_by=${column}`)
          .expect(200);

        expect(articles).toBeSorted({ key: column, descending: true });
      }
    });
    test('status:200 responds with all the articles ordered by order provided', async () => {
      const orders = ['asc', 'desc'];
      const columns = [
        'article_id',
        'title',
        'votes',
        'topic',
        'author',
        'created_at',
      ];

      for (let order of orders) {
        for (let column of columns) {
          const {
            body: { articles },
          } = await request(app)
            .get(`/api/articles?sort_by=${column}&order=${order}`)
            .expect(200);

          expect(articles).toBeSorted({
            key: column,
            descending: order === 'desc',
          });
        }
      }
    });
    test('status:200 responds with all the articles filtered by topic', async () => {
      const topic = 'mitch';
      const {
        body: { articles },
      } = await request(app).get(`/api/articles?topic=${topic}`);

      articles.forEach((article) => {
        expect(article.topic).toBe(topic);
      });
    });
    test('status:400 responds with a message for invalid sort_by column', async () => {
      const column = 'not_valid_column';
      const {
        body: { msg },
      } = await request(app).get(`/api/articles?sort_by=${column}`).expect(400);

      expect(msg).toBe('Invalid sort_by query');
    });
    test('status:400 responds with a message for invalid order query', async () => {
      const order = 'not_valid';
      const {
        body: { msg },
      } = await request(app).get(`/api/articles?order=${order}`);

      expect(msg).toBe('Invalid order query');
    });
    test('status:404 responds with a message for invalid topic', async () => {
      const topic = 'not-a-topic';
      const {
        body: { msg },
      } = await request(app).get(`/api/articles?topic=${topic}`).expect(404);

      expect(msg).toBe('Articles not found');
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
  describe('POST', () => {
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
    test('status 400: responds with a message for invalid article_id', async () => {
      const article_id = 9999;
      const body = {
        username: 'butter_bridge',
        body: 'I like bananas!',
      };

      const {
        body: { msg },
      } = await request(app)
        .post(`/api/articles/${article_id}/comments`)
        .send(body)
        .expect(404);

      expect(msg).toBe('Not Found');
    });
    test('status 400: responds with a message for invalid username in body', async () => {
      const article_id = 1;
      const body = {
        username: 'not-a-user',
        body: "I'm not in the database",
      };
      const {
        body: { msg },
      } = await request(app)
        .post(`/api/articles/${article_id}/comments`)
        .send(body)
        .expect(400);

      expect(msg).toEqual('Bad Request. Invalid username');
    });
    test('status 400: responds with a mesage for invalid body fields', async () => {
      const article_id = 1;
      const body = {
        author: 'invalid',
        body: 'comment',
      };
      const {
        body: { msg },
      } = await request(app)
        .post(`/api/articles/${article_id}/comments`)
        .send(body)
        .expect(400);

      expect(msg).toBe('Bad Request. Invalid body');
    });
    test('status 400: responds with a mesage for invalid body data type', async () => {
      const article_id = 1;
      const body = {
        username: 25,
        body: 'comment',
      };
      const {
        body: { msg },
      } = await request(app)
        .post(`/api/articles/${article_id}/comments`)
        .send(body)
        .expect(400);

      expect(msg).toBe('Bad Request. Invalid body');
    });
  });
});

describe('api/comments/:comment_id', () => {
  describe('DELETE', () => {
    test('status:204 and no content', async () => {
      const comment_id = 1;
      const { body } = await request(app)
        .delete(`/api/comments/${comment_id}`)
        .expect(204);

      expect(body).toEqual({});
    });
    test('status:404 and a message', async () => {
      const comment_id = 99999;
      const {
        body: { msg },
      } = await request(app).delete(`/api/comments/${comment_id}`).expect(404);

      expect(msg).toBe('Comment Not Found');
    });
  });
  describe.only('PATCH', () => {
    test('status 200 and respond with the updated comment with the votes increased', async () => {
      const comment_id = 1;
      const body = {
        inc_votes: 1,
      };
      const {
        body: { comment },
      } = await request(app)
        .patch(`/api/comments/${comment_id}`)
        .send(body)
        .expect(200);

      expect(comment.votes).toBe(17);
    });
  });
});

describe('/api/users', () => {
  describe('GET', () => {
    test('status 200: responds with an array of user objects', async () => {
      const {
        body: { users },
      } = await request(app).get('/api/users').expect(200);

      expect(users.length).toBe(4);

      const userTest = {
        username: expect.any(String),
      };

      users.forEach((user) => {
        expect(user).toEqual(userTest);
      });
    });
  });
});

describe('/api/users/:username', () => {
  describe('GET', () => {
    test('status:200 responds with a user object in the correct format', async () => {
      const username = 'butter_bridge';
      const {
        body: { user },
      } = await request(app).get(`/api/users/${username}`);

      const userTest = {
        username: expect.any(String),
        avatar_url: expect.any(String),
        name: expect.any(String),
      };

      console.log(user);

      expect(user).toEqual(userTest);
    });
    test('status:404 responds with a message', async () => {
      const username = 'Not-a-user';
      const {
        body: { msg },
      } = await request(app).get(`/api/users/${username}`).expect(404);

      expect(msg).toBe('User not found');
    });
  });
});
