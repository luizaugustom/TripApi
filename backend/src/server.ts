import fastify from "fastify";
import cors from "@fastify/cors";
import { createTrip } from "./routes/create-trips";
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import { confirmTrip } from "./routes/confirm-trip";
import { confirmParticipants } from "./routes/confirm-participant";
import { createActivity } from "./routes/create-activity";
import { getActivity } from "./routes/get-activities";
import { createLink } from "./routes/create-links";
import { getLinks } from "./routes/get-links";
import { getPartcipants } from "./routes/get-participants";
import { createInvite } from "./routes/create-invite";
import { updateTrip } from "./routes/update-trip";
import { gettripDetails } from "./routes/get-trip-details";
import { getParticipant } from "./routes/get-participant";
import { errorHandler } from "./error-handler";
import { env } from "./env";

const app = fastify()

app.register(cors , {
    origin: '*',
}

)
app.setErrorHandler(errorHandler)
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(createTrip)
app.register(confirmTrip)
app.register(confirmParticipants)
app.register(createActivity)
app.register(getActivity)
app.register(createLink)
app.register(getLinks)
app.register(getPartcipants)
app.register(createInvite)
app.register(updateTrip)
app.register(gettripDetails)
app.register(getParticipant)

app.listen({ port: env.PORT }).then(() => {
    console.log('Server running!')
})