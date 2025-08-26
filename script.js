// Defines the navigation paths, including the next box, the arrow, and the arrow's color/label.
const navigationMap = {
    'start': { 
        yes: { nextBox: 'nma-approaches', arrowGroup: 'arrow-group-start-nma', color: '#3b82f6', label: 'Yes' }, 
        no: { nextBox: 'itc-approaches', arrowGroup: 'arrow-group-start-itc', color: '#ef4444', label: 'No' } 
    },
    'nma-approaches': { next: { nextBox: 'ipd-network', arrowGroup: 'arrow-group-nma-ipd', color: '#333', label: '' } },
    'ipd-network': { 
        yes: { nextBox: 'ipd-nma', arrowGroup: 'arrow-group-ipd-network-yes', color: '#3b82f6', label: 'Yes' }, 
        no: { nextBox: 'anchored', arrowGroup: 'arrow-group-ipd-network-no', color: '#ef4444', label: 'No' } 
    },
    'anchored': { 
        yes: { nextBox: 'any-ipd', arrowGroup: 'arrow-group-anchored-yes', color: '#3b82f6', label: 'Yes' }, 
        no: { nextBox: 'disconnected-nma', arrowGroup: 'arrow-group-anchored-no', color: '#ef4444', label: 'No' } 
    },
    'any-ipd': { 
        yes: { nextBox: 'ml-nmr', arrowGroup: 'arrow-group-any-ipd-mlnmr', color: '#3b82f6', label: 'Yes' }, 
        no: { nextBox: 'effect-modification', arrowGroup: 'arrow-group-any-ipd-effectmod', color: '#ef4444', label: 'No' } 
    },
    'effect-modification': { 
        yes: { nextBox: 'network-meta-regression', arrowGroup: 'arrow-group-effect-mod-yes', color: '#3b82f6', label: 'Yes' }, 
        no: { nextBox: 'nma', arrowGroup: 'arrow-group-effect-mod-no', color: '#ef4444', label: 'No' } 
    },
    'itc-approaches': { next: { nextBox: 'key-treatment-anchored', arrowGroup: 'arrow-group-itc-key', color: '#333', label: '' } },
    'key-treatment-anchored': { 
        yes: { nextBox: 'ipd-itc', arrowGroup: 'arrow-group-key-anchored-yes', color: '#3b82f6', label: 'Yes' }, 
        no: { nextBox: 'unanchored-itc', arrowGroup: 'arrow-group-key-anchored-no', color: '#ef4444', label: 'No' } 
    },
    'unanchored-itc': { next: { nextBox: 'run-maic-unanchored', arrowGroup: 'arrow-group-unanchored-maic', color: '#333', label: '' } },
    'ipd-itc': { 
        yes: { nextBox: 'ipd-nma', arrowGroup: 'arrow-group-ipd-itc-yes', color: '#3b82f6', label: 'Yes' }, 
        no: { nextBox: 'external-population', arrowGroup: 'arrow-group-ipd-itc-no', color: '#ef4444', label: 'No' } 
    },
    'external-population': { 
        yes: { nextBox: 'ml-nmr', arrowGroup: 'arrow-group-external-pop-yes', color: '#3b82f6', label: 'Yes' }, 
        no: { nextBox: 'run-maic', arrowGroup: 'arrow-group-external-pop-no', color: '#ef4444', label: 'No' } 
    },
    'run-maic': { next: { nextBox: 'covariate-overlap', arrowGroup: 'arrow-group-run-maic-next', color: '#333', label: '' } },
    'covariate-overlap': { 
        yes: { nextBox: 'maic', arrowGroup: 'arrow-group-covariate-yes', color: '#3b82f6', label: 'Yes' }, 
        no: { nextBox: 'ml-nmr', arrowGroup: 'arrow-group-covariate-no', color: '#ef4444', label: 'No' } 
    },
    'run-maic-unanchored': { next: { nextBox: 'covariate-overlap-unanchored', arrowGroup: 'arrow-group-maic-covariate', color: '#333', label: '' } },
    'covariate-overlap-unanchored': {
        yes: { nextBox: 'maic', arrowGroup: 'arrow-group-covariate-unanchored-maic-redirect', color: '#3b82f6', label: 'Yes' },
        no: { nextBox: 'unanchored-stc', arrowGroup: 'arrow-group-covariate-stc', color: '#ef4444', label: 'No' }
    }
};

function drawArrow(startId, endId, pathConfig) {
    const startEl = document.getElementById(startId);
    const endEl = document.getElementById(endId);
    const arrowGroup = document.getElementById(pathConfig.arrowGroup);
    const pathEl = arrowGroup.querySelector('path');
    const textEl = arrowGroup.querySelector('text');

    if (!startEl || !endEl || !arrowGroup) return;

    const startRect = startEl.getBoundingClientRect();
    const endRect = endEl.getBoundingClientRect();
    const containerRect = startEl.closest('.diagram-container').getBoundingClientRect();

    const startX = startRect.left - containerRect.left;
    const startY = startRect.top - containerRect.top;
    const endX = endRect.left - containerRect.left;
    const endY = endRect.top - containerRect.top;
    
    const startWidth = startEl.offsetWidth;
    const startHeight = startEl.offsetHeight;
    const endWidth = endEl.offsetWidth;
    const endHeight = endEl.offsetHeight;

    let p1, p2;
    let pathString;
    let textPoint;
    const labelOffset = 15;
    let isStraightLine = false;

    // --- Handle Special Cases for specific connections ---
    if (startId === 'ipd-network' && endId === 'ipd-nma') {
        p1 = { x: startX + startWidth, y: startY + startHeight / 2 }; 
        p2 = { x: endX + endWidth / 2, y: endY }; 
    } else if (startId === 'external-population' && endId === 'ml-nmr') {
        p1 = { x: startX, y: startY + startHeight / 2 }; 
        p2 = { x: endX + endWidth / 2, y: endY }; 
    } else if (startId === 'covariate-overlap' && endId === 'ml-nmr') {
        p1 = { x: startX, y: startY + startHeight / 2 }; 
        p2 = { x: endX + endWidth / 2, y: endY + endHeight }; 
    }
    // --- Handle General Cases ---
    else if (Math.abs((startX + startWidth / 2) - (endX + endWidth / 2)) < 10) { // Increased tolerance for vertical
        p1 = { x: startX + startWidth / 2, y: startY + startHeight };
        p2 = { x: endX + endWidth / 2, y: endY };
        isStraightLine = true;
    } else if (Math.abs((startY + startHeight / 2) - (endY + endHeight / 2)) < 10) { // Increased tolerance for horizontal
        p1 = { x: startX + startWidth, y: startY + startHeight / 2 };
        p2 = { x: endX, y: endY + endHeight / 2 };
         if (p1.x > p2.x) { 
            p1.x = startX;
            p2.x = endX + endWidth;
        }
        isStraightLine = true;
    } else { 
        if (endY > startY + startHeight) { 
            p1 = { x: startX + startWidth / 2, y: startY + startHeight };
            p2 = { x: endX + endWidth / 2, y: endY };
        } else if (endX > startX) { 
            p1 = { x: startX + startWidth, y: startY + startHeight / 2 };
            p2 = { x: endX, y: endY + endHeight / 2 };
        } else { 
            p1 = { x: startX, y: startY + startHeight / 2 };
            p2 = { x: endX + endWidth, y: endY + endHeight / 2 };
        }
    }
    
    if (isStraightLine) {
         pathString = `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y}`;
    } else {
        let cp1 = { ...p1 };
        let cp2 = { ...p2 };
        const yOffset = Math.max(60, Math.abs(p1.y - p2.y) / 4);
        const xOffset = Math.max(60, Math.abs(p1.x - p2.x) / 4);

        if (Math.abs(p1.y - p2.y) > Math.abs(p1.x - p2.x)) {
             cp1.y += (p2.y > p1.y ? yOffset : -yOffset);
             cp2.y -= (p2.y > p1.y ? yOffset : -yOffset);
        } else {
             cp1.x += (p2.x > p1.x ? xOffset : -xOffset);
             cp2.x -= (p2.x > p1.x ? xOffset : -xOffset);
        }
        pathString = `M ${p1.x} ${p1.y} C ${cp1.x} ${cp1.y}, ${cp2.x} ${cp2.y}, ${p2.x} ${p2.y}`;
    }
    
    pathEl.setAttribute('d', pathString);
    pathEl.style.stroke = pathConfig.color;

    // Calculate midpoint for label placement
    const tempPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    tempPath.setAttribute("d", pathString);
    const pathLength = tempPath.getTotalLength();
    const midPoint = tempPath.getPointAtLength(pathLength / 2);
    
    if (isStraightLine && Math.abs(p1.x - p2.x) < 10) { // Vertical line
        textPoint = { x: midPoint.x + labelOffset, y: midPoint.y };
    } else { // Horizontal or curved line
        textPoint = { x: midPoint.x, y: midPoint.y - labelOffset };
    }
    
    textEl.setAttribute('x', textPoint.x);
    textEl.setAttribute('y', textPoint.y);
    textEl.textContent = pathConfig.label;
    textEl.style.fill = pathConfig.color;

    arrowGroup.classList.remove('hidden');
}

function navigate(fromId, choice, buttonEl) {
    const pathConfig = navigationMap[fromId]?.[choice];
    if (!pathConfig) return;

    const nextBoxId = pathConfig.nextBox;
    const nextBox = document.getElementById(nextBoxId);
    if (nextBox) {
        nextBox.classList.remove('hidden');
    }

    setTimeout(() => {
        drawArrow(fromId, nextBoxId, pathConfig);
    }, 10);

    buttonEl.disabled = true;
}

function redrawAllArrows() {
    Object.keys(navigationMap).forEach(startId => {
        const choices = navigationMap[startId];
        Object.keys(choices).forEach(choice => {
            const fromBox = document.getElementById(startId);
            const buttons = fromBox.querySelectorAll('.decision-btn');
            let targetButton;
            buttons.forEach(btn => {
                if (btn.textContent.toLowerCase() === choice) {
                    targetButton = btn;
                } else if (choice === 'next' && btn.textContent === 'Next') {
                    targetButton = btn;
                }
            });

            if (targetButton && targetButton.disabled) {
                const pathConfig = choices[choice];
                const endId = pathConfig.nextBox;
                drawArrow(startId, endId, pathConfig);
            }
        });
    });
}

function resetDiagram() {
    document.querySelectorAll('.decision-box').forEach(box => {
        if (box.id !== 'start') box.classList.add('hidden');
    });
    document.querySelectorAll('svg g').forEach(group => {
        group.classList.add('hidden');
    });
    document.querySelectorAll('.decision-btn').forEach(button => {
        button.disabled = false;
    });
}

document.getElementById('reset-btn').addEventListener('click', resetDiagram);
window.addEventListener('resize', redrawAllArrows);

// --- Modal Logic ---
const modal = document.getElementById("outcomeModal");
const modalTitle = document.getElementById("modalTitle");
const modalBody = document.getElementById("modalBody");
const span = document.getElementsByClassName("close-btn")[0];

const genericModalContent = `
    <h3 class="font-semibold text-lg mt-4">Assumptions</h3>
    <p>Generic assumptions text...</p>
    <h3 class="font-semibold text-lg mt-4">Limitations</h3>
    <p>Generic limitations text...</p>
`;

const modalContentMap = {
    'ipd-nma': `
        <h3 class="font-semibold text-lg mt-4">Assumptions</h3>
        
        <ul>
          <li>
            <strong>Transitivity/Consistency:</strong> The validity of combining direct and indirect evidence relies on the consistency assumption, meaning the relative treatment effects should be exchangeable across trials once key effect modifiers are accounted for.<br>
          </li>
          <li>
            <strong>Exchangeability:</strong> Participant-level data from different studies are assumed sufficiently similar with respect to effect modifiers (such as age, baseline risk, and study quality), supporting meaningful synthesis.<br>
          </li>
          <li>
            <strong>Conditional Independence:</strong> Treatment effects can be modelled, and covariate adjustments made, assuming the same covariate-treatment relationship applies across included trials.<br>
          </li>
          <li>
            <strong>Data Completeness:</strong> The key prognostic factors and effect modifiers are available and harmonised across the IPD datasets.<br>
          </li>
        </ul>
        
        <h3 class="font-semibold text-lg mt-4">Limitations</h3>
        <ul>
            <li>
              <strong>Resource-Intensive:</strong> Substantial time and expertise are required to acquire, check, harmonise, and analyze IPD from multiple studies, often extending projects to years.<br>
            </li>
            <li>
              <strong>Data Availability Bias:</strong> Not all studies provide IPD; exclusion may result in selection bias if unavailable studies differ systematically.<br>
            </li>
            <li>
              <strong>Complex Statistics:</strong> Advanced statistical modelling (e.g., multilevel network meta-regression) is often necessary, increasing analytical complexity.<br>
            </li>
            <li>
              <strong>Heterogeneity & Inconsistency Risk:</strong> Despite harmonization efforts, residual heterogeneity and inconsistency may remain due to unmeasured or unharmonised effect modifiers.<br>
            </li>
            <li>
              <strong>Ethical & Privacy Issues:</strong> Handling, storing, and sharing sensitive participant data involve strict data governance and ethical considerations.<br>
            </li>
          </ul>
          
        <h3 class="font-semibold text-lg mt-4">Key References</h3>
        <ul>
            <li>
              Chaimani A. <strong>Conduct and reporting of individual participant data network meta-analyses need improvement.</strong>
              <i>BMC Medicine</i>. 2020;18(1):156.
              <a href="https://doi.org/10.1186/s12916-020-01613-3" target="_blank">https://doi.org/10.1186/s12916-020-01613-3</a>
            </li>
            <li>
              Dias S, Ades AE, Welton NJ, et al. <strong>Network meta-analysis for decision-making.</strong> Wiley, 2018.
              <a href="https://www.agropustaka.id/wp-content/uploads/2020/04/agropustaka.id_buku_Network-Meta-Analysis-for-Decision-Making.pdf" target="_blank">https://www.agropustaka.id/wp-content/uploads/2020/04/agropustaka.id_buku_Network-Meta-Analysis-for-Decision-Making.pdf</a>
            </li>
            <li>
              Riley RD, Dias S, Donegan S, et al. <strong>Using individual participant data to improve network meta-analysis projects.</strong>
              <i>BMJ Evidence-Based Medicine</i>. 2023;28(3):197-203.
              <a href="https://ebm.bmj.com/content/28/3/197" target="_blank">https://ebm.bmj.com/content/28/3/197</a>
            </li>
            <li>
              Riley RD, Tierney JF, Stewart LA, editors. <strong>Individual Participant Data Meta-Analysis: A Handbook for Healthcare Research.</strong> Wiley, 2021.
              <a href="https://www.wiley-vch.de/en/fachgebiete/mathematik-und-statistik/individual-participant-data-meta-analysis-978-1-119-33372-2" target="_blank">https://www.wiley-vch.de/en/fachgebiete/mathematik-und-statistik/individual-participant-data-meta-analysis-978-1-119-33372-2</a>
            </li>
          </ul>`,
    'network-meta-regression': `
        <h3 class="font-semibold text-lg mt-4">Assumptions</h3>
        <p>Boilerplate assumptions text for Network Meta-Regression...</p>
        <h3 class="font-semibold text-lg mt-4">Limitations</h3>
        <p>Boilerplate limitations text for Network Meta-Regression...</p>`,
    'nma': `
        <h3 class="font-semibold text-lg mt-4">Assumptions</h3>
        <p>Boilerplate assumptions text for NMA...</p>
        <h3 class="font-semibold text-lg mt-4">Limitations</h3>
        <p>Boilerplate limitations text for NMA...</p>`,
    'ml-nmr': `
        <h3 class="font-semibold text-lg mt-4">Assumptions</h3>
        <p>Boilerplate assumptions text for ML-NMR...</p>
        <h3 class="font-semibold text-lg mt-4">Limitations</h3>
        <p>Boilerplate limitations text for ML-NMR...</p>`,
    'maic': `
        <h3 class="font-semibold text-lg mt-4">Assumptions</h3>
        <p>Boilerplate assumptions text for MAIC...</p>
        <h3 class="font-semibold text-lg mt-4">Limitations</h3>
        <p>Boilerplate limitations text for MAIC...</p>`,
    'unanchored-stc': `
        <h3 class="font-semibold text-lg mt-4">Assumptions</h3>
        <p>Boilerplate assumptions text for STC...</p>
        <h3 class="font-semibold text-lg mt-4">Limitations</h3>
        <p>Boilerplate limitations text for STC...</p>`,
    'disconnected-nma': `
        <h3 class="font-semibold text-lg mt-4">Population</h3>
        <p>Details about population considerations for disconnected networks...</p>
        <h3 class="font-semibold text-lg mt-4">Interventions/Comparators</h3>
        <p>Details about intervention/comparator considerations for disconnected networks...</p>
        <h3 class="font-semibold text-lg mt-4">Outcomes</h3>
        <p>Details about outcome considerations for disconnected networks...</p>
        <h3 class="font-semibold text-lg mt-4">Study Designs</h3>
        <p>Details about study design considerations for disconnected networks...</p>
        <h3 class="font-semibold text-lg mt-4">References</h3>
        <p>Stevens JW et al. (2018) A review of methods for comparing treatments evaluated in studies that form disconnected networks of evidence.</p>`
};

document.querySelectorAll('.outcome-box').forEach(box => {
    box.style.cursor = 'pointer';
    box.addEventListener('click', () => {
        modalTitle.textContent = box.querySelector('p').textContent;
        // Use specific content if available, otherwise use generic
        modalBody.innerHTML = modalContentMap[box.id] || genericModalContent;
        modal.style.display = "block";
    });
});

span.onclick = () => modal.style.display = "none";
window.onclick = (event) => {
    if (event.target == modal) modal.style.display = "none";
};