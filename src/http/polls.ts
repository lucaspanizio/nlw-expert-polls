import { z } from "zod";
import { randomUUID } from "node:crypto";
import { FastifyInstance } from "fastify";
import { prisma } from "@lib/prisma";
import { redis } from "@lib/redis";
import { voting } from "@utils/voting-pub-sub";

export async function createPoll(app: FastifyInstance) {
  app.post("/polls", async (request, reply) => {
    const createPollBody = z.object({
      title: z.string(),
      options: z.array(z.string()),
    });

    const { title, options } = createPollBody.parse(request.body);

    const poll = await prisma.polls.create({
      data: {
        title,
        options: {
          createMany: {
            data: options.map((option) => {
              return {
                title: option,
              };
            }),
          },
        },
      },
    });

    return reply.status(201).send({ pollId: poll.id });
  });
}

export async function getPoll(app: FastifyInstance) {
  app.get('/polls/:pollId', async (request, reply) =>{
    const getPollParams = z.object({
      pollId: z.string().uuid(),
    });

    const { pollId } = getPollParams.parse(request.params);

    const poll = await prisma.polls.findUnique({
      where: {
        id: pollId,
      },
      include: {
        options: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    if (!poll) {
      return reply.status(400).send({ message: "Enquete não encontrada!" });
    }

    const result = await redis.zrange(pollId, 0, -1, 'WITHSCORES');
    /* console.log(result)
    [
      'e0c82e71-a823-4545-8f07-d20c24843036',     // pollOptionId
      '0',                                        // score
      '13ddb3cc-2751-40de-9c0e-923855cd8d83',     // pollOptionId
      '1'                                         // score
    ] */
    const votes = result.reduce((obj, line, index) => {
      if (index % 2 === 0) {
        const score = result[index + 1]
        Object.assign(obj, {[line]: Number(score)})
      }
      return obj
    }, {} as Record<string, number>);

    return reply.send({
      poll: {
        id: poll.id,
        title: poll.title,
        options: poll.options.map((option) => {
          return {
            id: option.id,
            title: option.title,
            score: (option.id in votes) ? votes[option.id] : 0,
          };
        }),
      },
    });
  })
}

export async function voteOnPoll(app: FastifyInstance) {
  app.post('/polls/:pollId/vote', async (request, reply) => {
    const SESSION_ID_COOKIE_AGE = 60 * 60 * 24 * 30; // 30 dias

    const voteOnPollBody = z.object({
      pollOptionId: z.string().uuid(),
    });

    const voteOnPollParams = z.object({
      pollId: z.string().uuid(),
    });

    const { pollId } = voteOnPollParams.parse(request.params);
    const { pollOptionId } = voteOnPollBody.parse(request.body);

    let { sessionId } = request.cookies;

    if (sessionId) {
      const userPreviousVoteOnPoll = await prisma.votes.findUnique({
        where: {
          sessionId_pollId: {
            sessionId,
            pollId,
          },
        },
      });

      if (userPreviousVoteOnPoll) {
        if (userPreviousVoteOnPoll.pollOptionId !== pollOptionId) {
          await prisma.votes.delete({
            where: {
              id: userPreviousVoteOnPoll.id,
            },
          });
          
          const votes = await redis.zincrby(
            pollId, 
            -1, 
            userPreviousVoteOnPoll.pollOptionId
          );
          
          voting.publish(pollId, {
            pollOptionId: userPreviousVoteOnPoll.pollOptionId,
            votes: Number(votes)
          })

          return
        } else {
          return reply.status(400).send({
            message: "Você já votou nessa enquete.",
          });
        }
      }
    } else {
      sessionId = randomUUID();

      reply.setCookie("sessionId", sessionId, {
        path: "/",
        maxAge: SESSION_ID_COOKIE_AGE,
        signed: true,
        httpOnly: true,
      });
    }

    await prisma.votes.create({
      data: {
        sessionId,
        pollId,
        pollOptionId,
      },
    });

    const votes = await redis.zincrby(pollId, 1, pollOptionId);

    voting.publish(pollId, {
      pollOptionId,
      votes: Number(votes)
    })

    return reply.status(201).send({
      message: "Voto realizado com sucesso.",
    });
  })
}