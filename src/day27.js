function getMostFrequent(json) {
  return json.temperature.map((day) => {
    // We'll track frequency and last index for each temperature
    const freq = {};
    const lastIdx = {};

    // First, collect  count and last occurrence index
    for (let i = 0; i < day.length; i++) {
      const temp = day[i];
      freq[temp] = (freq[temp] || 0) + 1;
      lastIdx[temp] = i; // always update → ends up as last index
    }

    let bestTemp = day[0];
    let maxFreq = 0;
    let bestLastIdx = -1;

    // Now find the best temperature based on rules
    for (const temp in freq) {
      const count = freq[temp];
      const idx = lastIdx[temp];
      // Update if:
      // - higher frequency, OR
      // - same frequency but appears later
      if (count > maxFreq || (count === maxFreq && idx > bestLastIdx)) {
        maxFreq = count;
        bestLastIdx = idx;
        bestTemp = +temp; // convert string key back to number
      }
    }

    return bestTemp;
  });
}

const input = {
  temperature: [
    [15, 17, 19, 21, 21, 21, 20, 16],
    [16, 17, 22, 22, 22, 22, 20, 16],
    [12, 17, 19, 20, 20, 20, 20, 18],
    [14, 15, 19, 19, 20, 22, 18, 17],
    [15, 17, 24, 24, 24, 20, 20, 20],
  ],
};

console.log(getMostFrequent(input));
