function calculateBM25(memory, query, k1 = 1.5, b = 0.75) {
    if (typeof query === "string") {
      query = query.split(/\s+/);
    }
    
    const corpus = memory.map(m => m.memory.split(/\s+/)); // 한국어 형태소 분석해야 함...
  
    const totalDocuments = corpus.length;
  
    const avgDocLength = totalDocuments > 0 
      ? corpus.reduce((sum, doc) => sum + doc.length, 0) / totalDocuments 
      : 0;
  
    const termFrequency = [];
    const documentFrequency = {};
  
    corpus.forEach(doc => {
      const tf = {};
      const seenTerms = new Set();
  
      doc.forEach(word => {
        tf[word] = (tf[word] || 0) + 1;
        if (!seenTerms.has(word)) {
          documentFrequency[word] = (documentFrequency[word] || 0) + 1;
          seenTerms.add(word);
        }
      });
  
      termFrequency.push(tf);
    });
  
    const idf = {};
    for (const term in documentFrequency) {
      if (documentFrequency[term] > 0) {
        idf[term] = Math.log(
          ((totalDocuments - documentFrequency[term] + 0.5) /
            (documentFrequency[term] + 0.5)) + 1
        );
      } else {
        idf[term] = 0;
      }
    }
  
    const scores = corpus.map((doc, docIndex) => {
      const docLength = doc.length;
      let score = 0;
  
      query.forEach(term => {
        if (termFrequency[docIndex][term]) {
          const tf = termFrequency[docIndex][term];
          const termScore =
            idf[term] *
            ((tf * (k1 + 1)) /
              (tf + k1 * (1 - b + b * (docLength / avgDocLength))));
          score += termScore;
        }
      });
  
      score *= (memory[docIndex].importance ?? 1);
      console.log(score)
  
      return score;
    });
  
    return memory
      .map((m, idx) => ({
        time: m.time,
        memory: m.memory,
        importance: m.importance,
        score: scores[idx],
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);                    
  }

export default calculateBM25;