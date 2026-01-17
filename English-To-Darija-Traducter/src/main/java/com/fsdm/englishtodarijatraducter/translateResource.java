package com.fsdm.englishtodarijatraducter;

import com.fsdm.englishtodarijatraducter.dto.ResponseTextToDarija;
import jakarta.json.Json;
import jakarta.json.JsonObject;
import jakarta.json.JsonReader;
import jakarta.ws.rs.*;
import jakarta.ws.rs.client.Client;
import jakarta.ws.rs.client.ClientBuilder;
import jakarta.ws.rs.client.Entity;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.io.StringReader;

@Path("/translate")
public class translateResource {
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public ResponseTextToDarija toDarija(@QueryParam("originalText") String originalText) {
        System.out.println("converting started!!!!!!!!");
        Client client = ClientBuilder.newClient();

        String jsonBody = "{\n" +
                "                \"model\": \"tngtech/deepseek-r1t2-chimera:free\",\n" +
                "                  \"messages\": [\n" +
                "                    {\n" +
                "                      \"role\": \"system\",\n" +
                "                      \"content\": \"You are a translation tool. Translate to Moroccan Darija use the Arabic letters. IMPORTANT: Output ONLY the translated text. No explanations, no notes, no formatting, no markdown.\"\n" +
                "                    },{\n" +
                "                      \"role\": \"user\",\n" +
                "                      \"content\": \""+originalText+"\"" +
                "                    }\n" +
                "                    ]\n" +
                "                }";

        System.out.println(jsonBody);

        Response response = client.target("https://openrouter.ai/api/v1/chat/completions")
                .request(MediaType.APPLICATION_JSON)
                .header("Authorization", "Bearer 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") // Ta clé ici
                .post(Entity.entity(jsonBody, MediaType.APPLICATION_JSON));

        String resultat = response.readEntity(String.class);
        System.out.println(resultat);
        JsonReader jsonReader = Json.createReader(new StringReader(resultat));
        JsonObject root = jsonReader.readObject();

        ResponseTextToDarija rtd = new ResponseTextToDarija();
        rtd.setDarijaText(root.getJsonArray("choices")
                .getJsonObject(0)
                .getJsonObject("message")
                .getString("content"));
        rtd.setOriginalText(originalText);
        client.close();
        return rtd;
    }
}