import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from 'zod'
import { prisma } from "../lib/prisma";
import { dayjs } from "../lib/dayjs";
import { getMailClient } from "../lib/mail";
import nodemailer from 'nodemailer'
import { ClientError } from "../erros/client-error";
import { env } from "../env";



export async  function createInvite(app:FastifyInstance){

    app.withTypeProvider<ZodTypeProvider>().post('/trips/:tripId/invites', {
        schema: {
            params: z.object({
                tripId: z.string().uuid()
            }),
            body: z.object({
                email: z.string().email()
            })
        }
    } ,async (request) => {
        const { tripId } = request.params
        const { email } = request.body


        const trip = await prisma.trip.findUnique({
            where: { id: tripId }
        })

        if (!trip) {
            throw new ClientError('Trip not found')
        }

        const participant = await prisma.participant.create({
            data: {
                email,
                trip_id: tripId,
            }
        })
        
        const formattedStartDate = dayjs(trip.starts_at).format('LL')
        const formattedEndDate = dayjs(trip.ends_at).format('LL')

        

        const mail = await getMailClient()


                
                const confirmationLink = `${env.API_BASE_URL}/participants/${participant.id}/confirm`

                const message = await mail.sendMail({
                    from: {
                        name: "Equipe plann.er",
                        address: 'oi@plann.er',
                    },
                    to: participant.email,
                    subject: `Confirme sua viagem para ${trip.destination} em ${formattedStartDate}`,
                    html: `
                        <div styles=" font-family: sans-serif"; font-size:16px; line-height: 1.6;>
                        <p>Você foi convidadoi(a) para uma viagem  para <strong>${trip.destination} de  ${formattedStartDate} á ${formattedEndDate}</strong></p>
                        <p></p>
                        <p>Para confirmar a viagem, clique no link abaxio:</p>
                        <p></p>
                        <p> <a href="${confirmationLink}">Confirmar viagem </a> </p>
            
                        </div>
                    `.trim()
                 })
                 console.log(nodemailer.getTestMessageUrl(message))

            })
    
        return
    
    }