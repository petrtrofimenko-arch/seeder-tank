const hopperVolumes = [2250, 1650, 2250];

// Плотности семян (кг/л)
const seedDensities = {
    wheat: 0.75,
    rapeseed: 0.70,
    pea: 0.80,
    oats: 0.45,
    corn: 0.72,
    lentil: 0.67,
    flax: 0.62,
    barley: 0.61,
    soy: 0.72,
    chickpea: 0.82,
    rye: 0.72
};

// Плотности удобрений (кг/л)
const fertDensities = {
    ammonium: 0.73,           // Аммиачная селитра
    superphosphate: 0.95,    // Суперфосфат гранулированный
    dap: 0.85,               // Диаммофос (АММОФОС)
    npk: 1.05,               // Нитроаммофоска
    urea: 0.75,              // Карбамид (прибл. плотность)
    sa: 0.96                 // Сульфат аммония
};

document.getElementById('calculateBtn').addEventListener('click', () => {
    const seedRateInput = parseFloat(document.getElementById('seedRate').value);
    const seedType = document.getElementById('seedType').value;

    const fertRateInput = parseFloat(document.getElementById('fertRate').value);
    const fertType = document.getElementById('fertType').value;

    const hopperSections = Array.from(document.querySelectorAll('.hopperSection'))
                                .map(select => select.value);

    const resultsDiv = document.getElementById('results');

    if (isNaN(seedRateInput) || !seedType ||
        isNaN(fertRateInput) || !fertType ||
        hopperSections.length !== 3 || hopperSections.some(v => !v)) {
        resultsDiv.innerHTML = `<span style="color:red">Пожалуйста, заполните все поля / Please fill in all fields</span>`;
        return;
    }

    const sectionData = hopperSections.map((type, i) => {
        const density = type === 'seed'
            ? seedDensities[seedType]
            : fertDensities[fertType];

        const weight = hopperVolumes[i] * density;

        return { index: i, type, volume: hopperVolumes[i], density, weight };
    });

    function calculateSectionRates(sections, totalRateInput) {
        const totalWeight = sections.reduce((sum, s) => sum + s.weight, 0);
        sections.forEach(sec => {
            sec.proportionalRate = totalRateInput * (sec.weight / totalWeight);
            sec.hectares = sec.weight / sec.proportionalRate;
        });
    }

    const seedSections = sectionData.filter(s => s.type === 'seed');
    const fertSections = sectionData.filter(s => s.type === 'fert');

    if (seedSections.length > 0) calculateSectionRates(seedSections, seedRateInput);
    if (fertSections.length > 0) calculateSectionRates(fertSections, fertRateInput);

    let output = `<strong>Секция / Hopper Section Distribution:</strong><br><br>`;
    sectionData.forEach(sec => {
        const typeLabel = sec.type === 'seed' ? `Семена / Seed` : `Удобрение / Fertilizer`;
        output += `Секция / Hopper Section ${sec.index + 1} (${typeLabel}):<br>`;
        output += `&nbsp;&nbsp;Объём / Volume: ${sec.volume} l<br>`;
        output += `&nbsp;&nbsp;Плотность / Density: ${sec.density} кг/л<br>`;
        output += `&nbsp;&nbsp;Вместимость / Capacity: ${sec.weight.toFixed(1)} кг<br>`;
        output += `&nbsp;&nbsp;Норма / Rate: ${sec.proportionalRate.toFixed(1)} кг/га<br>`;
        output += `&nbsp;&nbsp;Хватит на / Covers: ${sec.hectares.toFixed(1)} га<br><br>`;
    });

    resultsDiv.innerHTML = output;
});