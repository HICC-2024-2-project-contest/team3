import { KiwiBuilder, Match } from "kiwi-nlp";

async function memorySearch() {
    const builder = await KiwiBuilder.create();
    const kiwi = builder.build();
}

export { memorySearch };
