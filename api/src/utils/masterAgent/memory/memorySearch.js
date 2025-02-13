import { KiwiBuilder, Match } from "kiwi-nlp";

async function memorySearch() {
    const builder = await KiwiBuilder.create();
    const kiwi = builder.build();
    const tokens = kiwi.analyze(
        "다음은 예시 텍스트입니다.",
        Match.allWithNormalizing
    );
    console.log(tokens);
    return;
}

memorySearch();
