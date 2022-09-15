import express from 'express';
import { PrismaClient } from '@prisma/client'
import { convertHourStringToMinutes } from './utils/convert-hour-string-to-minute';
import { convertMinutesToHoursString } from './utils/convert-minutes-to-hours-string';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());
// app.use(cors({
//     origin: 'http://www.rafaelponciano.com'
// }))

const prisma = new PrismaClient();

app.get('/games', async (request, response) => {
    const games = await prisma.game.findMany({
        include: {
            _count: {
                select: {
                    ads: true
                }
            }
        }
    })

    return response.status(200).json(games);
});

app.post('/games/:id/ads', async (request, response) => {
    const gameId = request.params.id;
    const body: any = request.body;

    const ad = await prisma.ad.create({
        data: {
            gameId,
            name: body.name,
            yearsPlaying: body.yearsPlaying,
            discord: body.discord,
            weekDays: body.weekDays,
            hourStart: convertHourStringToMinutes(body.hourStart),
            hourEnd: convertHourStringToMinutes(body.hourEnd),
            useVoiceChannel: body.useVoiceChannel,
        }
    })

    return response.status(201).json(ad);
});

app.get('/games/:id/ads', async (request, response) => {

    const gameId = request.params.id;

    const ads = await prisma.ad.findMany({
        select: {
            id: true,
            name: true,
            weekDays: true,
            useVoiceChannel: true,
            yearsPlaying: true,
            hourStart: true,
            hourEnd: true,
        },
        where: {
            gameId
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    const formatedWeekDaysAds = ads.map((ad) => {
        return {
            ...ad,
            weekDays: ad.weekDays.split(','),
            hoursStart: convertMinutesToHoursString(ad.hourStart),
            hoursEnd: convertMinutesToHoursString(ad.hourEnd),
        }
    });

    return response.status(200).json(formatedWeekDaysAds)
});

app.get('/ads/:id/discord', async (request, response) => {
    const adId: string = request.params.id;

    const ad = await prisma.ad.findUniqueOrThrow({
        select: {
            discord: true,
        },
        where: {
            id: adId,
        }
    })

    return response.status(200).json({discord: ad.discord})
});

app.listen(3333);