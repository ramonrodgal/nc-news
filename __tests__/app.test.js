const db = require('../db/connection.js');
const testData = require('../db/data/test-data/index.js');
const seed = require('../db/seeds/seed.js');

const request = require('supertest');
const app = require('../app');

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe('not valid url', () => {
  test('status:404 responds with the message "Invalid URL"', async () => {
    const {
      body: { msg },
    } = await request(app).get('/api/not-valid-url').expect(404);
    expect(msg).toBe('Invalid URL');
  });
});

describe('/api', () => {
  describe('GET', () => {
    test('status:200 responds with an object containing all the endpoints', async () => {
      const { body } = await request(app).get('/api').expect(200);

      expect(body['GET /api'].description).toBe(
        'serves up a json representation of all the available endpoints of the api'
      );
    });
  });
});

describe('/api/topics', () => {
  describe('GET', () => {
    test('status:200 responds with an array containing all the topics in the correct format', async () => {
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
  describe('POST', () => {
    test('status:200 responds with the added topic', async () => {
      const body = {
        slug: 'topic name here',
        description: 'description here',
      };
      const {
        body: { topic },
      } = await request(app).post('/api/topics').send(body).expect(201);

      const topicTest = {
        description: expect.any(String),
        slug: expect.any(String),
      };

      expect(topic).toEqual(topicTest);
    });
    test('status:400 responds with a message for invalid body', async () => {
      const body = {
        notValid: 'Not a valid field',
        description: 'The description goes here',
      };
      const {
        body: { msg },
      } = await request(app).post('/api/topics').send(body).expect(400);

      expect(msg).toBe('Bad Request. Invalid Body');
    });
    test('status:400 responds with a message for invalid data type', async () => {
      const body = {
        slug: 255,
        description: 'description here',
      };
      const {
        body: { msg },
      } = await request(app).post('/api/topics').send(body).expect(400);

      expect(msg).toBe('Bad Request. Invalid Body');
    });
  });
});

describe('/api/articles/:article_id', () => {
  describe('GET', () => {
    test('status:200 responds with a single article', async () => {
      const article_id = 2;
      const {
        body: { article },
      } = await request(app).get(`/api/articles/${article_id}`).expect(200);

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

      expect(article).toEqual(articleTest);
    });
    test('status:400 responds with a message', async () => {
      const {
        body: { msg },
      } = await request(app).get('/api/articles/not-valid-id').expect(400);

      expect(msg).toBe('Bad Request');
    });
    test('status:404 responds with a message', async () => {
      const {
        body: { msg },
      } = await request(app).get('/api/articles/9999').expect(404);

      expect(msg).toBe('Article Not Found');
    });
  });
  describe('PATCH', () => {
    test('status:200 responds with the article containing the value of the property votes increased', async () => {
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
        created_at: expect.any(String),
        votes: 101,
        comment_count: 11,
      };

      expect(article).toEqual(expected);
    });
    test('status:200 responds with the article containing the value of the property votes decreased', async () => {
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
        created_at: expect.any(String),
        votes: 50,
        comment_count: 11,
      };

      expect(article).toEqual(expected);
    });
    test('status:400 responds with the same article for empty body', async () => {
      const article_id = 1;
      const requestBody = {};
      const {
        body: { article },
      } = await request(app).patch(`/api/articles/${article_id}`).expect(400);

      const expected = {
        author: 'butter_bridge',
        title: 'Living in the shadow of a great man',
        article_id: 1,
        body: 'I find this existence challenging',
        topic: 'mitch',
        created_at: expect.any(String),
        votes: 100,
        comment_count: 11,
      };

      expect(article).toEqual(expected);
    });
    test('status:400 responds with a message for invalid key in body', async () => {
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

      expect(msg).toBe('Bad Request. Invalid Body');
    });
    test('status:400 responds with a message for invalid data type in body', async () => {
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

      expect(msg).toBe('Bad Request. Invalid Body');
    });
    test('status:404 responds with a message for article not found', async () => {
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
    test('status:400 responds with a message for invalid article_id', async () => {
      const article_id = 'not-an-id';
      const body = {
        inc_votes: 1,
      };
      const {
        body: { msg },
      } = await request(app)
        .patch(`/api/articles/${article_id}`)
        .send(body)
        .expect(400);

      expect(msg).toBe('Bad Request');
    });
  });
  describe.only('DELETE', () => {
    test('status:204 and responds with no content', async () => {
      const article_id = 1;
      const { body } = await request(app)
        .delete(`/api/articles/${article_id}`)
        .expect(200);

      console.log(body);

      expect(body.article.article_id).toEqual(article_id);
    });
    test('status:404 and a message for invalid article_id', async () => {
      const article_id = 9999;
      const {
        body: { msg },
      } = await request(app).delete(`/api/articles/${article_id}`).expect(404);

      expect(msg).toBe('Article Not Found');
    });
    test('status:400 and a message for invalid article_id data type', async () => {
      const article_id = 'not-a-number';
      const {
        body: { msg },
      } = await request(app).delete(`/api/articles/${article_id}`).expect(400);

      expect(msg).toBe('Bad Request');
    });
  });
});

describe('/api/articles', () => {
  describe('GET', () => {
    test('status:200 responds with all the articles sorted by date in desc order limit by 10(default)', async () => {
      const { body } = await request(app).get('/api/articles').expect(200);

      expect(body.articles.length).toBe(10);
      expect(body.total_count).toBe(12);

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

      body.articles.forEach((article) => {
        expect(article).toEqual(articleTest);
      });

      expect(body.articles).toBeSorted({ key: 'created_at', descending: true });
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

      expect(msg).toBe('Articles Not Found');
    });
    test('status:200 responds with empty object for topic without articles', async () => {
      const { body } = await request(app)
        .get('/api/articles?topic=paper')
        .expect(200);

      expect(body.total_count).toBe(0);
      expect(body.articles).toEqual([]);
    });
    test('status:200 responds with the articles limited by a certain number', async () => {
      const limit = 5;
      const {
        body: { articles },
      } = await request(app).get(`/api/articles?limit=${limit}`).expect(200);

      expect(articles.length).toBe(limit);
    });
    test('status:200 responds with articles limited by certain number and the page to wich to start', async () => {
      const limit = 2;
      const page = 2;
      const {
        body: { articles },
      } = await request(app).get(`/api/articles?limit=${limit}&p=${page}`);

      expect(articles.length).toEqual(limit);

      expect(articles[0].article_id).toBe(2);
      expect(articles[1].article_id).toBe(12);
    });
    test('status:400 responds with a message for invalid data type in limit query', async () => {
      const limit = 'not-a-number';
      const {
        body: { msg },
      } = await request(app).get(`/api/articles?limit=${limit}`);

      expect(msg).toBe('Bad Request. Invalid query data type');
    });
    test('status:400 responds with a message for invalid data type in page query', async () => {
      const p = 'not-a-number';
      const {
        body: { msg },
      } = await request(app).get(`/api/articles?p=${p}`);

      expect(msg).toBe('Bad Request. Invalid query data type');
    });
    test('status:200 responds with an array of articles filtered by user', async () => {
      const username = 'butter_bridge';
      const {
        body: { articles },
      } = await request(app)
        .get(`/api/articles?author=${username}`)
        .expect(200);

      articles.forEach((article) => {
        expect(article.author).toBe(username);
      });
    });
    test('status:200 responds with an empty for invalid usernames', async () => {
      const username = 'notAnUser';
      const {
        body: { articles },
      } = await request(app)
        .get(`/api/articles?author=${username}`)
        .expect(200);

      expect(articles.length).toBe(0);
    });
    test.skip('status:200 responds with an array of articles filtered by user and topic', async () => {
      const username = 'butter_bridge';
      const topic = 'mitch';
      const path = `/api/articles?topic=${topic}&author=${username}`;
      console.log(path);

      const {
        body: { articles },
      } = await request(app)
        .get(`api/articles?topic=${topic}&author=${username}`)
        .expect(200);

      articles.forEach((article) => {
        expect(article.author).toBe(username);
        expect(article.topic).toBe(topic);
      });
    });
  });
  describe('POST', () => {
    test('status:201 responds with the added article', async () => {
      const body = {
        author: 'lurker',
        title: 'I love bananas',
        body: 'Lorem ipsum dolor sit amet. Jungle jungle monkey banana banana!',
        topic: 'mitch',
      };
      const {
        body: { article },
      } = await request(app).post('/api/articles').send(body).expect(201);

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

      expect(article).toEqual(articleTest);
    });
    test('status:400 responds with message for incomplete body', async () => {
      const body = {
        author: 'lurker',
        body: 'Lorem ipsum dolor sit amet. Jungle jungle monkey banana banana!',
        topic: 'mitch',
      };
      const {
        body: { msg },
      } = await request(app).post('/api/articles').send(body).expect(400);

      expect(msg).toBe('Bad Request. Invalid Body');
    });
    test('status:400 responds with a message for invalid username', async () => {
      const body = {
        author: 'not-a-valid-user',
        title: 'I love bananas',
        body: 'Lorem ipsum dolor sit amet. Jungle jungle monkey banana banana!',
        topic: 'mitch',
      };
      const {
        body: { msg },
      } = await request(app).post('/api/articles').send(body).expect(400);

      expect(msg).toBe('Bad Request. Invalid author in body');
    });
    test('status:400 responds with a message for invalid username', async () => {
      const body = {
        author: 'lurker',
        title: 'I love bananas',
        body: 'Lorem ipsum dolor sit amet. Jungle jungle monkey banana banana!',
        topic: 'bananas',
      };
      const {
        body: { msg },
      } = await request(app).post('/api/articles').send(body).expect(400);

      expect(msg).toBe('Bad Request. Invalid topic in body');
    });
  });
});

describe('/api/articles/:article_id/comments', () => {
  describe('GET', () => {
    test('status:200 responds with an array of comments in the correct format limited by 10 results(default)', async () => {
      const article_id = 1;
      const { body } = await request(app)
        .get(`/api/articles/${article_id}/comments`)
        .expect(200);

      expect(body.comments.length).toBe(10);

      expect(body.total_count).toBe(11);

      const commentTest = {
        comment_id: expect.any(Number),
        votes: expect.any(Number),
        created_at: expect.any(String),
        author: expect.any(String),
        body: expect.any(String),
      };

      body.comments.forEach((comment) => {
        expect(comment).toEqual(commentTest);
      });
    });
    test('status:200 responds with an empty array of comments for article with no comments', async () => {
      const article_id = 2;
      const { body } = await request(app)
        .get(`/api/articles/${article_id}/comments`)
        .expect(200);

      expect(body.total_count).toEqual(0);
      expect(body.comments).toEqual([]);
    });
    test('status:400 responds with a message', async () => {
      const {
        body: { msg },
      } = await request(app)
        .get('/api/articles/not-valid-id/comments')
        .expect(400);

      expect(msg).toEqual('Bad Request');
    });
    test('status:404 responds with a message', async () => {
      const {
        body: { msg },
      } = await request(app).get('/api/articles/9999/comments').expect(404);

      expect(msg).toEqual('Article Not Found');
    });
    test('status:200 responds with the comments limited by query', async () => {
      const limit = 5;
      const article_id = 1;
      const {
        body: { comments },
      } = await request(app)
        .get(`/api/articles/${article_id}/comments?limit=${limit}`)
        .expect(200);

      expect(comments.length).toBe(limit);
    });
    test('status:200 responds with the comments limited by certain number and the page to which to start', async () => {
      const limit = 2;
      const page = 2;
      const article_id = 1;
      const {
        body: { comments },
      } = await request(app).get(
        `/api/articles/${article_id}/comments?limit=${limit}&p=${page}`
      );

      expect(comments.length).toBe(2);

      expect(comments[0].comment_id).toBe(4);
      expect(comments[1].comment_id).toBe(5);
    });
    test('status:400 responds with a message for invalid data type in limit query', async () => {
      const limit = 'not-a-number';
      const article_id = 1;
      const {
        body: { msg },
      } = await request(app).get(
        `/api/articles/${article_id}/comments?limit=${limit}`
      );

      expect(msg).toBe('Bad Request. Invalid query data type');
    });
    test('status:400 responds with a message for invalid data type in limit query', async () => {
      const p = 'not-a-number';
      const article_id = 1;
      const {
        body: { msg },
      } = await request(app).get(`/api/articles/${article_id}/comments?p=${p}`);

      expect(msg).toBe('Bad Request. Invalid query data type');
    });
  });
  describe('POST', () => {
    test('status:201 responds with the posted comment', async () => {
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
        .expect(201);

      const expected = {
        comment_id: 19,
        votes: 0,
        created_at: expect.any(String),
        author: 'butter_bridge',
        body: 'I like bananas!',
      };

      expect(comment).toEqual(expected);
    });
    test('status:400 responds with a message for invalid article_id', async () => {
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
    test('status:404 responds with a message for invalid username in body', async () => {
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
        .expect(404);

      expect(msg).toEqual('Username does not exist');
    });
    test('status:400 responds with a message for invalid body fields', async () => {
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

      expect(msg).toBe('Bad Request. Invalid Body');
    });
    test('status:400 responds with a message for invalid body data type', async () => {
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

      expect(msg).toBe('Bad Request. Invalid Body');
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
  describe('PATCH', () => {
    test('status:200 and respond with the updated comment with the votes increased', async () => {
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
    test('status:200 and respond with the updated comment with the votes decreased', async () => {
      const comment_id = 1;
      const body = {
        inc_votes: -1,
      };
      const {
        body: { comment },
      } = await request(app)
        .patch(`/api/comments/${comment_id}`)
        .send(body)
        .expect(200);

      expect(comment.votes).toBe(15);
    });
    test('status:200 and respond with unchanged comment when no inc_votes is provided in the request body', async () => {
      const comment_id = 1;
      const body = {};
      const {
        body: { comment },
      } = await request(app)
        .patch(`/api/comments/${comment_id}`)
        .send(body)
        .expect(200);

      const commentTest = {
        comment_id: expect.any(Number),
        votes: expect.any(Number),
        created_at: expect.any(String),
        author: expect.any(String),
        body: expect.any(String),
      };

      expect(comment).toEqual(commentTest);
    });
    test('status:400 respond with a message for invalid key in body', async () => {
      const comment_id = 1;
      const body = {
        notValid: 200,
      };
      const {
        body: { msg },
      } = await request(app)
        .patch(`/api/comments/${comment_id}`)
        .send(body)
        .expect(400);

      expect(msg).toBe('Bad Request. Invalid Body');
    });
    test('status:400 responds with a message for invalid data type in body', async () => {
      const comment_id = 1;
      const body = {
        inc_votes: 'A lot of votes',
      };
      const {
        body: { msg },
      } = await request(app)
        .patch(`/api/comments/${comment_id}`)
        .send(body)
        .expect(400);

      expect(msg).toBe('Bad Request. Invalid Body');
    });
    test('status:404 responds with a message for invalid article_id', async () => {
      const comment_id = 9999;
      const body = {
        inc_votes: 20,
      };
      const {
        body: { msg },
      } = await request(app)
        .patch(`/api/comments/${comment_id}`)
        .send(body)
        .expect(404);

      expect(msg).toBe('Comment Not Found');
    });
  });
});

describe('/api/users', () => {
  describe('GET', () => {
    test('status:200 responds with an array of user objects', async () => {
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

      expect(user).toEqual(userTest);
    });
    test('status:404 responds with a message', async () => {
      const username = 'Not-a-user';
      const {
        body: { msg },
      } = await request(app).get(`/api/users/${username}`).expect(404);

      expect(msg).toBe('User Not Found');
    });
  });
});

describe('/api/users/:username/articles', () => {
  describe('GET', () => {
    test('status:200 responds with an array of articles from the same author', async () => {
      const username = 'butter_bridge';
      const {
        body: { articles },
      } = await request(app).get(`/api/users/${username}/articles`).expect(200);

      const articleTest = {
        author: username,
        title: expect.any(String),
        article_id: expect.any(Number),
        body: expect.any(String),
        topic: expect.any(String),
        created_at: expect.any(String),
        votes: expect.any(Number),
      };

      articles.forEach((article) => {
        expect(article).toEqual(articleTest);
      });
    });
    test('status:404 respods with a message', async () => {
      const username = 'notuser';
      const {
        body: { msg },
      } = await request(app).get(`/api/users/${username}/articles`).expect(404);

      expect(msg).toBe('Articles Not Found');
    });
  });
});
